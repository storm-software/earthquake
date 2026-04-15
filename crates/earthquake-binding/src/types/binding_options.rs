use std::sync::Arc;

use crate::types::binding_plugin_api::BindingPluginApiOptions;
use crate::types::js_callback::JsCallbackExt;
use crate::types::{
  binding_log::BindingLog, binding_log_level::BindingLogLevel,
  binding_string_or_regex::BindingStringOrRegex, js_callback::JsCallback,
};
use derive_more::Debug;
use earthquake_common::{Logger, Options};
use napi::bindgen_prelude::Promise;
pub type BindingLogger = Option<JsCallback<BindingLog, Promise<()>>>;

#[napi_derive::napi(object, object_to_js = false)]
#[derive(Debug)]
pub struct BindingOptions {
  /// The name of the application.
  pub name: String,
  /// The title of the application.
  pub title: String,
  /// The description of the application.
  pub description: Option<String>,
  /// The base URL for the application.
  pub base_url: String,
  #[debug(skip)]
  #[napi(ts_type = "Array<string | RegExp>")]
  /// Patterns to treat as external.
  pub external: Option<Vec<BindingStringOrRegex>>,
  #[debug(skip)]
  #[napi(ts_type = "Array<string | RegExp>")]
  /// Patterns to exclude from being treated as external.
  pub no_external: Option<Vec<BindingStringOrRegex>>,
  /// Whether to skip bundling node_modules.
  pub skip_node_modules_bundle: Option<bool>,
  #[napi(ts_type = "'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'")]
  /// The log level.
  pub log_level: Option<BindingLogLevel>,
  #[debug(skip)]
  #[napi(
    ts_type = "(logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error', log: BindingLog) => Promise<void>"
  )]
  /// Disable tracing.
  pub disable_tracing: Option<bool>,
  /// Callback for log messages.
  #[debug(skip)]
  pub custom_logger: Option<BindingLogger>,
  /// An object containing an interface to invoke Earthquake plugins from.
  pub plugin_api: BindingPluginApiOptions,
  /// The root directory of the project.
  pub root: String,
  /// The root directory of the workspace.
  pub workspace_root: String,
  /// Routes directory.
  pub input_path: String,
  /// Path to public directory.
  pub public_path: String,
  /// Path to store build artifacts.
  pub artifacts_path: String,
  /// Path to built-in virtual modules.
  pub builtin_path: String,
  /// Virtual entry files path.
  pub entry_path: String,
  /// Path to cache directory.
  pub cache_path: String,
  /// Path to data directory.
  pub data_path: String,
  /// Path to log directory.
  pub log_path: String,
  /// Path to temporary directory.
  pub temp_path: String,
  /// Path to configuration directory.
  pub config_path: String,
  /// Path to output directory.
  pub output_path: String,
  /// Path to tsconfig.json file.
  pub tsconfig: Option<String>,
}

impl Default for BindingOptions {
  fn default() -> Self {
    Self {
      name: String::new(),
      title: String::new(),
      description: None,
      base_url: String::new(),
      external: None,
      no_external: None,
      skip_node_modules_bundle: None,
      log_level: None,
      disable_tracing: None,
      custom_logger: None,
      plugin_api: BindingPluginApiOptions::default(),
      root: String::new(),
      workspace_root: String::new(),
      input_path: String::new(),
      public_path: String::new(),
      artifacts_path: String::new(),
      builtin_path: String::new(),
      entry_path: String::new(),
      cache_path: String::new(),
      data_path: String::new(),
      log_path: String::new(),
      temp_path: String::new(),
      config_path: String::new(),
      output_path: String::new(),
      tsconfig: None,
    }
  }
}

impl Into<Options> for BindingOptions {
  fn into(self) -> Options {
    let log_level =
      if self.log_level.is_some() { Some(self.log_level.unwrap().into()) } else { None };
    let skip_node_modules_bundle = if self.skip_node_modules_bundle.is_some() {
      Some(self.skip_node_modules_bundle.unwrap())
    } else {
      None
    };

    let custom_logger = if self.custom_logger.is_some() {
      let on_log = self
        .custom_logger
        .unwrap()
        .map(|ts_fn| {
          Logger::new(Arc::new(move |log| {
            let ts_fn = Arc::clone(&ts_fn);
            Box::pin(async move {
              ts_fn.invoke_async(log.into()).await?.await.map_err(anyhow::Error::from)
            })
          }))
        })
        .unwrap();
      Some(on_log)
    } else {
      None
    };

    Options {
      name: self.name,
      title: self.title,
      description: self.description,
      base_url: self.base_url,
      external: self.external.map(|vec| vec.into_iter().map(std::convert::Into::into).collect()),
      no_external: self
        .no_external
        .map(|vec| vec.into_iter().map(std::convert::Into::into).collect()),
      skip_node_modules_bundle,
      log_level,
      disable_tracing: self.disable_tracing,
      custom_logger,
      root: self.root,
      workspace_root: self.workspace_root,
      input_path: self.input_path,
      public_path: self.public_path,
      artifacts_path: self.artifacts_path,
      builtin_path: self.builtin_path,
      entry_path: self.entry_path,
      cache_path: self.cache_path,
      data_path: self.data_path,
      log_path: self.log_path,
      temp_path: self.temp_path,
      config_path: self.config_path,
      output_path: self.output_path,
      tsconfig: self.tsconfig,
    }
  }
}

#[napi_derive::napi(object, object_to_js = false)]
#[derive(Debug, Default)]
pub struct BindingPluginWithIndex {
  pub index: u32,
  pub plugin: BindingOptions,
}
