INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas308_001x','09308x0001','حسین نجفی'),
('review_seed_user_gilas308_002x','09308x0002','مریم سلطانی'),
('review_seed_user_gilas308_003x','09308x0003','داریوش سلیمانی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas308_001x','review_seed_user_gilas308_001x',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1401-01-03T00:00:00.000Z'),
('review_seed_gilas308_002x','review_seed_user_gilas308_002x',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'1398-08-30T00:00:00.000Z'),
('review_seed_gilas308_003x','review_seed_user_gilas308_003x',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'برش‌های دستی مس باعث شده هر تابلو منحصر به فرد باشه. عالیه.',0,'1401-11-26T00:00:00.000Z');
