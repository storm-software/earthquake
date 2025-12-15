#[derive(ts_rs::TS, serde::Serialize)]
#[ts(export)]
pub struct RoutePrepareEnd {
  #[ts(type = "'RoutePrepareEnd'")]
  pub action: &'static str,
  pub path: String,
}
