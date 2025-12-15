#[derive(ts_rs::TS, serde::Serialize)]
#[ts(export)]
pub struct RoutePrepareStart {
  #[ts(type = "'RoutePrepareStart'")]
  pub action: &'static str,
  pub path: String,
}
