use earthquake_utils::pattern_filter::StringOrRegex;

use crate::{Logger, log::LogLevel};

#[derive(Default, Debug, Clone)]
/// Configuration options for Earthquake.
pub struct Options {
  /// The name of the application.
  pub name: String,
  /// The description of the application.
  pub description: Option<String>,
  /// The version of the application.
  pub version: Option<String>,
  /// The base URL for the application.
  pub base_url: String,
  /// The checksum generated from the resolved options.
  pub checksum: String,
  /// The build identifier.
  pub build_id: String,
  /// The release identifier.
  pub release_id: String,
  /// The build timestamp.
  pub timestamp: u64,
  /// A hash that represents the path to the project root directory.
  pub project_root_hash: String,
  /// A hash that represents the configuration provided to the Powerlines process.
  pub config_hash: String,
  /// Patterns to treat as external.
  pub external: Option<Vec<StringOrRegex>>,
  /// Patterns to exclude from being treated as external.
  pub no_external: Option<Vec<StringOrRegex>>,
  /// Whether to skip bundling node_modules.
  pub skip_node_modules_bundle: Option<bool>,
  /// The platform target for the build.
  pub platform: Option<String>,
  /// The log level.
  pub log_level: Option<LogLevel>,
  /// Callback for logging messages.
  pub custom_logger: Option<Logger>,
  /// Whether to disable tracing.
  pub disable_tracing: Option<bool>,
  /// The root directory of the project.
  pub project_root: String,
  /// The root directory of the workspace.
  pub workspace_root: String,
  /// Routes directory.
  pub routes_path: String,
  /// Path to public directory.
  pub public_path: String,
  /// Path to store build artifacts.
  pub artifacts_path: String,
  /// Path to built-in virtual modules.
  pub builtin_path: String,
  /// Virtual entry files path.
  pub entry_path: String,
  /// Path to cache directory.
  pub cache_path: String,
  /// Path to data directory.
  pub data_path: String,
  /// Path to log directory.
  pub log_path: String,
  /// Path to temporary directory.
  pub temp_path: String,
  /// Path to configuration directory.
  pub config_path: String,
  /// Path to output directory.
  pub output_path: String,
  /// Path to tsconfig.json file.
  pub tsconfig: Option<String>,
}
