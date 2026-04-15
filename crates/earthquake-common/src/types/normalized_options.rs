use crate::{Logger, log::LogLevel, types::options::Options};
use camino::Utf8PathBuf;
use derive_more::Debug;
use earthquake_error::IssueKindSwitcher;
use earthquake_utils::pattern_filter::StringOrRegex;
use std::sync::Arc;
use url::Url;

/// The normalized path options for Earthquake.
#[derive(Default, Debug, Clone)]
pub struct NormalizedPathOptions {
  /// The root directory of the project.
  pub root: Utf8PathBuf,
  /// The root directory of the workspace.
  pub workspace_root: Utf8PathBuf,
  /// Routes directory.
  pub input_path: Utf8PathBuf,
  /// Path to store build artifacts.
  pub artifacts_path: Utf8PathBuf,
  /// Path to built-in modules.
  pub builtin_path: Utf8PathBuf,
  /// Virtual entry files path.
  pub entry_path: Utf8PathBuf,
  /// Path to cache directory.
  pub cache_path: Utf8PathBuf,
  /// Path to data directory.
  pub data_path: Utf8PathBuf,
  /// Path to log directory.
  pub log_path: Utf8PathBuf,
  /// Path to temporary directory.
  pub temp_path: Utf8PathBuf,
  /// Path to configuration directory.
  pub config_path: Utf8PathBuf,
  /// Path to public directory.
  pub public_path: Utf8PathBuf,
  /// Path to output directory.
  pub output_path: Utf8PathBuf,
}

#[derive(Debug, Clone)]
/// The normalized options for Earthquake.
pub struct NormalizedOptions {
  /// The name of the application.
  pub name: String,
  /// The title of the application.
  pub title: String,
  /// The description of the application.
  pub description: Option<String>,
  /// The base URL for the application.
  pub base_url: Url,
  /// Patterns to treat as external.
  pub external: Vec<StringOrRegex>,
  /// Patterns to exclude from being treated as external.
  pub no_external: Vec<StringOrRegex>,
  /// Whether to skip bundling node_modules.
  pub skip_node_modules_bundle: bool,
  /// The log level.
  pub log_level: LogLevel,
  /// Callback for logging messages.
  pub custom_logger: Option<Logger>,
  /// Whether to disable tracing.
  pub disable_tracing: bool,
  /// Normalized path options.
  pub paths: NormalizedPathOptions,
  /// Path to tsconfig.json file.
  pub tsconfig: String,
  /// Enabled or disabled checks.
  pub checks: IssueKindSwitcher,
}

impl Default for NormalizedOptions {
  fn default() -> Self {
    Self {
      name: String::new(),
      title: String::new(),
      description: None,
      base_url: Url::parse("http://localhost:3000/").unwrap(),
      external: Vec::new(),
      no_external: Vec::new(),
      skip_node_modules_bundle: false,
      log_level: LogLevel::default(),
      custom_logger: None,
      disable_tracing: false,
      paths: NormalizedPathOptions::default(),
      tsconfig: String::new(),
      checks: IssueKindSwitcher::default(),
    }
  }
}

impl From<Options> for NormalizedOptions {
  fn from(opts: Options) -> Self {
    Self {
      name: opts.name,
      title: opts.title,
      description: opts.description,
      base_url: Url::parse(opts.base_url.as_ref())
        .unwrap_or(Url::parse("http://localhost:3000/").unwrap()),
      external: opts.external.unwrap_or_default(),
      no_external: opts.no_external.unwrap_or_default(),
      skip_node_modules_bundle: opts.skip_node_modules_bundle.unwrap_or(false),
      log_level: opts.log_level.unwrap_or_default(),
      custom_logger: opts.custom_logger,
      disable_tracing: opts.disable_tracing.unwrap_or(false),
      paths: NormalizedPathOptions {
        root: opts.root.into(),
        workspace_root: opts.workspace_root.into(),
        input_path: opts.input_path.into(),
        public_path: opts.public_path.into(),
        artifacts_path: opts.artifacts_path.into(),
        builtin_path: opts.builtin_path.into(),
        entry_path: opts.entry_path.into(),
        cache_path: opts.cache_path.into(),
        data_path: opts.data_path.into(),
        log_path: opts.log_path.into(),
        temp_path: opts.temp_path.into(),
        config_path: opts.config_path.into(),
        output_path: opts.output_path.into(),
      },
      tsconfig: opts.tsconfig.unwrap_or_default(),
      checks: IssueKindSwitcher::default(),
    }
  }
}

/// Shared reference to NormalizedOptions.
pub type SharedNormalizedOptions = Arc<NormalizedOptions>;
