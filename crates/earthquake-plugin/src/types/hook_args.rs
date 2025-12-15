use std::path::Path;

/// Arguments passed to plugin hook functions.
#[derive(Debug)]
pub struct HookArgs<'a> {
  /// Path of the file being processed.
  pub path: &'a Path,
  /// ID of the file being processed.
  pub id: &'a String,
  /// Code content of the file being processed.
  pub code: &'a String,
}

impl<'a> HookArgs<'a> {
  /// Create a new `HookArgs` instance.
  pub fn new(path: &'a Path, id: &'a String, code: &'a String) -> Self {
    Self { path, id, code }
  }
}
