use camino::Utf8PathBuf;
use earthquake_common::{
  RouteModule, RouteModuleKind, RouteModules, RoutePrepareOutput, SharedNormalizedOptions,
};
use earthquake_error::{EarthquakeDiagnostic, EarthquakeResult};
use earthquake_plugin::SharedPluginDriver;
use earthquake_tracing::{actions, trace_action, trace_action_enabled};
use std::sync::Arc;

pub(crate) mod route_factory;

pub mod route_handle;
use rayon::iter::{ParallelBridge, ParallelIterator};
pub use route_handle::*;

#[expect(
  clippy::struct_field_names,
  reason = "`route_span` emphasizes this's a span for this route, not a session level span"
)]
#[expect(clippy::rc_buffer, reason = "Arc is needed for multi-threaded usage")]
#[derive(Debug)]
pub struct Route<'a> {
  pub(crate) path: Utf8PathBuf,
  pub(crate) hash: Vec<u8>,
  //   pub(crate) param_name: Option<String>,
  //   pub(crate) param_type: Option<DynamicParamTypes>,
  //   pub(crate) config: Option<AppSegmentConfig>,
  //   pub(crate) generate_static_params: Option<GenerateStaticParams>,
  pub(crate) modules: Arc<RouteModules>,
  pub(crate) parent: Option<&'a Route<'a>>,
  pub(crate) children: Arc<Vec<Route<'a>>>,
  pub(crate) options: SharedNormalizedOptions,
  pub(crate) plugin_driver: SharedPluginDriver,
  pub(crate) warnings: Vec<EarthquakeDiagnostic>,
  pub(crate) route_span: Arc<tracing::Span>,
}

impl<'a> Route<'a> {
  pub fn new(
    path: Utf8PathBuf,
    parent: Option<&'a Route<'a>>,
    options: SharedNormalizedOptions,
    plugin_driver: SharedPluginDriver,
    warnings: Vec<EarthquakeDiagnostic>,
    route_span: Arc<tracing::Span>,
  ) -> Self {
    let absolute_path = options.paths.workspace_root.join(&options.paths.input_path).join(&path);

    let modules = RouteModuleKind::iterator()
      .par_bridge()
      .map(|kind| {
        if !kind.as_file_path(&absolute_path).is_file() {
          return None;
        }

        Some(RouteModule::from(kind.as_file_path(&absolute_path)))
      })
      .collect::<Vec<Option<RouteModule>>>()
      .into();

    Self {
      path,
      parent,
      hash: Vec::new(),
      modules: Arc::new(modules),
      children: Arc::new(Vec::new()),
      options,
      plugin_driver,
      warnings,
      route_span,
    }
  }

  #[inline]
  pub fn options(&self) -> &SharedNormalizedOptions {
    &self.options
  }

  pub fn context(&self) -> RouteHandle {
    RouteHandle {
      options: Arc::clone(&self.options),
      plugin_driver: Arc::clone(&self.plugin_driver),
    }
  }

  pub fn into_absolute_path(&self) -> Utf8PathBuf {
    self.options.paths.workspace_root.join(&self.options.paths.input_path).join(&self.path)
  }

  #[tracing::instrument(level = "debug", skip_all, parent = &*self.route_span)]
  /// This method intentionally get the ownership of `self` to show that the method cannot be called multiple times.
  pub async fn prepare(&self) -> EarthquakeResult<RoutePrepareOutput> {
    async {
      self.trace_action_session_meta();
      trace_action!(actions::RouteAnalyzeStart {
        action: "RoutePrepareStart",
        path: self.path.to_string()
      });

      trace_action!(actions::RouteAnalyzeEnd {
        action: "RoutePrepareEnd",
        path: self.path.to_string()
      });
      Ok(RoutePrepareOutput::default())
    }
    .await
  }

  fn trace_action_session_meta(&self) {
    if trace_action_enabled!() {
      trace_action!(actions::SessionMeta {
        action: "SessionMeta",
        plugins: self
          .plugin_driver
          .plugins()
          .iter()
          .enumerate()
          .map(|(idx, p)| actions::PluginItem {
            name: p.call_name().into_owned(),
            plugin_id: idx.try_into().unwrap()
          })
          .collect(),
        workspace_root: self.options.paths.workspace_root.to_string(),
        project_root: self.options.paths.root.to_string(),
        file: None,
      });
    }
  }
}
