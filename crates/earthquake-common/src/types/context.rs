use std::str::FromStr;
use storm_config::workspace_config::WorkspaceConfig;

use crate::{NormalizedOptions, Options};

/// Context for the current Earthquake process, including options and workspace configuration.
#[derive(Debug, Clone)]
pub struct Context {
  /// Configuration options for the current context.
  pub user_options: Options,
  /// Normalized configuration options for the current context.
  pub options: NormalizedOptions,
  /// Workspace configuration.
  pub workspace_config: WorkspaceConfig,
}

impl Context {
  /// Create a new Context from the given Options.
  pub fn new(options: Options) -> Self {
    let normalized_options = NormalizedOptions::from(options.clone());
    let workspace_config =
      WorkspaceConfig::from_str(normalized_options.paths.workspace_root.as_str())
        .expect("Failed to load workspace configuration");

    Self { user_options: options, options: normalized_options, workspace_config }
  }
}
