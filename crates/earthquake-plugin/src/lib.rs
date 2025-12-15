//! Earthquake Plugin crate: provides various utilities and helper functions
//! and common types used across other Earthquake crates.

/// Plugin trait and related types.
pub mod plugin;
/// Plugin context for managing plugin state and data.
pub mod plugin_context;
/// Plugin driver for managing plugins.
pub mod plugin_driver;
/// Pluginable trait and related types.
pub mod pluginable;
/// Common types used across Earthquake Plugin crate.
pub mod types;

pub use plugin::*;
pub use plugin_driver::*;

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    let result = 2 + 2;
    assert_eq!(result, 4);
  }
}
