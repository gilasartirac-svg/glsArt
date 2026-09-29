-- Add seller identity fields used by the invoice settings form.
INSERT OR IGNORE INTO site_settings(key,value,updated_at) VALUES
('invoice_national_id','',CURRENT_TIMESTAMP),
('invoice_registration_number','',CURRENT_TIMESTAMP),
('invoice_postal_code','',CURRENT_TIMESTAMP);
