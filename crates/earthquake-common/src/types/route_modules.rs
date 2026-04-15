use serde::{Deserialize, Serialize};

use crate::{RouteModule, RouteModuleKind, types::metadata::Metadata};

/// Route modules used in Earthquake routing.
#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct RouteModules {
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the page module.
  pub page: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the layout module.
  pub layout: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the error module.
  pub error: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the global error module.
  pub global_error: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the global not found module.
  pub global_not_found: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the loading module.
  pub loading: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the template module.
  pub template: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the forbidden module.
  pub forbidden: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the unauthorized module.
  pub unauthorized: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the not found module.
  pub not_found: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the default module.
  pub default: Option<RouteModule>,
  #[serde(skip_serializing_if = "Option::is_none")]
  /// Extracted data for the API route module.
  pub api: Option<RouteModule>,
  #[serde(skip_serializing_if = "Metadata::is_empty", default)]
  /// Metadata associated with the route.
  pub metadata: Metadata,
}

impl RouteModules {
  /// Check if the route has no modules.
  pub fn is_empty(&self) -> bool {
    self.page.is_none()
      && self.layout.is_none()
      && self.error.is_none()
      && self.global_error.is_none()
      && self.global_not_found.is_none()
      && self.loading.is_none()
      && self.template.is_none()
      && self.forbidden.is_none()
      && self.unauthorized.is_none()
      && self.not_found.is_none()
      && self.default.is_none()
      && self.api.is_none()
      && Metadata::is_empty(&self.metadata)
  }

  //   fn without_leaves(&self) -> Self {
  //     Self {
  //       page: None,
  //       layout: self.layout.clone(),
  //       error: self.error.clone(),
  //       global_error: self.global_error.clone(),
  //       global_not_found: self.global_not_found.clone(),
  //       loading: self.loading.clone(),
  //       template: self.template.clone(),
  //       not_found: self.not_found.clone(),
  //       forbidden: self.forbidden.clone(),
  //       unauthorized: self.unauthorized.clone(),
  //       default: None,
  //       api: None,
  //       metadata: self.metadata.clone(),
  //     }
  //   }
}

impl From<Vec<Option<RouteModule>>> for RouteModules {
  fn from(modules: Vec<Option<RouteModule>>) -> Self {
    let mut route_modules = Self::default();

    for module in modules.into_iter().flatten() {
      match module.kind {
        RouteModuleKind::Page => route_modules.page = Some(module),
        RouteModuleKind::Layout => route_modules.layout = Some(module),
        RouteModuleKind::Error => route_modules.error = Some(module),
        RouteModuleKind::GlobalError => route_modules.global_error = Some(module),
        RouteModuleKind::GlobalNotFound => route_modules.global_not_found = Some(module),
        RouteModuleKind::Loading => route_modules.loading = Some(module),
        RouteModuleKind::Template => route_modules.template = Some(module),
        RouteModuleKind::NotFound => route_modules.not_found = Some(module),
        RouteModuleKind::Forbidden => route_modules.forbidden = Some(module),
        RouteModuleKind::Unauthorized => route_modules.unauthorized = Some(module),
        RouteModuleKind::DefaultPage => route_modules.default = Some(module),
        RouteModuleKind::API => route_modules.api = Some(module),
      }
    }

    route_modules
  }
}
