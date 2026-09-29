-- Normalize legacy invoice seller setting into the dedicated invoice settings key.
INSERT INTO site_settings(key,value,updated_at)
SELECT 'invoice_store_name',value,CURRENT_TIMESTAMP
FROM site_settings
WHERE key='invoice_seller_name'
  AND TRIM(COALESCE(value,''))<>''
  AND NOT EXISTS(
    SELECT 1 FROM site_settings
    WHERE key='invoice_store_name' AND TRIM(COALESCE(value,''))<>''
  );
