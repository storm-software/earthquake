/// The mode to use when outputting build artifacts.
#[derive(Debug, Clone, PartialEq, Eq, Default)]
pub enum StoragePreset {
  /// Write output to the file system.
  FileSystem,
  /// Generate output in memory.
  #[default]
  Virtual,
}

impl From<String> for StoragePreset {
  fn from(value: String) -> Self {
    match value.as_str() {
      "fs" | "filesystem" => Self::FileSystem,
      "virtual" => Self::Virtual,
      _ => panic!("Invalid output mode: {value}"),
    }
  }
}
