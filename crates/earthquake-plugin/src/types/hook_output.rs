use arcstr::ArcStr;

/// Output returned by plugin hook functions.
#[derive(Debug, Default)]
pub struct HookOutput {
  /// Transformed code returned by the hook.
  pub code: ArcStr,
}
