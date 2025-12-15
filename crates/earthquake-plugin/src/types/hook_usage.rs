use bitflags::bitflags;

bitflags! {
  /// Bitflags representing the usage of plugin hooks.
  #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
  pub struct HookUsage: u32 {
    /// Layout hook usage.
    const Layout = 1 << 0;
    /// Page hook usage.
    const Page = 1 << 1;
  }
}
