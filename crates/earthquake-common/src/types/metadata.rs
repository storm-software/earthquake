#![allow(clippy::unused_async)]

use anyhow::{Result, bail};
use camino::Utf8PathBuf;
use serde::{Deserialize, Serialize};

/// A single metadata file plus an optional "alt" text file.
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub enum MetadataWithAltItem {
  /// Static metadata.
  Static {
    /// The path to the metadata file.
    path: Utf8PathBuf,
    /// An optional path to an "alt" text file that can provide alternative content for the metadata.
    alt_path: Option<Utf8PathBuf>,
  },
  /// Dynamic metadata.
  Dynamic {
    /// The path to the metadata file.
    path: Utf8PathBuf,
  },
}

/// A single metadata file.
#[derive(Clone, Debug, Hash, Serialize, Deserialize, PartialEq, Eq)]
pub enum MetadataItem {
  /// Static metadata.
  Static {
    /// The path to the metadata file.
    path: Utf8PathBuf,
  },
  /// Dynamic metadata.
  Dynamic {
    /// The path to the metadata file.
    path: Utf8PathBuf,
  },
}

/// Get the route name for a metadata item.
pub async fn get_metadata_route_name(meta: MetadataItem) -> Result<String> {
  Ok(match meta {
    MetadataItem::Static { path } => path.file_name().unwrap().to_string(),
    MetadataItem::Dynamic { path } => {
      let Some(stem) = path.file_stem() else {
        bail!("Unable to resolve file stem for metadata item at {path}.");
      };

      stem.to_string()
    }
  })
}

impl MetadataItem {
  /// Convert the MetadataItem into its Utf8PathBuf.
  pub fn into_path(self) -> Utf8PathBuf {
    match self {
      MetadataItem::Static { path } | MetadataItem::Dynamic { path } => path,
    }
  }
}

impl From<MetadataWithAltItem> for MetadataItem {
  fn from(value: MetadataWithAltItem) -> Self {
    match value {
      MetadataWithAltItem::Static { path, .. } => MetadataItem::Static { path },
      MetadataWithAltItem::Dynamic { path } => MetadataItem::Dynamic { path },
    }
  }
}

/// Metadata file that can be placed in any segment of the app directory.
#[derive(Default, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct Metadata {
  /// Icon metadata.
  #[serde(skip_serializing_if = "Vec::is_empty", default)]
  pub icon: Vec<MetadataWithAltItem>,
  /// Apple metadata.
  #[serde(skip_serializing_if = "Vec::is_empty", default)]
  pub apple: Vec<MetadataWithAltItem>,
  /// Twitter metadata.
  #[serde(skip_serializing_if = "Vec::is_empty", default)]
  pub twitter: Vec<MetadataWithAltItem>,
  /// Open Graph metadata.
  #[serde(skip_serializing_if = "Vec::is_empty", default)]
  pub open_graph: Vec<MetadataWithAltItem>,
  /// Sitemap metadata.
  #[serde(skip_serializing_if = "Option::is_none")]
  pub sitemap: Option<MetadataItem>,
}

impl Metadata {
  /// Check if the metadata is empty.
  pub fn is_empty(&self) -> bool {
    let Metadata { icon, apple, twitter, open_graph, sitemap } = self;
    icon.is_empty()
      && apple.is_empty()
      && twitter.is_empty()
      && open_graph.is_empty()
      && sitemap.is_none()
  }
}

/// Metadata files that can be placed in the root of the app directory.
#[derive(Default, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct GlobalMetadata {
  /// Favicon metadata.
  #[serde(skip_serializing_if = "Option::is_none")]
  pub favicon: Option<MetadataItem>,
  /// Robots.txt metadata.
  #[serde(skip_serializing_if = "Option::is_none")]
  pub robots: Option<MetadataItem>,
  /// Manifest metadata.
  #[serde(skip_serializing_if = "Option::is_none")]
  pub manifest: Option<MetadataItem>,
}

impl GlobalMetadata {
  /// Check if the global metadata is empty.
  pub fn is_empty(&self) -> bool {
    let GlobalMetadata { favicon, robots, manifest } = self;
    favicon.is_none() && robots.is_none() && manifest.is_none()
  }
}
