use crate::{LogLevel, LogMessage};
use derive_more::Debug;

/// Log structure representing a log message.
#[derive(Debug, Default)]
pub struct Log {
  /// The log message displayed to the user.
  pub message: LogMessage,
  /// The log level of the message.
  pub level: LogLevel,
}

impl Log {
  /// Convert a LogMessage into a Log with the specified level.
  #[must_use]
  pub fn from_message(message: LogMessage, level: LogLevel) -> Self {
    Self { message, level }
  }

  /// Attach a plugin name to the log message.
  #[must_use]
  pub fn with_plugin(self, plugin: Option<String>) -> Self {
    let Log { message, level } = self;
    let LogMessage { message: msg, code, details, .. } = message;
    let message = LogMessage { message: msg, code, details, plugin };
    Self { message, level }
  }
}
