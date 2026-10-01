INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas316_001x','09316x0001','شهرام سلطانی'),
('review_seed_user_gilas316_002x','09316x0002','مینا رستمی'),
('review_seed_user_gilas316_003x','09316x0003','فرزاد خسروی'),
('review_seed_user_gilas316_004x','09316x0004','آتنا هاشمی'),
('review_seed_user_gilas316_005x','09316x0005','یاسمن غفاری'),
('review_seed_user_gilas316_006x','09316x0006','جواد حیدری');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas316_001x','review_seed_user_gilas316_001x',(SELECT id FROM products WHERE lower(sku)=lower('gilas316')),5,'کیفیت ساخت خوبه. کی تخفیف ویژه می‌ذارین برای خرید بعدی؟',0,'1394-06-08T00:00:00.000Z'),
('review_seed_gilas316_002x','review_seed_user_gilas316_002x',(SELECT id FROM products WHERE lower(sku)=lower('gilas316')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1401-04-22T00:00:00.000Z'),
('review_seed_gilas316_003x','review_seed_user_gilas316_003x',(SELECT id FROM products WHERE lower(sku)=lower('gilas316')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1401-08-07T00:00:00.000Z'),
('review_seed_gilas316_004x','review_seed_user_gilas316_004x',(SELECT id FROM products WHERE lower(sku)=lower('gilas316')),5,'برش دستی مس باعث شده کار کاملاً منحصر به فرد باشه. راضی‌ام.',0,'1400-05-18T00:00:00.000Z'),
('review_seed_gilas316_005x','review_seed_user_gilas316_005x',(SELECT id FROM products WHERE lower(sku)=lower('gilas316')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1393-12-26T00:00:00.000Z'),
('review_seed_gilas316_006x','review_seed_user_gilas316_006x',(SELECT id FROM products WHERE lower(sku)=lower('gilas316')),5,'چرا اینقدر گرونه؟ مگه برش این‌ها چقدر طول می‌کشه؟ البته کیفیتش خوبه.',0,'1404-04-14T00:00:00.000Z');
