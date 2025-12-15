use crate::{
  plugin_context::PluginContext,
  types::{
    hook_args::HookArgs, hook_output::HookOutput, hook_usage::HookUsage,
    plugin_hook_meta::PluginHookMeta,
  },
};
use anyhow::Result;
use std::{any::Any, borrow::Cow, fmt::Debug};

/// The return type for plugin hook functions.
pub type HookReturn = Result<Option<HookOutput>>;

/// Trait representing an Earthquake plugin.
pub trait Plugin: Any + Debug + Send + Sync + 'static {
  /// Get the name of the plugin.
  fn name(&self) -> Cow<'static, str>;

  /// Routes - Start hook function.
  fn routes_start(
    &self,
    _ctx: &PluginContext,
    _args: &HookArgs<'_>,
  ) -> impl std::future::Future<Output = HookReturn> + Send {
    async { Ok(None) }
  }

  /// Metadata for the Routes - Start hook.
  fn routes_start_meta(&self) -> Option<PluginHookMeta> {
    None
  }

  /// Route - Start hook function.
  fn route_start(
    &self,
    _ctx: &PluginContext,
    _args: &HookArgs<'_>,
  ) -> impl std::future::Future<Output = HookReturn> + Send {
    async { Ok(None) }
  }

  /// Metadata for the Route - Start hook.
  fn route_start_meta(&self) -> Option<PluginHookMeta> {
    None
  }

  /// Layout hook function.
  fn layout(
    &self,
    _ctx: &PluginContext,
    _args: &HookArgs<'_>,
  ) -> impl std::future::Future<Output = HookReturn> + Send {
    async { Ok(None) }
  }

  /// Metadata for the layout hook.
  fn layout_meta(&self) -> Option<PluginHookMeta> {
    None
  }

  /// Page hook function.
  fn page(
    &self,
    _ctx: &PluginContext,
    _args: &HookArgs<'_>,
  ) -> impl std::future::Future<Output = HookReturn> + Send {
    async { Ok(None) }
  }

  /// Metadata for the page hook.
  fn page_meta(&self) -> Option<PluginHookMeta> {
    None
  }

  /// Route - End hook function.
  fn route_end(
    &self,
    _ctx: &PluginContext,
    _args: &HookArgs<'_>,
  ) -> impl std::future::Future<Output = HookReturn> + Send {
    async { Ok(None) }
  }

  /// Metadata for the route - End hook.
  fn route_end_meta(&self) -> Option<PluginHookMeta> {
    None
  }

  /// Route - Prepare Close hook function.
  fn routes_end(
    &self,
    _ctx: &PluginContext,
    _args: &HookArgs<'_>,
  ) -> impl std::future::Future<Output = HookReturn> + Send {
    async { Ok(None) }
  }

  /// Metadata for the route - Prepare Close hook.
  fn route_prepare_close_meta(&self) -> Option<PluginHookMeta> {
    None
  }

  /// Get the hook usage for the plugin.
  fn register_hook_usage(&self) -> HookUsage;
}
