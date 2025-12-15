use crate::EarthquakeDiagnostic;

pub fn downcast_napi_error_diagnostics(err: anyhow::Error) -> anyhow::Result<EarthquakeDiagnostic> {
  #[cfg(feature = "napi")]
  {
    err.downcast::<napi::Error>().map(EarthquakeDiagnostic::napi_error)
  }
  #[cfg(not(feature = "napi"))]
  {
    Err(err)
  }
}
