use std::{
  any::Any,
  fs,
  sync::{
    Arc, Mutex,
    atomic::{AtomicU32, Ordering},
  },
};

use camino::Utf8PathBuf;
use earthquake_common::{NormalizedOptions, SharedNormalizedOptions};
use earthquake_error::{EarthquakeDiagnostic, EarthquakeResult};
use earthquake_plugin::{PluginDriverFactory, pluginable::SharedPluginable};
use earthquake_tracing::{Session, generate_route_id, try_init_tracing};
use storm_config::workspace_config::WorkspaceConfig;

use crate::{Route, RouteHandle};

#[derive(Debug, Default)]
pub struct RouteFactoryOptions {
  pub options: NormalizedOptions,
  pub plugins: Vec<SharedPluginable>,
  pub session: Option<Session>,
}

pub struct RouteFactory {
  pub(super) options: SharedNormalizedOptions,
  pub(super) config: WorkspaceConfig,
  pub(super) session: Session,
  pub(super) plugin_driver_factory: PluginDriverFactory,
  pub warnings: Mutex<Vec<EarthquakeDiagnostic>>,
  pub(crate) _log_guard: Option<Box<dyn Any + Send>>,
  pub last_handle: Mutex<Option<RouteHandle>>,
  pub route_id_seed: AtomicU32,
}

impl RouteFactory {
  pub(crate) fn new(opts: RouteFactoryOptions) -> Self {
    let session = opts.session.unwrap_or_else(Session::dummy);

    let config =
      WorkspaceConfig::from_workspace_root(opts.options.paths.workspace_root.as_std_path())
        .expect("Unable to resolve the workspace configuration");

    let maybe_guard = if opts.options.disable_tracing { None } else { try_init_tracing() };

    let plugin_driver_factory = PluginDriverFactory::new(opts.plugins);

    Self {
      plugin_driver_factory,
      options: Arc::new(opts.options),
      config,
      warnings: Mutex::new(Vec::new()),
      _log_guard: maybe_guard,
      session,
      route_id_seed: AtomicU32::new(0),
      last_handle: Mutex::new(None),
    }
  }

  /// A function to create a `Route` object (using `options.paths.routes_path` as the root)
  pub(crate) fn create<'a>(&self) -> EarthquakeResult<Route<'a>> {
    self.create_route(self.options.paths.routes_path.clone(), None)
  }

  fn generate_unique_route_span(&self) -> Arc<tracing::Span> {
    let seed = self.route_id_seed.fetch_add(1, Ordering::Relaxed);
    let route_id = generate_route_id(seed);
    Arc::new(tracing::info_span!(
      parent: &self.session.span,
      "route",
      CONTEXT_route_id = route_id.as_ref(),
    ))
  }

  fn create_route<'a>(
    &self,
    path: Utf8PathBuf,
    parent: Option<&'a Route<'a>>,
  ) -> EarthquakeResult<Route<'a>> {
    let route_span = self.generate_unique_route_span();

    let plugin_driver =
      self.plugin_driver_factory.create_plugin_driver(&self.options, &self.session, &route_span);

    let mut route = Route::new(
      path,
      parent,
      Arc::clone(&self.options),
      plugin_driver,
      std::mem::take(&mut *self.warnings.lock().unwrap()),
      route_span,
    );

    route.children = Arc::new(if route.into_absolute_path().is_dir() {
      match fs::read_dir(route.into_absolute_path()) {
        Ok(read_dir) => read_dir
          .filter(|entry| entry.as_ref().is_ok_and(|e| e.path().is_dir()))
          .flat_map(|entry| {
            let entry = match entry {
              Ok(entry) => entry,
              Err(err) => {
                return Err(
                  EarthquakeDiagnostic::unable_to_read_dir(route.into_absolute_path(), err).into(),
                );
              }
            };

            let absolute_path =
              Utf8PathBuf::from_path_buf(entry.path()).expect("Unable to determine route path")
            else {
              return Err(EarthquakeDiagnostic::path_is_not_valid_utf8(entry.path()).into());
            };

            let relative_path = match absolute_path.strip_prefix(route.into_absolute_path()) {
              Ok(relative_path) => relative_path.to_path_buf(),
              Err(_) => {
                return Err(
                  EarthquakeDiagnostic::unable_to_strip_root_prefix(
                    absolute_path,
                    route.into_absolute_path(),
                  )
                  .into(),
                );
              }
            };

            self.create_route(relative_path, parent)
          })
          .collect::<Vec<Route<'a>>>(),
        Err(err) => {
          return Err(
            EarthquakeDiagnostic::unable_to_read_dir(route.into_absolute_path(), err).into(),
          );
        }
      }
    } else {
      Vec::new()
    });

    *self.last_handle.lock().unwrap() = Some(route.context());
    Ok(route)
  }

  //   fn check_prefer_builtin_feature(
  //     plugins: &[SharedPluginable],
  //     options: &NormalizedOptions,
  //     warning: &mut Vec<EarthquakeDiagnostic>,
  //   ) {
  //     if !options.checks.contains(EventKindSwitcher::PreferBuiltinFeature) {
  //       return;
  //     }

  //     let map = FxHashMap::from_iter([
  //       // key is the name property of the plugin
  //       // the first element of value is the npm package name of the plugin
  //       // the second element of value is the preferred builtin feature, `None` if the feature is not configured
  //       // the third element of value is an additional message to show
  //       ("inject", ("@rollup/plugin-inject", Some("inject"), None)),
  //       ("node-resolve", ("@rollup/plugin-node-resolve", None, None)),
  //       (
  //         "commonjs",
  //         (
  //           "@rollup/plugin-commonjs",
  //           None,
  //           Some(" Check https://rolldown.rs/in-depth/bundling-cjs for more details."),
  //         ),
  //       ),
  //       ("json", ("@rollup/plugin-json", None, None)),
  //     ]);
  //     for plugin in plugins {
  //       let name = plugin.call_name();
  //       let Some((package_name, feature, additional_message)) = map.get(name.as_ref()) else {
  //         continue;
  //       };
  //       warning.push(
  //         BuildDiagnostic::prefer_builtin_feature(
  //           feature.map(String::from),
  //           (*package_name).to_string(),
  //           *additional_message,
  //         )
  //         .with_severity_warning(),
  //       );
  //     }
  //   }
}
