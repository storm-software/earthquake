use derive_more::Debug;
use earthquake_error::EarthquakeDiagnostic;

use crate::RoutePrepareOutput;

/// Output of the preparation process, containing any warnings and the prepared routes.
#[derive(Default, Debug)]
pub struct PrepareOutput {
  /// Any warnings encountered during the preparation process.
  pub warnings: Vec<EarthquakeDiagnostic>,
  /// The prepared routes with their associated modules.
  pub routes: Vec<RoutePrepareOutput>,
}
