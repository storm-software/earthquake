//! Earthquake crate: provides core earthquake functionalities for creating
//! the React application from the JavaScript/TypeScript source code.

pub mod route;
pub use route::*;

pub mod static_analysis_engine;
pub use static_analysis_engine::*;

#[cfg(test)]
mod tests {
  #[test]
  fn it_works() {
    let result = 2 + 2;
    assert_eq!(result, 4);
  }
}
