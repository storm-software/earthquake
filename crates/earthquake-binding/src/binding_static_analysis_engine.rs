use crate::{
  types::{
    binding_error::{BindingError, BindingErrors, BindingResult},
    binding_options::BindingOptions,
    binding_output::BindingPrepareRoutesOutput,
  },
  utils::{handle_result, handle_warnings, to_binding_error},
};
use earthquake_core::{RouteHandle, StaticAnalysisEngine};
use napi::{Env, bindgen_prelude::PromiseRaw};
use napi_derive::napi;

#[napi]
#[derive(Debug)]
pub struct BindingStaticAnalysisEngine {
  inner: StaticAnalysisEngine,
  last_handle: Option<RouteHandle>,
}

#[napi]
impl BindingStaticAnalysisEngine {
  #[napi(constructor)]
  pub fn new(options: BindingOptions) -> napi::Result<Self> {
    let inner = StaticAnalysisEngine::new(options.into());
    if inner.is_err() {
      return Err(napi::Error::from_reason(
        inner
          .err()
          .unwrap()
          .iter()
          .map(|e| e.to_diagnostic().to_string())
          .collect::<Vec<_>>()
          .join("\n"),
      ));
    }

    Ok(Self { inner: inner.expect("Unable to create earthquake engine"), last_handle: None })
  }

  #[napi]
  pub fn prepare<'env>(
    &mut self,
    env: &'env Env,
  ) -> napi::Result<PromiseRaw<'env, BindingResult<BindingPrepareRoutesOutput>>> {
    let maybe_route = self.inner.prepare();
    if let Ok(route) = &maybe_route {
      self.last_handle = Some(route.context());
    }

    let fut = async move {
      let route = maybe_route.map_err(|err| {
        napi::Error::new(
          napi::Status::GenericFailure,
          err.iter().map(|e| e.to_diagnostic().to_string()).collect::<Vec<_>>().join("\n"),
        )
      })?;

      let route_prepare_output = match route.prepare().await {
        Ok(output) => output,
        Err(errs) => {
          let errors: Vec<BindingError> = errs
            .into_vec()
            .iter()
            .map(|diagnostic| to_binding_error(diagnostic, route.options().paths.root.clone()))
            .collect();
          return Ok(napi::Either::A(BindingErrors::new(errors)));
        }
      };

      let binding_prepare_routes_output =
        BindingPrepareRoutesOutput::from(vec![route_prepare_output.clone()]);

      if let Err(err) = handle_warnings(
        route_prepare_output.path.as_str(),
        route_prepare_output.warnings,
        route.options(),
      )
      .await
      {
        let error = to_binding_error(&err.into(), route.options().paths.root.clone());
        return Ok(napi::Either::A(BindingErrors::new(vec![error])));
      }

      Ok(napi::Either::B(binding_prepare_routes_output))
    };

    env.spawn_future(fut)
  }

  #[napi]
  // - `StaticAnalysisEngine::close()/inner.close()` requires acquiring `&mut self`
  // - Acquiring `&mut self` in async napi `fn` is unsafe, so we must use a sync `fn` here.
  // - But `StaticAnalysisEngine::close()/inner.close()` contains async cleanup operations, so we have await its returned future
  // in another async context instead of directly calling `close().await`.
  // - This also affects how the code is written in `StaticAnalysisEngine::close()/inner.close()`, see the implementation there for more details.
  pub fn close<'env>(&mut self, env: &'env Env) -> napi::Result<PromiseRaw<'env, ()>> {
    let cleanup_fut = self.inner.close();
    env.spawn_future(async move {
      let res = cleanup_fut.await;
      handle_result(res)?;
      Ok(())
    })
  }

  #[napi(getter)]
  pub fn is_closed(&self) -> bool {
    self.inner.is_closed()
  }
}

// impl BindingPreparer {
//   fn normalize_binding_options(
//     option: BindingOptions,
//   ) -> napi::Result<NormalizeBindingOptionsReturn> {
//     let BindingBundlerOptions { input_options, output_options, parallel_plugins_registry } = option;

//     #[cfg(not(target_family = "wasm"))]
//     let worker_count =
//       parallel_plugins_registry.as_ref().map(|registry| registry.worker_count).unwrap_or_default();
//     #[cfg(not(target_family = "wasm"))]
//     let parallel_plugins_map =
//       parallel_plugins_registry.map(|registry| registry.take_plugin_values());

//     #[cfg(not(target_family = "wasm"))]
//     let worker_manager = if worker_count > 0 {
//       use crate::worker_manager::WorkerManager;
//       Some(WorkerManager::new(worker_count))
//     } else {
//       None
//     };

//     let ret = normalize_binding_options(
//       input_options,
//       output_options,
//       #[cfg(not(target_family = "wasm"))]
//       parallel_plugins_map,
//       #[cfg(not(target_family = "wasm"))]
//       worker_manager,
//     )?;

//     Ok(ret)
//   }
// }
