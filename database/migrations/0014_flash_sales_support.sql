PRAGMA foreign_keys = ON;

ALTER TABLE products ADD COLUMN flash_sale_active INTEGER NOT NULL DEFAULT 0 CHECK(flash_sale_active IN(0,1));
ALTER TABLE products ADD COLUMN flash_sale_ends_at TEXT;
ALTER TABLE products ADD COLUMN flash_sale_price_irt INTEGER;
CREATE INDEX IF NOT EXISTS idx_products_flash_sale ON products(flash_sale_active,flash_sale_ends_at);

CREATE TABLE IF NOT EXISTS support_tickets(
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'عمومی',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK(priority IN('low','normal','high')),
  status TEXT NOT NULL DEFAULT 'open' CHECK(status IN('open','closed')),
  stage TEXT NOT NULL DEFAULT 'ثبت شده',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  closed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status,updated_at DESC);

CREATE TABLE IF NOT EXISTS ticket_messages(
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  author_type TEXT NOT NULL CHECK(author_type IN('customer','admin')),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id,created_at);

CREATE TABLE IF NOT EXISTS faq_entries(
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_faq_active ON faq_entries(active,sort_order);

INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_support_read','support.read'),
('perm_support_write','support.write');

INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT 'admin-role',id FROM permissions WHERE name IN('support.read','support.write');

INSERT OR IGNORE INTO faq_entries(id,question,answer,sort_order) VALUES
('faq_01','چطور سفارش خود را پیگیری کنم؟','از حساب کاربری وارد بخش تیکت پشتیبانی شوید یا شماره سفارش خود را در پیام تیکت درج کنید. وضعیت تیکت در همین پرتال نمایش داده می‌شود.',1),
('faq_02','زمان پاسخ‌گویی به تیکت چقدر است؟','تیکت پس از ثبت وارد مرحله بررسی می‌شود و پاسخ تیم پشتیبانی در همان صفحه قابل مشاهده خواهد بود.',2),
('faq_03','آیا امکان سفارش سفارشی وجود دارد؟','برای بررسی سفارش‌های سفارشی، یک تیکت با موضوع سفارش سفارشی ثبت کنید و ابعاد و توضیحات مورد نظر را بنویسید.',3),
('faq_04','چطور مشکل پرداخت را پیگیری کنم؟','شماره سفارش و شرح خطای پرداخت را در تیکت ارسال کنید تا تیم پشتیبانی بررسی کند.',4);
