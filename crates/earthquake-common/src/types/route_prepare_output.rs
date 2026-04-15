use camino::Utf8PathBuf;
use derive_more::Debug;
use earthquake_error::EarthquakeDiagnostic;

use crate::RouteModules;

/// Output of the route preparation process, containing the path, any warnings, and the extracted route modules.
#[derive(Default, Debug)]
pub struct RoutePrepareOutput {
  /// The file path of the route being prepared.
  pub path: Utf8PathBuf,
  /// Any warnings encountered during the route preparation process.
  pub warnings: Vec<EarthquakeDiagnostic>,
  /// The extracted route modules for the route.
  pub modules: RouteModules,
}

impl Clone for RoutePrepareOutput {
  fn clone(&self) -> Self {
    Self { path: self.path.clone(), warnings: Vec::new(), modules: self.modules.clone() }
  }
}
