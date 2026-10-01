-- Seed 12 owner-supplied demo reviews for product #154 (gilas154).
-- Independent migration; demo users are intentionally separate from real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_gilas154_001','09154001','مریم فرهادی'),
('review_seed_user_gilas154_002','09154002','محمدعلی کرمی'),
('review_seed_user_gilas154_003','09154003','فرهاد کرمی'),
('review_seed_user_gilas154_004','09154004','آریا عباسی'),
('review_seed_user_gilas154_005','09154005','لیلا قاسمی'),
('review_seed_user_gilas154_006','09154006','حسن میرزایی'),
('review_seed_user_gilas154_007','09154007','بهروز اسدی'),
('review_seed_user_gilas154_008','09154008','یوسف کریمی'),
('review_seed_user_gilas154_009','09154009','علیرضا نجفی'),
('review_seed_user_gilas154_010','09154010','ستاره زمانی'),
('review_seed_user_gilas154_011','09154011','حسن یوسفی'),
('review_seed_user_gilas154_012','09154012','مهدی کریمی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas154_001','review_seed_user_gilas154_001',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'معرق مس قشنگیه. ای کاش مدل بزرگترش رو سفارش می‌دادم.',0,'1405-05-23T00:00:00.000Z'),
('review_seed_gilas154_002','review_seed_user_gilas154_002',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',0,'1401-08-14T00:00:00.000Z'),
('review_seed_gilas154_003','review_seed_user_gilas154_003',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'1404-12-26T00:00:00.000Z'),
('review_seed_gilas154_004','review_seed_user_gilas154_004',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'قاب PVC خیلی مقاوم به نظر میاد و رنگش ثابت مونده.',0,'1395-06-30T00:00:00.000Z'),
('review_seed_gilas154_005','review_seed_user_gilas154_005',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'1400-04-01T00:00:00.000Z'),
('review_seed_gilas154_006','review_seed_user_gilas154_006',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1396-01-01T00:00:00.000Z'),
('review_seed_gilas154_007','review_seed_user_gilas154_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'از وقتی نصبش کردم فضای خونه‌مون خیلی هنری‌تر شده.',0,'1399-06-28T00:00:00.000Z'),
('review_seed_gilas154_008','review_seed_user_gilas154_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'از نزدیک که دیدم کیفیتش چند برابر عکس‌هاست. قاب قهوه‌ای سوخته خیلی گرمه.',0,'1394-12-01T00:00:00.000Z'),
('review_seed_gilas154_009','review_seed_user_gilas154_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.',0,'1402-01-25T00:00:00.000Z'),
('review_seed_gilas154_010','review_seed_user_gilas154_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'چرا قیمت اینقدر بالاست؟ زمان برش دستی این تابلوها چقدره؟',0,'1398-06-05T00:00:00.000Z'),
('review_seed_gilas154_011','review_seed_user_gilas154_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'خیلی زیباست. منتظر تخفیف‌های بعدی‌تون هستم.',0,'1403-02-18T00:00:00.000Z'),
('review_seed_gilas154_012','review_seed_user_gilas154_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas154')),5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',0,'1403-11-14T00:00:00.000Z');
