-- Product 330 review seed 330b
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas330_004','مهتاب درویشی','093330004');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas330_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas330')),'review_seed_user_gilas330_004',5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'1 اردیبهشت 1404');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas330_005','کسری محمودی','093330005');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas330_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas330')),'review_seed_user_gilas330_005',5,'جزئیات کار فوق‌العاده ظریفه. واقعاً کار استادانه‌ست.',0,'17 بهمن 1400');
INSERT OR IGNORE INTO users (id,name,mobile) VALUES ('review_seed_user_gilas330_006','سامان زارعی','093330006');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas330_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas330')),'review_seed_user_gilas330_006',5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'12 مهر 1400');
