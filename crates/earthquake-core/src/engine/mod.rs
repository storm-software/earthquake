use earthquake_common::{NormalizedOptions, Options};
use earthquake_error::EarthquakeResult;
use earthquake_plugin::pluginable::SharedPluginable;
use earthquake_tracing::Session;
use std::future::{Future, ready};

use crate::{
  Route,
  route_factory::{RouteFactory, RouteFactoryOptions},
};

pub struct Engine {
  pub(super) session: Session,
  pub(super) is_closed: bool,
  pub(super) route_factory: RouteFactory,
}

impl Engine {
  pub fn new(options: Options) -> EarthquakeResult<Self> {
    Self::with_plugins(options, Vec::new())
  }

  pub fn with_plugins(options: Options, plugins: Vec<SharedPluginable>) -> EarthquakeResult<Self> {
    let normalized_options = NormalizedOptions::from(options);

    let route_factory = RouteFactory::new(RouteFactoryOptions {
      options: normalized_options,
      plugins,
      session: None,
    });

    Ok(Self { route_factory, is_closed: false, session: Session::dummy() })
  }

  pub fn is_closed(&self) -> bool {
    self.is_closed
  }

  #[tracing::instrument(level = "debug", skip_all, parent = &self.session.span)]
  pub fn prepare_routes<'a>(&mut self) -> EarthquakeResult<Route<'a>> {
    self.create_error_if_closed()?;

    self.route_factory.create()
  }

  #[must_use = "Future must be awaited to do the actual cleanup work"]
  pub fn close(&mut self) -> impl Future<Output = anyhow::Result<()>> + Send + 'static {
    let was_closed = self.is_closed;

    {
      let guard = self.route_factory.last_handle.lock().unwrap();
      let has_handle = guard.is_some();

      if has_handle && !was_closed {
        if let Some(handle) = guard.as_ref() {
          handle.plugin_driver().clear();
        }

        self.is_closed = true;
      }
    }

    ready(Ok(()))
  }

  pub(super) fn create_error_if_closed(&self) -> EarthquakeResult<()> {
    if self.is_closed {
      Err(anyhow::anyhow!("Engine is closed"))?;
    }

    Ok(())
  }
}
