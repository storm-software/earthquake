use std::sync::Arc;

use earthquake_common::{LogMessage, NormalizedOptions};

use crate::plugin_context::native_plugin_context::NativePluginContextImpl;
use crate::plugin_context::plugin_context_meta::PluginContextMeta;

pub mod native_plugin_context;
pub mod plugin_context_meta;

#[derive(Debug)]
pub struct NapiPluginContextImpl;

#[derive(Debug, Clone)]
pub enum PluginContext {
  Napi(Arc<NapiPluginContextImpl>),
  Native(Arc<NativePluginContextImpl>),
}

macro_rules! call_native_only {
  ($self:expr, $method_name:literal, $ctx:ident => $native_expr:expr) => {
    match $self {
      PluginContext::Napi(_) => {
        unimplemented!(concat!("Can't call `", $method_name, "` on PluginContext::Napi"))
      }
      PluginContext::Native($ctx) => $native_expr,
    }
  };
}

impl PluginContext {
  #[must_use]
  pub fn new_napi_context() -> Self {
    Self::Napi(Arc::new(NapiPluginContextImpl))
  }

  pub fn meta(&self) -> &PluginContextMeta {
    call_native_only!(self, "meta", ctx => &ctx.meta)
  }

  pub fn options(&self) -> &NormalizedOptions {
    call_native_only!(self, "options", ctx => &ctx.options)
  }

  #[inline]
  pub fn error(&self, log: LogMessage) {
    call_native_only!(self, "error", ctx => ctx.error(log));
  }

  #[inline]
  pub fn warn(&self, log: LogMessage) {
    call_native_only!(self, "warn", ctx => ctx.warn(log));
  }

  #[inline]
  pub fn info(&self, log: LogMessage) {
    call_native_only!(self, "info", ctx => ctx.info(log));
  }

  #[inline]
  pub fn debug(&self, log: LogMessage) {
    call_native_only!(self, "debug", ctx => ctx.debug(log));
  }

  #[inline]
  pub fn trace(&self, log: LogMessage) {
    call_native_only!(self, "trace", ctx => ctx.trace(log));
  }
}
