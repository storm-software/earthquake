use std::sync::{Arc, atomic::AtomicU32};

static ROUTE_ID_SEED: AtomicU32 = AtomicU32::new(0);

pub fn generate_route_id(route_count: u32) -> Arc<str> {
  let seed = ROUTE_ID_SEED.fetch_add(1, std::sync::atomic::Ordering::Relaxed);

  format!("rid_{seed}_count_{route_count}").into()
}
