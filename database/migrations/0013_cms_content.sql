PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cms_entries(
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL CHECK(section IN ('about','contact','news','articles')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  summary TEXT,
  body TEXT,
  phone TEXT,
  mobile TEXT,
  address TEXT,
  map_url TEXT,
  active INTEGER NOT NULL DEFAULT 1 CHECK(active IN(0,1)),
  published_at TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cms_entries_section ON cms_entries(section,active,sort_order,published_at);
CREATE UNIQUE INDEX IF NOT EXISTS uq_cms_entries_section_slug ON cms_entries(section,slug);

INSERT OR IGNORE INTO permissions(id,name) VALUES('perm_content_read','content.read'),('perm_content_write','content.write');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'admin-role',id FROM permissions WHERE name IN('content.read','content.write');

INSERT OR IGNORE INTO cms_entries(id,section,title,slug,summary,body,active,published_at,sort_order)
VALUES
('cms_about_01','about','درباره گیلاس آرت','about-main','گیلاس آرت با تمرکز بر هنر دست‌ساز و تجربه‌ای شفاف برای خرید آثار هنری فعالیت می‌کند.','گیلاس آرت تلاش می‌کند میان هنر اصیل، انتخاب آگاهانه و تجربه‌ای ساده برای مشتری ارتباطی زیبا ایجاد کند.',1,CURRENT_TIMESTAMP,0);

INSERT OR IGNORE INTO cms_entries(id,section,title,slug,summary,body,active,published_at,sort_order)
VALUES
('cms_news_01','news','آغاز فصل تازه گیلاس آرت','new-season','مجموعه‌ای تازه از آثار معرق مس در راه است.','به‌زودی مجموعه جدید آثار با جزئیات بیشتر در فروشگاه منتشر می‌شود.',1,CURRENT_TIMESTAMP,1),
('cms_news_02','news','به‌روزرسانی فروشگاه آنلاین','online-store','امکانات جدید فروشگاه و پنل مدیریت در حال توسعه است.','تجربه خرید، پرداخت و مدیریت محتوا در نسخه جدید با تمرکز بر سادگی و امنیت بهبود یافته است.',1,datetime('now','-1 day'),2),
('cms_news_03','news','پذیرش سفارش‌های سفارشی','custom-orders','امکان هماهنگی برای سفارش‌های خاص فراهم شده است.','برای بررسی امکان ساخت اثر متناسب با فضای مورد نظر، با هنرکده تماس بگیرید.',1,datetime('now','-2 day'),3);

INSERT OR IGNORE INTO cms_entries(id,section,title,slug,summary,body,active,published_at,sort_order)
VALUES
('cms_article_01','articles','راهنمای انتخاب تابلو برای فضای خانه','choosing-art','چطور اثر مناسب با ابعاد، نور و سبک فضای خود را انتخاب کنیم؟','ابتدا ابعاد دیوار و فاصله دید را بررسی کنید، سپس به نور محیط و هماهنگی رنگ‌ها با مبلمان توجه کنید.',1,CURRENT_TIMESTAMP,1),
('cms_article_02','articles','چرا معرق مس؟','copper-inlay','نگاهی کوتاه به ویژگی‌های بصری و هنری معرق مس.','ترکیب بافت، درخشش فلز و ظرافت کار دست باعث می‌شود هر اثر شخصیت بصری ویژه‌ای داشته باشد.',1,datetime('now','-1 day'),2),
('cms_article_03','articles','نگهداری از آثار هنری','art-care','چند نکته برای حفظ زیبایی اثر در طول زمان.','اثر را دور از رطوبت مستقیم، مواد شوینده و تابش شدید و طولانی‌مدت آفتاب نگهداری کنید.',1,datetime('now','-2 day'),3);

INSERT OR IGNORE INTO cms_entries(id,section,title,slug,summary,body,phone,mobile,address,map_url,active,published_at,sort_order)
VALUES
('cms_contact_01','contact','ارتباط با هنرکده گیلاس آرت','contact-main','برای خرید، پیگیری سفارش و مشاوره با ما در ارتباط باشید.','همکاران گیلاس آرت آماده پاسخ‌گویی به پرسش‌های شما هستند.','02100000000','09120000000','تهران، آدرس نمونه هنرکده گیلاس آرت','https://maps.google.com/?q=Tehran',1,CURRENT_TIMESTAMP,0);
