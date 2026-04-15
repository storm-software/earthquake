use std::fs;

use camino::Utf8PathBuf;
use earthquake_error::{EarthquakeDiagnostic, EarthquakeResult};
use serde::{Deserialize, Serialize};

use crate::RouteModuleKind;

/// Route module used in Earthquake routing.
#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub struct RouteModule {
  /// The kind of the route module, e.g. page, layout, error, etc.
  pub kind: RouteModuleKind,
  /// A hash of the module content, used for caching and change detection.
  pub hash: Vec<u8>,
  /// The raw content of the route module file.
  pub content: String,
  /// An optional prelude that can be injected before the module content during processing.
  pub prelude: Option<String>,
}

impl RouteModule {
  /// Create a new RouteModule.
  pub fn new(path: &Utf8PathBuf, kind: RouteModuleKind, bytes: &[u8]) -> EarthquakeResult<Self> {
    if !kind.as_file_path(path).is_file() {
      return Err(EarthquakeDiagnostic::unable_to_read_file(path.into()).into());
    }

    Ok(Self {
      kind,
      hash: blake3::hash(bytes).as_bytes().to_vec(),
      content: String::from_utf8_lossy(bytes).into(),
      prelude: None,
    })
  }
}

impl From<Utf8PathBuf> for RouteModule {
  fn from(path: Utf8PathBuf) -> Self {
    let kind: RouteModuleKind = path.clone().into();
    if !kind.as_file_path(&path).is_file() {
      return Self::default();
    }

    let bytes = fs::read(&path)
      .unwrap_or_else(|_| panic!("Unable to read route module file at path: {path}."));

    Self::new(&path, kind, &bytes)
      .unwrap_or_else(|_| panic!("Unable to initialize route module path: {path}."))
  }
}
