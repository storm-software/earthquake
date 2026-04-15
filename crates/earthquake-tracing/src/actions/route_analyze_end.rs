#[derive(ts_rs::TS, serde::Serialize, Debug)]
#[ts(export)]
pub struct RouteAnalyzeEnd {
  #[ts(type = "'RouteAnalyzeEnd'")]
  pub action: &'static str,
  pub path: String,
}
