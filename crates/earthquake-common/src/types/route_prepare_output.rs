use camino::Utf8PathBuf;
use derive_more::Debug;
use earthquake_error::EarthquakeDiagnostic;

use crate::RouteModules;

#[derive(Default, Debug)]
pub struct RoutePrepareOutput {
  pub path: Utf8PathBuf,
  pub warnings: Vec<EarthquakeDiagnostic>,
  pub modules: RouteModules,
}

impl Clone for RoutePrepareOutput {
  fn clone(&self) -> Self {
    Self { path: self.path.clone(), warnings: Vec::new(), modules: self.modules.clone() }
  }
}
