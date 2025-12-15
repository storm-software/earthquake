use earthquake_common::SharedNormalizedOptions;
use earthquake_plugin::SharedPluginDriver;

/// A lightweight handle to access bundle state after the `Bundle` has been consumed.
///
/// # Purpose
///
/// `PrepareHandle` provides access to bundle configuration and state after the `Bundle` instance
/// has been consumed by operations like `write()`, `generate()`, or `scan()`. Since these methods
/// take ownership of the `Bundle` to prevent reuse, this handle enables:
///
/// - **Post-build cleanup**: Calling plugin lifecycle hooks like `close_bundle()` after the build completes
/// - **Watch file inspection**: Accessing the list of files that should trigger rebuilds in watch mode
/// - **Configuration access**: Reading bundler options used during the build
///
/// # Why This Exists
///
/// Rolldown's `Bundle` methods intentionally take ownership (`self`) to enforce single-use semantics
/// and prevent accidental reuse of consumed bundles. However, some operations need to access bundle
/// data after the build completes:
///
/// - `ClassicBundler` and `BundleFactory` store the last `PrepareHandle` to call cleanup hooks
/// - The binding layer uses it to expose watch files to JavaScript via `get_watch_files()`
///
/// Without `PrepareHandle`, these post-consumption operations would be impossible since the `Bundle`
/// has been moved and consumed.
///
/// # Usage Pattern
///
/// ```rust,ignore
/// let bundle = bundle_factory.create_bundle();
/// let handle = bundle.context(); // Extract handle before consuming
/// let output = bundle.write().await?; // Bundle consumed here
/// // Can still access data via handle:
/// let watch_files = handle.watch_files();
/// handle.plugin_driver().close_bundle().await?;
/// ```
#[derive(Clone)]
pub struct RouteHandle {
  pub(crate) options: SharedNormalizedOptions,
  pub(crate) plugin_driver: SharedPluginDriver,
}

impl RouteHandle {
  /// Get the bundler options used in this bundle.
  pub fn options(&self) -> &SharedNormalizedOptions {
    &self.options
  }

  /// Get the plugin driver used in this bundle.
  ///
  /// Primarily used to call cleanup hooks like `close_bundle()` after the build completes.
  pub fn plugin_driver(&self) -> &SharedPluginDriver {
    &self.plugin_driver
  }
}
