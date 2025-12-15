use derive_more::Debug;
use earthquake_common::{Log, LogLevel, LogMessage, PluginIdx, SharedNormalizedOptions};
use earthquake_tracing::Session;
use std::{
  borrow::Cow,
  sync::{Arc, Weak},
};

use crate::{PluginDriver, plugin_context::plugin_context_meta::PluginContextMeta};

pub type SharedNativePluginContext = Arc<NativePluginContextImpl>;

#[derive(Debug)]
pub struct NativePluginContextImpl {
  pub(crate) plugin_name: Cow<'static, str>,
  pub(crate) plugin_idx: PluginIdx,
  pub(crate) meta: Arc<PluginContextMeta>,
  pub(crate) plugin_driver: Weak<PluginDriver>,
  pub(crate) options: SharedNormalizedOptions,
  pub(crate) session: Session,
  pub(crate) route_span: Arc<tracing::Span>,
}

impl NativePluginContextImpl {
  fn log(&self, level: LogLevel, message: LogMessage) {
    if let Some(custom_logger) = &self.options.custom_logger {
      let custom_logger = custom_logger.clone();
      let log = Log::from_message(message, level).with_plugin(Some(self.plugin_name.to_string()));
      earthquake_utils::futures::spawn(async move {
        // FIXME: should collect error happened here and cause the build to fail later
        let _ = custom_logger.call(log).await;
      });
    }
  }

  #[inline]
  pub fn error(&self, log: LogMessage) {
    self.log(LogLevel::Error, log);
  }

  #[inline]
  pub fn warn(&self, log: LogMessage) {
    self.log(LogLevel::Warn, log);
  }

  #[inline]
  pub fn info(&self, log: LogMessage) {
    self.log(LogLevel::Info, log);
  }

  #[inline]
  pub fn debug(&self, log: LogMessage) {
    self.log(LogLevel::Debug, log);
  }

  #[inline]
  pub fn trace(&self, log: LogMessage) {
    self.log(LogLevel::Trace, log);
  }
}
