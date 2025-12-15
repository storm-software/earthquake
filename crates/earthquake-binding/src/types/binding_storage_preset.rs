use derive_more::Debug;
use earthquake_common::StoragePreset;
use napi_derive::napi;

/// The mode to use when outputting build artifacts.
#[derive(Debug, Clone, PartialEq, Eq)]
#[napi]
#[derive(Default)]
pub enum BindingStoragePreset {
  /// Write output to the file system.
  FileSystem,
  /// Generate output in memory.
  #[default]
  Virtual,
}

impl From<BindingStoragePreset> for StoragePreset {
  fn from(value: BindingStoragePreset) -> Self {
    match value {
      BindingStoragePreset::FileSystem => Self::FileSystem,
      BindingStoragePreset::Virtual => Self::Virtual,
    }
  }
}

impl From<StoragePreset> for BindingStoragePreset {
  fn from(value: StoragePreset) -> Self {
    match value {
      StoragePreset::FileSystem => Self::FileSystem,
      StoragePreset::Virtual => Self::Virtual,
    }
  }
}
