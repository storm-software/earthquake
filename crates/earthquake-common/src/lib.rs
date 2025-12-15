//! Earthquake Common crate: provides various utilities and helper functions
//! and common types used across other Earthquake crates.

/// Common logging utilities and helper functions.
pub mod log;
/// Common types used across Earthquake crates.
pub mod types;

pub use log::*;
pub use types::*;

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    let result = 2 + 2;
    assert_eq!(result, 4);
  }
}
