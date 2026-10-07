-- Translation storage is additive: base tables remain the canonical fallback.
-- Missing translations MUST fall back to the source field; no existing product/category row is changed.
CREATE TABLE IF NOT EXISTS content_translations(
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK(entity_type IN ('product','category','cms','faq','site_setting','product_attribute','product_attribute_option')),
  entity_id TEXT NOT NULL,
  field TEXT NOT NULL,
  locale TEXT NOT NULL CHECK(locale IN ('fa','en','tr','ar')),
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(entity_type,entity_id,field,locale)
);
CREATE INDEX IF NOT EXISTS idx_content_translations_lookup
  ON content_translations(entity_type,entity_id,locale,field);
CREATE INDEX IF NOT EXISTS idx_content_translations_locale
  ON content_translations(locale,entity_type);
