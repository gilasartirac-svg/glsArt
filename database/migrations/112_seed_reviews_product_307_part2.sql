-- Seed reviews for product #307, part 2.
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas307_007','093070007','کسری جعفری'),
('review_seed_user_gilas307_008','093070008','دلارام پاکدل'),
('review_seed_user_gilas307_009','093070009','محدثه حسنی'),
('review_seed_user_gilas307_010','093070010','کامران خسروی'),
('review_seed_user_gilas307_011','093070011','آیدا قاسمی'),
('review_seed_user_gilas307_012','093070012','آیدا پاکدل');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas307_007','review_seed_user_gilas307_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas307')),5,'این تابلو رو به عنوان کادو تولد خریدم و طرف مقابل عاشقش شد.',0,'1394-01-09T00:00:00.000Z'),
('review_seed_gilas307_008','review_seed_user_gilas307_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas307')),5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'1400-06-12T00:00:00.000Z'),
('review_seed_gilas307_009','review_seed_user_gilas307_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas307')),5,'کار دست‌ساز قشنگیه. کی تخفیف می‌ذارین؟ منتظر پیشنهاد ویژه‌ام.',0,'1405-03-24T00:00:00.000Z'),
('review_seed_gilas307_010','review_seed_user_gilas307_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas307')),5,'این تابلو رو برای دفتر کارم گرفتم و همه همکاران تعریف کردن.',0,'1402-12-08T00:00:00.000Z'),
('review_seed_gilas307_011','review_seed_user_gilas307_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas307')),5,'عالی بود. ای کاش سایز بزرگتری انتخاب کرده بودم.',0,'1395-08-18T00:00:00.000Z'),
('review_seed_gilas307_012','review_seed_user_gilas307_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas307')),5,'این تابلو رو برای سالن پذیرایی گرفتم و همه تعریف کردن.',0,'1396-06-17T00:00:00.000Z');
