use serde::{Deserialize, Serialize};

/// Represents the type of a module file extension.
#[derive(Default, Debug, Clone, Serialize, Deserialize)]
pub enum ModuleExtension {
  /// The TypeScript React (.tsx) file extension.
  #[default]
  TypescriptReact,
  /// The TypeScript (.ts) file extension.
  Typescript,
  /// The JavaScript React (.jsx) file extension.
  JavascriptReact,
  /// The JavaScript (.js) file extension.
  Javascript,
  /// The Markdown React (.mdx) file extension.
  MarkdownReact,
}

impl ModuleExtension {
  /// Returns the file extension as a static string.
  pub fn as_str(&self) -> &'static str {
    match self {
      ModuleExtension::TypescriptReact => "tsx",
      ModuleExtension::Typescript => "ts",
      ModuleExtension::JavascriptReact => "jsx",
      ModuleExtension::Javascript => "js",
      ModuleExtension::MarkdownReact => "mdx",
    }
  }
}

impl AsRef<str> for ModuleExtension {
  fn as_ref(&self) -> &str {
    self.as_str()
  }
}

impl std::fmt::Display for ModuleExtension {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    write!(f, "{}", self.as_str())
  }
}
