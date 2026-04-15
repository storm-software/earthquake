use earthquake_common::types::plugin_idx::PluginIdx;
use oxc_index::IndexVec;

use crate::{
  plugable::{IndexPlugable, SharedPlugable},
  types::hook_usage::HookUsage,
};

/// An enumeration representing the order of plugin execution.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum PluginOrder {
  /// Execute the plugin before the main process.
  Pre,
  /// Execute the plugin after the main process.
  Post,
}

/// Metadata associated with a plugin hook.
#[derive(Clone, Debug)]
pub struct PluginHookMeta {
  /// The order in which the plugin should be executed.
  pub order: Option<PluginOrder>,
}

#[expect(clippy::struct_field_names)] // Allow all fields to have the same prefix `order_by_`
#[derive(Clone, Debug)]
pub struct PluginHookOrders {
  pub order_by_layout_meta: Vec<PluginIdx>,
  pub order_by_page_meta: Vec<PluginIdx>,
}

impl PluginHookOrders {
  pub fn new(
    index_plugins: &IndexPlugable,
    plugin_usage_vec: &IndexVec<PluginIdx, HookUsage>,
  ) -> Self {
    Self {
      order_by_layout_meta: Self::sort_plugins_by_hook_meta(index_plugins, |i, p| {
        plugin_usage_vec[i].contains(HookUsage::Layout).then(|| p.call_layout_meta())
      }),
      order_by_page_meta: Self::sort_plugins_by_hook_meta(index_plugins, |i, p| {
        plugin_usage_vec[i].contains(HookUsage::Page).then(|| p.call_page_meta())
      }),
    }
  }

  fn sort_plugins_by_hook_meta(
    index_plugins: &IndexPlugable,
    get_hook_meta: impl Fn(PluginIdx, &SharedPlugable) -> Option<Option<PluginHookMeta>>,
  ) -> Vec<PluginIdx> {
    let mut pre_plugins = Vec::new();
    let mut post_plugins = Vec::new();
    let mut normal_plugins = Vec::with_capacity(index_plugins.len());
    for (idx, plugin) in index_plugins.iter_enumerated() {
      let Some(meta) = get_hook_meta(idx, plugin) else { continue };
      match meta {
        None => normal_plugins.push(idx),
        Some(meta) => match meta.order {
          Some(PluginOrder::Pre) => pre_plugins.push(idx),
          Some(PluginOrder::Post) => post_plugins.push(idx),
          None => normal_plugins.push(idx),
        },
      }
    }
    [pre_plugins, normal_plugins, post_plugins].concat()
  }
}
