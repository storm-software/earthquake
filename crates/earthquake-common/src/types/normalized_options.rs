use crate::{Logger, log::LogLevel, types::options::Options};
use camino::Utf8PathBuf;
use derive_more::Debug;
use earthquake_error::IssueKindSwitcher;
use earthquake_utils::pattern_filter::StringOrRegex;
use std::{
  sync::Arc,
  time::{Duration, Instant},
};
use url::Url;

/// The normalized meta options for Earthquake.
#[derive(Debug, Clone)]
pub struct NormalizedMetaOptions {
  /// The checksum generated from the resolved options.
  pub checksum: String,
  /// The build identifier.
  pub build_id: String,
  /// The release identifier.
  pub release_id: String,
  /// The build timestamp.
  pub timestamp: Instant,
  /// A hash that represents the path to the project root directory.
  pub project_root_hash: String,
  /// A hash that represents the configuration provided to the Powerlines process.
  pub config_hash: String,
}

impl Default for NormalizedMetaOptions {
  fn default() -> Self {
    Self {
      checksum: String::new(),
      build_id: String::new(),
      release_id: String::new(),
      timestamp: Instant::now(),
      project_root_hash: String::new(),
      config_hash: String::new(),
    }
  }
}

/// The normalized path options for Earthquake.
#[derive(Default, Debug, Clone)]
pub struct NormalizedPathOptions {
  /// Routes directory.
  pub routes_path: Utf8PathBuf,
  /// The root directory of the project.
  pub project_root: Utf8PathBuf,
  /// The root directory of the workspace.
  pub workspace_root: Utf8PathBuf,
  /// Path to store build artifacts.
  pub artifacts_path: Utf8PathBuf,
  /// Path to built-in virtual modules.
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
  /// The description of the application.
  pub description: Option<String>,
  /// The version of the application.
  pub version: String,
  /// The base URL for the application.
  pub base_url: Url,
  /// The normalized meta options.
  pub meta: NormalizedMetaOptions,
  /// Patterns to treat as external.
  pub external: Vec<StringOrRegex>,
  /// Patterns to exclude from being treated as external.
  pub no_external: Vec<StringOrRegex>,
  /// Whether to skip bundling node_modules.
  pub skip_node_modules_bundle: bool,
  /// The platform target for the build.
  pub platform: String,
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
      description: None,
      version: "1.0.0".to_string(),
      base_url: Url::parse("http://localhost:3000/").unwrap(),
      meta: NormalizedMetaOptions::default(),
      external: Vec::new(),
      no_external: Vec::new(),
      skip_node_modules_bundle: false,
      platform: "neutral".to_string(),
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
      description: opts.description,
      version: opts.version.unwrap_or("1.0.0".to_string()),
      base_url: Url::parse(opts.base_url.as_ref())
        .unwrap_or(Url::parse("http://localhost:3000/").unwrap()),
      meta: NormalizedMetaOptions {
        checksum: opts.checksum,
        build_id: opts.build_id,
        release_id: opts.release_id,
        timestamp: Duration::from_millis(opts.timestamp)
          .checked_sub(Duration::from_millis(
            u64::try_from(Instant::now().elapsed().as_millis())
              .expect("Unable to determine current timestamp"),
          ))
          .map_or(Instant::now(), |d| Instant::now().checked_sub(d).unwrap()),
        project_root_hash: opts.project_root_hash,
        config_hash: opts.config_hash,
      },
      external: opts.external.unwrap_or_default(),
      no_external: opts.no_external.unwrap_or_default(),
      skip_node_modules_bundle: opts.skip_node_modules_bundle.unwrap_or(false),
      platform: opts.platform.unwrap_or_else(|| "neutral".to_string()),
      log_level: opts.log_level.unwrap_or_default(),
      custom_logger: opts.custom_logger,
      disable_tracing: opts.disable_tracing.unwrap_or(false),
      paths: NormalizedPathOptions {
        project_root: opts.project_root.into(),
        workspace_root: opts.workspace_root.into(),
        routes_path: opts.routes_path.into(),
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
