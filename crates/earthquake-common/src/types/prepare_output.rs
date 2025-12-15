use derive_more::Debug;
use earthquake_error::EarthquakeDiagnostic;

use crate::RoutePrepareOutput;

#[derive(Default, Debug)]
pub struct PrepareOutput {
  pub warnings: Vec<EarthquakeDiagnostic>,
  pub routes: Vec<RoutePrepareOutput>,
}
