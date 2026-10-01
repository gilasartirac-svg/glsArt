INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas310_001','093100001','پویا امینی'),
('review_seed_user_gilas310_002','093100002','بابک میرزایی'),
('review_seed_user_gilas310_003','093100003','امیر شریفی'),
('review_seed_user_gilas310_004','093100004','بهنام خسروی'),
('review_seed_user_gilas310_005','093100005','علی احمدی'),
('review_seed_user_gilas310_006','093100006','پروین درویشی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas310_001','review_seed_user_gilas310_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas310')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1395-09-15T00:00:00.000Z'),
('review_seed_gilas310_002','review_seed_user_gilas310_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas310')),5,'ترکیب مس براق با قاب مشکی فوق‌العاده مدرن و زیباست.',0,'1396-05-06T00:00:00.000Z'),
('review_seed_gilas310_003','review_seed_user_gilas310_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas310')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1399-04-27T00:00:00.000Z'),
('review_seed_gilas310_004','review_seed_user_gilas310_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas310')),5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'1396-12-29T00:00:00.000Z'),
('review_seed_gilas310_005','review_seed_user_gilas310_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas310')),5,'از نزدیک که نگاه می‌کنی متوجه ظرافت کار دست می‌شی. عالیه.',0,'1401-03-22T00:00:00.000Z'),
('review_seed_gilas310_006','review_seed_user_gilas310_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas310')),5,'قاب PVC با کیفیت و رنگ ثابت. خیلی راضی هستم.',0,'1404-10-19T00:00:00.000Z');
