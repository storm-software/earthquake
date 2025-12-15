use crate::{EarthquakeDiagnostic, IssueKindSwitcher};

pub fn filter_out_disabled_diagnostics(
  diagnostics: Vec<EarthquakeDiagnostic>,
  switcher: &IssueKindSwitcher,
) -> impl Iterator<Item = EarthquakeDiagnostic> {
  diagnostics
    .into_iter()
    .filter(|d| switcher.contains(IssueKindSwitcher::from_bits_truncate(1 << d.kind() as u32)))
}
