-- Product 324 reviews 7-12
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas324_007','الهام موسوی','093324007');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_007',5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'13 شهریور 1393');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas324_008','حدیث عزیزی','093324008');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_008',5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'27 آبان 1402');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas324_009','شیما غلامی','093324009');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_009',5,'تابلو دقیقاً مطابق عکس بود و حتی قشنگ‌تر. دستتون درد نکنه.',0,'16 اردیبهشت 1398');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas324_010','اردشیر ملکی','093324010');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_010',5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'29 خرداد 1405');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas324_011','حدیث ابراهیمی','093324011');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_011',5,'تابلو عالیه. ای کاش بزرگترش رو گرفته بودم، الان حس می‌کنم کوچیکه.',0,'15 مرداد 1404');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas324_012','بهار درویشی','093324012');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas324_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas324')),'review_seed_user_gilas324_012',5,'تابلو خیلی قشنگه ولی ای کاش زودتر می‌فرستادین. منتظر موندن سخت بود.',0,'24 مهر 1403');
