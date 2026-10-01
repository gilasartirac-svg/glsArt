INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas308_007','093080007','ناصر موسوی'),
('review_seed_user_gilas308_008','093080008','رستم زمانی'),
('review_seed_user_gilas308_009','093080009','نیما آقایی'),
('review_seed_user_gilas308_010','093080010','شایان امیری'),
('review_seed_user_gilas308_011','093080011','جواد ملکی'),
('review_seed_user_gilas308_012','093080012','داریوش شریفی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas308_007','review_seed_user_gilas308_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1394-02-01T00:00:00.000Z'),
('review_seed_gilas308_008','review_seed_user_gilas308_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.',0,'1395-12-20T00:00:00.000Z'),
('review_seed_gilas308_009','review_seed_user_gilas308_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'1402-06-15T00:00:00.000Z'),
('review_seed_gilas308_010','review_seed_user_gilas308_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'رنگ قاب قهوه‌ای سوخته با فضای سنتی خونه‌مون عالی ست شده.',0,'1404-09-18T00:00:00.000Z'),
('review_seed_gilas308_011','review_seed_user_gilas308_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1397-10-10T00:00:00.000Z'),
('review_seed_gilas308_012','review_seed_user_gilas308_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas308')),5,'کار قشنگیه ولی ای کاش سریع‌تر ارسال می‌کردین.',0,'1401-05-19T00:00:00.000Z');
