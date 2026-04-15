use std::{any::Any, borrow::Cow, fmt::Debug, sync::Arc};

use earthquake_common::types::plugin_idx::PluginIdx;
use oxc_index::IndexVec;

use crate::{
  plugin::HookReturn,
  plugin_context::PluginContext,
  types::{hook_args::HookArgs, plugin_hook_meta::PluginHookMeta},
};

/// Shared pointer to a `Plugable` trait object.
pub type SharedPlugable = Arc<dyn Plugable>;

/// `Plugable` is the under the hood trait that earthquake needs to run. It's not recommended to use this trait directly.
/// To create a plugin, you should use [Plugin] trait instead.
///
/// The main reason we don't expose this trait is that it used `async_trait`, which make it rust-analyzer can't
/// provide a good auto-completion experience.
#[async_trait::async_trait]
pub trait Plugable: Any + Debug + Send + Sync + 'static {
  /// Get the name of the plugin.
  fn call_name(&self) -> Cow<'static, str>;

  /// Route hook function.
  async fn call_route_start(&self, _ctx: &PluginContext, _args: &HookArgs<'_>) -> HookReturn;

  /// Route hook metadata.
  fn call_route_start_meta(&self) -> Option<PluginHookMeta>;

  /// Layout hook function.
  async fn call_layout(&self, _ctx: &PluginContext, _args: &HookArgs<'_>) -> HookReturn;

  /// Layout hook metadata.
  fn call_layout_meta(&self) -> Option<PluginHookMeta>;

  /// Page hook function.
  async fn call_page(&self, _ctx: &PluginContext, _args: &HookArgs<'_>) -> HookReturn;

  /// Page hook metadata.
  fn call_page_meta(&self) -> Option<PluginHookMeta>;

  /// Route hook function.
  async fn call_route_end(&self, _ctx: &PluginContext, _args: &HookArgs<'_>) -> HookReturn;

  /// Route hook metadata.
  fn call_route_end_meta(&self) -> Option<PluginHookMeta>;

  /// Route hook function.
  async fn call_prepare_close(&self, _ctx: &PluginContext, _args: &HookArgs<'_>) -> HookReturn;

  /// Route hook metadata.
  fn call_prepare_close_meta(&self) -> Option<PluginHookMeta>;

  /// Get the hook usage for the plugin.
  fn call_hook_usage(&self) -> crate::types::hook_usage::HookUsage;
}

/// An indexable collection of `Plugable` trait objects, keyed by `PluginIdx`.
pub type IndexPlugable = IndexVec<PluginIdx, SharedPlugable>;

/// An indexable collection of `PluginContext` objects, keyed by `PluginIdx`.
pub type IndexPluginContext = IndexVec<PluginIdx, PluginContext>;
