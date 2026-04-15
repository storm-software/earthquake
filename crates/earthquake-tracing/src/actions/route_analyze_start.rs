#[derive(ts_rs::TS, serde::Serialize, Debug)]
#[ts(export)]
pub struct RouteAnalyzeStart {
  #[ts(type = "'RouteAnalyzeStart'")]
  pub action: &'static str,
  pub path: String,
}
