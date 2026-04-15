use earthquake_utils::pattern_filter::StringOrRegex;

use crate::{Logger, log::LogLevel};

#[derive(Default, Debug, Clone)]
/// Configuration options for the StaticAnalysisEngine.
pub struct Options {
  /// The name of the application.
  pub name: String,
  /// The title of the application.
  pub title: String,
  /// The description of the application.
  pub description: Option<String>,
  /// The base URL for the application.
  pub base_url: String,
  /// Patterns to treat as external.
  pub external: Option<Vec<StringOrRegex>>,
  /// Patterns to exclude from being treated as external.
  pub no_external: Option<Vec<StringOrRegex>>,
  /// Whether to skip bundling node_modules.
  pub skip_node_modules_bundle: Option<bool>,
  /// The log level.
  pub log_level: Option<LogLevel>,
  /// Callback for logging messages.
  pub custom_logger: Option<Logger>,
  /// Whether to disable tracing.
  pub disable_tracing: Option<bool>,
  /// The root directory of the project.
  pub root: String,
  /// The root directory of the workspace.
  pub workspace_root: String,
  /// Routes directory.
  pub input_path: String,
  /// Path to public directory.
  pub public_path: String,
  /// Path to store build artifacts.
  pub artifacts_path: String,
  /// Path to built-in modules.
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
