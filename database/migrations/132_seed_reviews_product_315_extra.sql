INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas315_001x','09315x0001','جواد غفاری'),
('review_seed_user_gilas315_002x','09315x0002','بهنام سلطانی'),
('review_seed_user_gilas315_003x','09315x0003','محسن کرمی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas315_001x','review_seed_user_gilas315_001x',(SELECT id FROM products WHERE lower(sku)=lower('gilas315')),5,'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟',0,'1403-05-27T00:00:00.000Z'),
('review_seed_gilas315_002x','review_seed_user_gilas315_002x',(SELECT id FROM products WHERE lower(sku)=lower('gilas315')),5,'کیفیت برش دستی عالی بود. قاب مشکی خیلی شیک دراومده روی دیوار خونه‌مون.',0,'1395-06-27T00:00:00.000Z'),
('review_seed_gilas315_003x','review_seed_user_gilas315_003x',(SELECT id FROM products WHERE lower(sku)=lower('gilas315')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1401-01-13T00:00:00.000Z');
