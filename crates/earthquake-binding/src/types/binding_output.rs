use derive_more::Debug;
use earthquake_common::RoutePrepareOutput;
use napi_derive::napi;

#[derive(Default, Debug, Clone)]
#[napi(object)]
pub struct BindingOutputRouteMetadataItem {
  pub path: String,
  pub alt_path: Option<String>,
}

#[derive(Default, Debug, Clone)]
#[napi(object)]
pub struct BindingOutputRouteMetadata {
  /// Icon metadata.
  pub icon: Vec<BindingOutputRouteMetadataItem>,
  /// Apple metadata.
  pub apple: Vec<BindingOutputRouteMetadataItem>,
  /// Twitter metadata.
  pub twitter: Vec<BindingOutputRouteMetadataItem>,
  /// Open Graph metadata.
  pub open_graph: Vec<BindingOutputRouteMetadataItem>,
  /// Sitemap metadata.
  pub sitemap: Option<BindingOutputRouteMetadataItem>,
}

/// Route modules used in Earthquake routing.
#[derive(Default, Debug, Clone)]
#[napi(object)]
pub struct BindingOutputRoute {
  /// The path of the route.
  pub path: String,
  /// The current content of the page module.
  pub page: Option<String>,
  /// The current content of the layout module.
  pub layout: Option<String>,
  /// The current content of the error module.
  pub error: Option<String>,
  /// The current content of the global error module.
  pub global_error: Option<String>,
  /// The current content of the global not found module.
  pub global_not_found: Option<String>,
  /// The current content of the loading module.
  pub loading: Option<String>,
  /// The current content of the template module.
  pub template: Option<String>,
  /// The current content of the forbidden module.
  pub forbidden: Option<String>,
  /// The current content of the unauthorized module.
  pub unauthorized: Option<String>,
  /// The current content of the not found module.
  pub not_found: Option<String>,
  /// The current content of the default module.
  pub default: Option<String>,
  /// The current content of the API route module.
  pub api: Option<String>,
  /// Metadata associated with the route.
  pub metadata: Option<BindingOutputRouteMetadata>,
}

#[derive(Default, Debug)]
#[napi_derive::napi(object)]
pub struct BindingPrepareRoutesOutput {
  pub routes: Vec<BindingOutputRoute>,
}

impl From<Vec<RoutePrepareOutput>> for BindingPrepareRoutesOutput {
  fn from(value: Vec<RoutePrepareOutput>) -> BindingPrepareRoutesOutput {
    let routes = value
      .into_iter()
      .map(|route_prepare_output: RoutePrepareOutput| BindingOutputRoute {
        path: route_prepare_output.path.into_string(),
        page: if let Some(module) = route_prepare_output.modules.page {
          Some(module.content)
        } else {
          None
        },
        layout: if let Some(module) = route_prepare_output.modules.layout {
          Some(module.content)
        } else {
          None
        },
        error: if let Some(module) = route_prepare_output.modules.error {
          Some(module.content)
        } else {
          None
        },
        global_error: if let Some(module) = route_prepare_output.modules.global_error {
          Some(module.content)
        } else {
          None
        },
        global_not_found: if let Some(module) = route_prepare_output.modules.global_not_found {
          Some(module.content)
        } else {
          None
        },
        loading: if let Some(module) = route_prepare_output.modules.loading {
          Some(module.content)
        } else {
          None
        },
        template: if let Some(module) = route_prepare_output.modules.template {
          Some(module.content)
        } else {
          None
        },
        forbidden: if let Some(module) = route_prepare_output.modules.forbidden {
          Some(module.content)
        } else {
          None
        },
        unauthorized: if let Some(module) = route_prepare_output.modules.unauthorized {
          Some(module.content)
        } else {
          None
        },
        not_found: if let Some(module) = route_prepare_output.modules.not_found {
          Some(module.content)
        } else {
          None
        },
        default: if let Some(module) = route_prepare_output.modules.default {
          Some(module.content)
        } else {
          None
        },
        api: if let Some(module) = route_prepare_output.modules.api {
          Some(module.content)
        } else {
          None
        },
        metadata: None,
      })
      .collect();

    BindingPrepareRoutesOutput { routes }
  }
}
