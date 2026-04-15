use crate::types::js_callback::MaybeAsyncJsCallback;
use derive_more::Debug;
use napi::bindgen_prelude::FnArgs;

#[napi_derive::napi(object)]
#[derive(Default, Debug)]
/// Data passed to plugin hooks related to layout resolution.
pub struct BindingPluginLayoutParams {
  /// The path of the layout being resolved.
  pub path: String,
  /// The code of the layout being resolved.
  pub code: String,
}

#[napi_derive::napi(object)]
#[derive(Default, Debug)]
/// Data passed to plugin hooks related to page resolution.
pub struct BindingPluginPageParams {
  /// The path of the page being resolved.
  pub path: String,
  /// The code of the page being resolved.
  pub code: String,
}

#[napi_derive::napi(object, object_to_js = false)]
#[derive(Debug, Default)]
/// Options for the plugin API exposed to JavaScript.
pub struct BindingPluginApiOptions {
  #[napi(ts_type = "(params: BindingPluginLayoutParams) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for layout resolution.
  pub layout_pre: Option<MaybeAsyncJsCallback<FnArgs<(BindingPluginLayoutParams,)>>>,
  #[napi(ts_type = "(params: BindingPluginLayoutParams) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for layout resolution.
  pub layout: Option<MaybeAsyncJsCallback<FnArgs<(BindingPluginLayoutParams,)>>>,
  #[napi(ts_type = "(params: BindingPluginLayoutParams) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for layout resolution.
  pub layout_post: Option<MaybeAsyncJsCallback<FnArgs<(BindingPluginLayoutParams,)>>>,
  #[napi(ts_type = "(params: BindingPluginPageParams) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for page resolution.
  pub page_pre: Option<MaybeAsyncJsCallback<FnArgs<(BindingPluginPageParams,)>>>,
  #[napi(ts_type = "(params: BindingPluginPageParams) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for page resolution.
  pub page: Option<MaybeAsyncJsCallback<FnArgs<(BindingPluginPageParams,)>>>,
  #[napi(ts_type = "(params: BindingPluginPageParams) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for page resolution.
  pub page_post: Option<MaybeAsyncJsCallback<FnArgs<(BindingPluginPageParams,)>>>,
}
