-- Product 330 review seed 330a
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas330_001','آرش عزیزی','093330001');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas330_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas330')),'review_seed_user_gilas330_001',5,'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.',0,'23 مهر 1401');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas330_002','لیلا اسماعیلی','093330002');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas330_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas330')),'review_seed_user_gilas330_002',5,'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.',0,'9 بهمن 1401');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas330_003','علی رحیمی','093330003');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas330_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas330')),'review_seed_user_gilas330_003',5,'جزئیات کار واقعاً دقیق و تمیزه. ممنون از هنرتون.',0,'2 خرداد 1398');
