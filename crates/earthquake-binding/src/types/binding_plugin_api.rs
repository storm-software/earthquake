use crate::types::js_callback::MaybeAsyncJsCallback;
use derive_more::Debug;
use napi::bindgen_prelude::FnArgs;

#[napi_derive::napi(object)]
#[derive(Default)]
pub struct BindingPluginLayoutData {
  pub path: String,
  pub directive: Option<String>,
}

#[napi_derive::napi(object)]
#[derive(Default)]
pub struct BindingPluginPageData {
  pub path: String,
  pub directive: Option<String>,
}

#[napi_derive::napi(object, object_to_js = false)]
#[derive(Debug, Default)]
pub struct BindingPluginApiOptions {
  #[napi(ts_type = "(path: string, opts: BindingPluginLayoutData) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for layout resolution.
  pub layout_pre: Option<MaybeAsyncJsCallback<FnArgs<(String, BindingPluginLayoutData)>>>,
  #[napi(ts_type = "(path: string, opts: BindingPluginLayoutData) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for layout resolution.
  pub layout: Option<MaybeAsyncJsCallback<FnArgs<(String, BindingPluginLayoutData)>>>,
  #[napi(ts_type = "(path: string, opts: BindingPluginLayoutData) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for layout resolution.
  pub layout_post: Option<MaybeAsyncJsCallback<FnArgs<(String, BindingPluginLayoutData)>>>,
  #[napi(ts_type = "(path: string, opts: BindingPluginPageData) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for page resolution.
  pub page_pre: Option<MaybeAsyncJsCallback<FnArgs<(String, BindingPluginPageData)>>>,
  #[napi(ts_type = "(path: string, opts: BindingPluginPageData) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for page resolution.
  pub page: Option<MaybeAsyncJsCallback<FnArgs<(String, BindingPluginPageData)>>>,
  #[napi(ts_type = "(path: string, opts: BindingPluginPageData) => MaybePromise<VoidNullable>")]
  #[debug(skip)]
  /// Callback for page resolution.
  pub page_post: Option<MaybeAsyncJsCallback<FnArgs<(String, BindingPluginPageData)>>>,
}
