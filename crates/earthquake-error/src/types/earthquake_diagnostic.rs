use std::{
  fmt::Display,
  ops::{Deref, DerefMut},
  path::PathBuf,
};

use crate::{
  Diagnostic, DiagnosticOptions, Severity, downcast_napi_error_diagnostics,
  issues::{
    Issue,
    plugin_error::{CausedPlugin, PluginError},
    unhandleable_error::UnhandleableError,
  },
};
use camino::Utf8PathBuf;
use derive_more::Debug;

#[derive(Debug)]
/// Represents a diagnostic message with associated metadata.
pub struct EarthquakeDiagnostic {
  #[debug(skip)]
  issue: Box<dyn Issue>,
  severity: Severity,
}

impl std::error::Error for EarthquakeDiagnostic {}

impl Display for EarthquakeDiagnostic {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    self.issue.message(&DiagnosticOptions::default()).fmt(f)
  }
}

impl EarthquakeDiagnostic {
  fn new_inner(inner: impl Into<Box<dyn Issue>>) -> Self {
    Self { issue: inner.into(), severity: Severity::Error }
  }

  /// Returns the unique identifier of the diagnostic, if available.
  pub fn id(&self) -> Option<String> {
    self.issue.id()
  }

  /// Returns the kind of the diagnostic.
  pub fn kind(&self) -> crate::types::issue_kind::IssueKind {
    self.issue.kind()
  }

  /// Returns the exporter associated with the diagnostic, if any.
  pub fn exporter(&self) -> Option<String> {
    self.issue.exporter()
  }

  /// Returns the severity of the diagnostic.
  pub fn severity(&self) -> Severity {
    self.severity
  }

  #[must_use]
  /// Sets the severity of the diagnostic to Warning.
  pub fn with_severity_warning(mut self) -> Self {
    self.severity = Severity::Warning;
    self
  }

  /// Converts the diagnostic to a `Diagnostic` object.
  pub fn to_diagnostic(&self) -> Diagnostic {
    self.to_diagnostic_with(&DiagnosticOptions::default())
  }

  /// Converts the diagnostic to a `Diagnostic` object with custom options.
  pub fn to_diagnostic_with(&self, opts: &DiagnosticOptions) -> Diagnostic {
    let mut diagnostic =
      Diagnostic::new(self.kind().to_string(), self.issue.message(opts), self.severity);
    self.issue.on_diagnostic(&mut diagnostic, opts);
    diagnostic
  }

  #[cfg(feature = "napi")]
  pub fn downcast_napi_error(&self) -> Result<&napi::Error, &Self> {
    self.issue.as_napi_error().ok_or(self)
  }
}

impl From<anyhow::Error> for EarthquakeDiagnostic {
  fn from(err: anyhow::Error) -> Self {
    downcast_napi_error_diagnostics(err).unwrap_or_else(EarthquakeDiagnostic::unhandleable_error)
  }
}

#[derive(Debug, Default)]
pub struct BatchedEarthquakeDiagnostic(Vec<EarthquakeDiagnostic>);

impl BatchedEarthquakeDiagnostic {
  pub fn new(vec: Vec<EarthquakeDiagnostic>) -> Self {
    Self(vec)
  }

  pub fn into_vec(self) -> Vec<EarthquakeDiagnostic> {
    self.0
  }
}

impl std::error::Error for BatchedEarthquakeDiagnostic {}

impl Display for BatchedEarthquakeDiagnostic {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    self.0.iter().map(std::string::ToString::to_string).collect::<Vec<_>>().join("\n").fmt(f)
  }
}

impl From<EarthquakeDiagnostic> for BatchedEarthquakeDiagnostic {
  fn from(v: EarthquakeDiagnostic) -> Self {
    Self::new(vec![v])
  }
}

impl From<Vec<EarthquakeDiagnostic>> for BatchedEarthquakeDiagnostic {
  fn from(v: Vec<EarthquakeDiagnostic>) -> Self {
    Self::new(v)
  }
}

impl From<anyhow::Error> for BatchedEarthquakeDiagnostic {
  fn from(error: anyhow::Error) -> Self {
    let caused_plugin = error.downcast_ref::<CausedPlugin>().cloned();
    match error.downcast::<Self>() {
      Ok(batched) => {
        if let Some(plugin) = caused_plugin {
          Self::new(
            batched
              .into_vec()
              .into_iter()
              .map(|diag| EarthquakeDiagnostic::plugin_error(plugin.clone(), diag.into()))
              .collect(),
          )
        } else {
          batched
        }
      }
      Err(error) => {
        // TODO: improve below logic
        let diagnostic = if let Some(plugin) = caused_plugin {
          downcast_napi_error_diagnostics(error)
            .unwrap_or_else(|error| EarthquakeDiagnostic::plugin_error(plugin, error))
        } else {
          EarthquakeDiagnostic::from(error)
        };
        Self::new(vec![diagnostic])
      }
    }
  }
}

impl Deref for BatchedEarthquakeDiagnostic {
  type Target = Vec<EarthquakeDiagnostic>;

  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

impl DerefMut for BatchedEarthquakeDiagnostic {
  fn deref_mut(&mut self) -> &mut Self::Target {
    &mut self.0
  }
}

impl EarthquakeDiagnostic {
  #[cfg(feature = "napi")]
  pub fn napi_error(err: napi::Error) -> Self {
    use crate::issues::napi_error::NapiError;

    Self::new_inner(NapiError(err))
  }

  pub fn unhandleable_error(err: anyhow::Error) -> Self {
    Self::new_inner(UnhandleableError(err))
  }

  pub fn plugin_error(caused_plugin: CausedPlugin, err: anyhow::Error) -> Self {
    Self::new_inner(PluginError { plugin: caused_plugin, error: err })
  }

  pub fn path_is_not_valid_utf8(path: PathBuf) -> Self {
    use crate::issues::path_is_not_valid_utf8::PathIsNotValidUtf8;

    Self::new_inner(PathIsNotValidUtf8 { path })
  }

  pub fn unable_to_read_file(path: Utf8PathBuf) -> Self {
    use crate::issues::unable_to_read_file::UnableToReadFile;

    Self::new_inner(UnableToReadFile { path })
  }

  pub fn unable_to_read_dir(path: Utf8PathBuf, error: std::io::Error) -> Self {
    use crate::issues::unable_to_read_dir::UnableToReadFile;

    Self::new_inner(UnableToReadFile { path, error })
  }

  pub fn unable_to_strip_root_prefix(path: Utf8PathBuf, root: Utf8PathBuf) -> Self {
    use crate::issues::unable_to_strip_root_prefix::UnableToStripRootPrefix;

    Self::new_inner(UnableToStripRootPrefix { path, root })
  }
}
