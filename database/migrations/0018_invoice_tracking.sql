-- Invoice and customer order tracking settings
INSERT OR IGNORE INTO site_settings(key,value,updated_at) VALUES
('invoice_store_name','فروشگاه صنایع دستی گیلاس آرت',CURRENT_TIMESTAMP),
('invoice_economic_code','',CURRENT_TIMESTAMP),
('invoice_phone','',CURRENT_TIMESTAMP),
('invoice_mobile','',CURRENT_TIMESTAMP),
('invoice_address','',CURRENT_TIMESTAMP),
('invoice_logo_path','/glsArt/invoice/logo.svg',CURRENT_TIMESTAMP),
('invoice_signature_path','',CURRENT_TIMESTAMP);
