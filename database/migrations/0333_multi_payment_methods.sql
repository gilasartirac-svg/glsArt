-- Multi-provider payments: ZarinPal, NovinoPay and manual card transfer.
ALTER TABLE payments ADD COLUMN provider TEXT NOT NULL DEFAULT 'zarinpal';
ALTER TABLE payments ADD COLUMN transaction_id TEXT;
ALTER TABLE payments ADD COLUMN card_pan TEXT;
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider);
INSERT OR IGNORE INTO site_settings(key,value,updated_at) VALUES
('payment_zarinpal_enabled','1',CURRENT_TIMESTAMP),
('payment_novinopay_enabled','0',CURRENT_TIMESTAMP),
('payment_card_transfer_enabled','0',CURRENT_TIMESTAMP),
('payment_default_provider','zarinpal',CURRENT_TIMESTAMP),
('payment_zarinpal_title','زرین‌پال',CURRENT_TIMESTAMP),
('payment_novinopay_title','نوینو پی',CURRENT_TIMESTAMP),
('payment_card_transfer_title','کارت به کارت',CURRENT_TIMESTAMP),
('novinopay_callback_url','https://api.gilasart.ir/api/payment/callback',CURRENT_TIMESTAMP),
('card_transfer_bank_name','',CURRENT_TIMESTAMP),
('card_transfer_account_holder','',CURRENT_TIMESTAMP),
('card_transfer_card_number','',CURRENT_TIMESTAMP),
('card_transfer_iban','',CURRENT_TIMESTAMP),
('card_transfer_instructions','پس از انتقال وجه، سفارش توسط واحد فروش بررسی و تایید می‌شود.',CURRENT_TIMESTAMP);