use anyhow::Context;
use earthquake_common::types::{
  normalized_options::SharedNormalizedOptions, plugin_idx::PluginIdx,
};
use earthquake_error::issues::plugin_error::CausedPlugin;
use earthquake_tracing::{Session, actions, trace_action};
use oxc_index::IndexVec;
use std::{
  ops::Deref,
  sync::{Arc, Weak},
};
use tracing::Instrument;

use crate::{
  plugin::HookReturn,
  plugin_context::{
    PluginContext, native_plugin_context::NativePluginContextImpl,
    plugin_context_meta::PluginContextMeta,
  },
  pluginable::{IndexPluginContext, IndexPluginable, SharedPluginable},
  types::{hook_args::HookArgs, plugin_hook_meta::PluginHookOrders},
};

pub type SharedPluginDriver = Arc<PluginDriver>;

pub struct PluginDriverFactory {
  plugins: Vec<SharedPluginable>,
}

impl PluginDriverFactory {
  pub fn new(plugins: Vec<SharedPluginable>) -> Self {
    Self { plugins }
  }

  pub fn create_plugin_driver(
    &self,
    options: &SharedNormalizedOptions,
    session: &Session,
    initial_route_span: &Arc<tracing::Span>,
  ) -> Arc<crate::plugin_driver::PluginDriver> {
    let meta = Arc::new(PluginContextMeta::default());
    let mut plugin_usage_vec = IndexVec::new();

    // Clone the Arc to share across contexts
    let route_span_arc = Arc::clone(initial_route_span);

    Arc::new_cyclic(|plugin_driver| {
      let mut index_plugins = IndexPluginable::with_capacity(self.plugins.len());
      let mut index_contexts = IndexPluginContext::with_capacity(self.plugins.len());

      self.plugins.iter().for_each(|plugin| {
        let plugin_idx = index_plugins.push(Arc::clone(plugin));
        plugin_usage_vec.push(plugin.call_hook_usage());

        index_contexts.push(PluginContext::Native(Arc::new(NativePluginContextImpl {
          plugin_name: plugin.call_name(),
          plugin_idx,
          plugin_driver: Weak::clone(plugin_driver),
          meta: Arc::clone(&meta),
          options: Arc::clone(options),
          session: session.clone(),
          route_span: Arc::clone(&route_span_arc),
        })));
      });

      PluginDriver {
        hook_orders: PluginHookOrders::new(&index_plugins, &plugin_usage_vec),
        plugins: index_plugins,
        contexts: index_contexts,
      }
    })
  }
}

#[derive(Debug)]
pub struct PluginDriver {
  plugins: IndexPluginable,
  contexts: IndexPluginContext,
  hook_orders: PluginHookOrders,
}

impl PluginDriver {
  pub fn iter_plugin_with_context_by_order<'me>(
    &'me self,
    ordered_plugins: &'me [PluginIdx],
  ) -> impl Iterator<Item = (PluginIdx, &'me SharedPluginable, &'me PluginContext)> + 'me {
    ordered_plugins.iter().copied().map(move |idx| {
      let plugin = &self.plugins[idx];
      let context = &self.contexts[idx];
      (idx, plugin, context)
    })
  }

  pub fn plugins(&self) -> &IndexPluginable {
    &self.plugins
  }

  #[tracing::instrument(target = "devtool", level = "trace", skip_all)]
  pub async fn layout(&self, args: &HookArgs<'_>) -> HookReturn {
    for (plugin_idx, plugin, ctx) in
      self.iter_plugin_with_context_by_order(&self.order_by_layout_meta)
    {
      let ret = async {
        trace_action!(actions::HookCallStart {
          action: "Layout",
          id: args.id.clone(),
          path: args.path.to_string_lossy().into(),
          code: args.code.clone(),
          plugin_name: plugin.call_name().to_string(),
          plugin_id: plugin_idx.raw(),
          call_id: "${call_id}",
        });

        if let Some(r) = plugin.call_layout(ctx, args).await? {
          trace_action!(actions::HookCallEnd {
            action: "Layout",
            id: args.id.clone(),
            path: args.path.to_string_lossy().into(),
            code: Some(r.code.to_string()),
            original_code: args.code.clone(),
            plugin_name: plugin.call_name().to_string(),
            plugin_id: plugin_idx.raw(),
            call_id: "${call_id}",
          });

          anyhow::Ok(Some(r))
        } else {
          trace_action!(actions::HookCallEnd {
            action: "Layout",
            id: args.id.clone(),
            path: args.path.to_string_lossy().into(),
            code: None,
            original_code: args.code.clone(),
            plugin_name: plugin.call_name().to_string(),
            plugin_id: plugin_idx.raw(),
            call_id: "${call_id}",
          });

          Ok(None)
        }
      }
      .instrument(tracing::trace_span!(
        "HookLayoutCall",
        CONTEXT_call_id = earthquake_utils::uuid::uuid_v4()
      ))
      .await
      .with_context(|| CausedPlugin::new(plugin.call_name()))?;
      if ret.is_some() {
        return Ok(ret);
      }
    }

    Ok(None)
  }

  pub fn clear(&self) {}
}

impl Deref for PluginDriver {
  type Target = PluginHookOrders;
  fn deref(&self) -> &Self::Target {
    &self.hook_orders
  }
}
