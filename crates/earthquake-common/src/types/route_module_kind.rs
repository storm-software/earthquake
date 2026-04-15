use crate::ModuleExtension;
use camino::Utf8PathBuf;
use serde::{Deserialize, Serialize};
use std::slice::Iter;

/// Represents the kind of a route module.
#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub enum RouteModuleKind {
  /// A regular page route.
  #[default]
  Page,
  /// The default page route.
  DefaultPage,
  /// An error component for the current route.
  Error,
  /// The layout for the route.
  Layout,
  /// The loading component for the route.
  Loading,
  /// The template for the current route.
  Template,
  /// The not found component for the current route.
  NotFound,
  /// The forbidden component for the current route.
  Forbidden,
  /// The unauthorized component for the current route.
  Unauthorized,
  /// The global error display.
  GlobalError,
  /// The global not found display.
  GlobalNotFound,
  /// The API route component for handling API calls at the current route.
  API,
}

impl RouteModuleKind {
  /// Returns the name of the route module type as a static string.
  pub fn name(&self) -> &'static str {
    match self {
      RouteModuleKind::Page => "page",
      RouteModuleKind::DefaultPage => "default",
      RouteModuleKind::Error => "error",
      RouteModuleKind::Layout => "layout",
      RouteModuleKind::Loading => "loading",
      RouteModuleKind::Template => "template",
      RouteModuleKind::NotFound => "not-found",
      RouteModuleKind::Forbidden => "forbidden",
      RouteModuleKind::Unauthorized => "unauthorized",
      RouteModuleKind::GlobalError => "global-error",
      RouteModuleKind::GlobalNotFound => "global-not-found",
      RouteModuleKind::API => "api",
    }
  }

  /// Returns the expected file path for the route module based on its kind.
  pub fn as_file_path(&self, path: &Utf8PathBuf) -> Utf8PathBuf {
    let without_extension = path.with_file_name(self.name());
    if without_extension.with_extension(ModuleExtension::TypescriptReact).exists() {
      without_extension.with_extension(ModuleExtension::TypescriptReact)
    } else if without_extension.with_extension(ModuleExtension::Typescript).exists() {
      without_extension.with_extension(ModuleExtension::Typescript)
    } else if without_extension.with_extension(ModuleExtension::JavascriptReact).exists() {
      without_extension.with_extension(ModuleExtension::JavascriptReact)
    } else if without_extension.with_extension(ModuleExtension::Javascript).exists() {
      without_extension.with_extension(ModuleExtension::Javascript)
    } else if without_extension.with_extension(ModuleExtension::MarkdownReact).exists() {
      without_extension.with_extension(ModuleExtension::MarkdownReact)
    } else {
      without_extension
    }
  }

  /// Returns an iterator over all possible `RouteModuleKind` variants.
  pub fn iterator() -> Iter<'static, RouteModuleKind> {
    static KINDS: [RouteModuleKind; 12] = [
      RouteModuleKind::Page,
      RouteModuleKind::DefaultPage,
      RouteModuleKind::Error,
      RouteModuleKind::Layout,
      RouteModuleKind::Loading,
      RouteModuleKind::Template,
      RouteModuleKind::NotFound,
      RouteModuleKind::Forbidden,
      RouteModuleKind::Unauthorized,
      RouteModuleKind::GlobalError,
      RouteModuleKind::GlobalNotFound,
      RouteModuleKind::API,
    ];
    KINDS.iter()
  }
}

impl From<Utf8PathBuf> for RouteModuleKind {
  fn from(path: Utf8PathBuf) -> Self {
    let file_stem = path.file_stem().unwrap_or_default();
    match file_stem {
      "default" => RouteModuleKind::DefaultPage,
      "error" => RouteModuleKind::Error,
      "layout" => RouteModuleKind::Layout,
      "loading" => RouteModuleKind::Loading,
      "template" => RouteModuleKind::Template,
      "not-found" => RouteModuleKind::NotFound,
      "forbidden" => RouteModuleKind::Forbidden,
      "unauthorized" => RouteModuleKind::Unauthorized,
      "global-error" => RouteModuleKind::GlobalError,
      "global-not-found" => RouteModuleKind::GlobalNotFound,
      "api" => RouteModuleKind::API,
      _ => RouteModuleKind::Page,
    }
  }
}
