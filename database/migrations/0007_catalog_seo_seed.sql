PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY,value TEXT NOT NULL,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO site_settings(key,value) VALUES ('site_name','گیلاس آرت'),('site_description','فروشگاه آنلاین آثار هنری و تابلوهای دکوراتیو با ارسال به سراسر ایران.'),('seo_title','گیلاس آرت | خرید تابلو و آثار هنری'),('seo_description','خرید آنلاین تابلو و آثار هنری دکوراتیو؛ انتخاب آثار، مشاهده جزئیات و پرداخت امن در گیلاس آرت.'),('seo_keywords','تابلو, تابلو دکوراتیو, خرید تابلو, آثار هنری, گیلاس آرت'),('og_image','');
INSERT OR IGNORE INTO categories(id,slug,name,description,active) VALUES
('cat_abstract','abstract','آبستره','آثار انتزاعی با تمرکز بر رنگ، فرم و بافت.',1),
('cat_modern','modern','مدرن','تابلوهای مدرن برای فضاهای معاصر.',1),
('cat_minimal','minimal','مینیمال','آثار آرام و مینیمال برای دکوراسیون خلوت.',1),
('cat_classic','classic','کلاسیک','آثار با حال‌وهوای اصیل و ماندگار.',1);
INSERT OR IGNORE INTO products(id,category_id,slug,sku,name,description,price_irt,active,seo_title,seo_description) VALUES
('sample_mehr','cat_abstract','mehr','GA-1001','مهرِ خاک و نور','تابلوی آبستره با ترکیب خاکی، مسی و نور گرم؛ مناسب نشیمن و فضای پذیرایی.',8900000,1,'مهر خاک و نور | تابلو آبستره','تابلو آبستره مهر خاک و نور با رنگ‌های گرم، مناسب دکوراسیون نشیمن و پذیرایی.'),
('sample_shab','cat_modern','shab','GA-1002','شبِ آرام','اثری مدرن با فضای شبانه، ماه روشن و لایه‌های عمیق آبی؛ مناسب اتاق و فضای مطالعه.',7600000,1,'شب آرام | تابلو مدرن','تابلو مدرن شب آرام با طیف آبی و نور ماه، مناسب فضای مطالعه و دکوراسیون مدرن.'),
('sample_khak','cat_minimal','khak','GA-1003','هندسه‌ی خاک','ترکیب مینیمال فرم‌های هندسی و رنگ‌های خاکی؛ انتخابی متعادل برای فضاهای مدرن.',6400000,1,'هندسه خاک | تابلو مینیمال','تابلو مینیمال هندسه خاک با فرم‌های هندسی و طیف طبیعی برای دکوراسیون مدرن.'),
('sample_barg','cat_abstract','barg','GA-1004','رقص برگ‌ها','اثری انتزاعی با خطوط روان و رنگ‌های سبز و طلایی، الهام‌گرفته از حرکت برگ‌ها.',9800000,1,'رقص برگ‌ها | اثر هنری','تابلو رقص برگ‌ها با ترکیب سبز و طلایی، مناسب فضاهای گرم و هنری.'),
('sample_sokoot','cat_minimal','sokoot','GA-1005','سکوت روشن','تابلویی مینیمال با تضاد نرم میان فرم‌های روشن و خطوط تیره؛ مناسب خانه‌های مینیمال.',5200000,1,'سکوت روشن | تابلو مینیمال','تابلو مینیمال سکوت روشن برای دکوراسیون آرام و مدرن.'),
('sample_atiq','cat_classic','atiq','GA-1006','عطرِ عتیق','اثری با حال‌وهوای کلاسیک و پالت گرم، مناسب فضاهای رسمی و دکوراسیون اصیل.',12500000,1,'عطر عتیق | تابلو کلاسیک','تابلو کلاسیک عطر عتیق با پالت گرم و حس اصیل برای فضاهای رسمی.');
INSERT OR IGNORE INTO inventory(product_id,quantity) VALUES ('sample_mehr',8),('sample_shab',6),('sample_khak',10),('sample_barg',5),('sample_sokoot',12),('sample_atiq',4);
INSERT OR IGNORE INTO product_images(id,product_id,path,alt_text,sort_order,is_primary) VALUES
('img_mehr','sample_mehr','/glsArt/art/mehr.svg','تابلو آبستره مهر خاک و نور',0,1),
('img_shab','sample_shab','/glsArt/art/shab.svg','تابلو مدرن شب آرام',0,1),
('img_khak','sample_khak','/glsArt/art/khak.svg','تابلو مینیمال هندسه خاک',0,1),
('img_barg','sample_barg','/glsArt/art/barg.svg','تابلو رقص برگ‌ها',0,1),
('img_sokoot','sample_sokoot','/glsArt/art/sokoot.svg','تابلو مینیمال سکوت روشن',0,1),
('img_atiq','sample_atiq','/glsArt/art/atiq.svg','تابلو کلاسیک عطر عتیق',0,1);
INSERT OR IGNORE INTO permissions(id,name) VALUES
('perm_coupons_read','coupons.read'),('perm_coupons_write','coupons.write'),
('perm_reviews_read','reviews.read'),('perm_reviews_write','reviews.write'),
('perm_settings_read','settings.read'),('perm_settings_write','settings.write');
INSERT OR IGNORE INTO role_permissions(role_id,permission_id)
SELECT ar.id,p.id FROM admin_roles ar JOIN permissions p ON p.name IN ('coupons.read','coupons.write','reviews.read','reviews.write','settings.read','settings.write')
WHERE ar.name IN ('admin','super_admin','manager');
