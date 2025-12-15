use earthquake_common::types::plugin_idx::PluginIdx;

#[derive(Debug, Clone)]
pub struct HookCallSkipped {
  pub plugin_idx: PluginIdx,
}
