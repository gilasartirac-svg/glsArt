-- Seed 12 owner-supplied demo reviews for product #117 (gilas117).
INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('review_seed_user_733','09000000733','فاطمه زهرا حسینی'),
('review_seed_user_734','09000000734','خدیجه رحمانی'),
('review_seed_user_735','09000000735','پیمان حسنی'),
('review_seed_user_736','09000000736','فرهاد ابراهیمی'),
('review_seed_user_737','09000000737','علی طباطبایی'),
('review_seed_user_738','09000000738','آریا کاظمی'),
('review_seed_user_739','09000000739','فریدون رضایی'),
('review_seed_user_740','09000000740','آرش امینی'),
('review_seed_user_741','09000000741','حسن درویشی'),
('review_seed_user_742','09000000742','آوا فرهادی'),
('review_seed_user_743','09000000743','داریوش مقدم'),
('review_seed_user_744','09000000744','طاهره حسینی');
INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,comment,approved,created_at) VALUES
('review_seed_gilas117_001','review_seed_user_733',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟',0,'14 فروردین 1400T00:00:00.000Z'),
('review_seed_gilas117_002','review_seed_user_734',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'این تابلو دکوراسیون خونه‌مون رو کامل کرد. خیلی راضی هستم از خرید.',0,'6 آذر 1394T00:00:00.000Z'),
('review_seed_gilas117_003','review_seed_user_735',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'معرق مس دست‌ساز با این کیفیت کمتر پیدا می‌شه. دست مریزاد.',0,'9 شهریور 1404T00:00:00.000Z'),
('review_seed_gilas117_004','review_seed_user_736',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'برش دستی و دقیق، بدون هیچ ایرادی. کار تمیز و حرفه‌ای.',0,'31 شهریور 1396T00:00:00.000Z'),
('review_seed_gilas117_005','review_seed_user_737',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',0,'18 فروردین 1399T00:00:00.000Z'),
('review_seed_gilas117_006','review_seed_user_738',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'این کار دست‌ساز ارزش هنری بالایی داره. خیلی خوشحالم از خرید.',0,'16 مرداد 1396T00:00:00.000Z'),
('review_seed_gilas117_007','review_seed_user_739',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',0,'5 اردیبهشت 1405T00:00:00.000Z'),
('review_seed_gilas117_008','review_seed_user_740',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'قیمتش کمی بالاست. برش دستی چقدر زمان می‌بره که این قیمت درمیاد؟',0,'25 آذر 1402T00:00:00.000Z'),
('review_seed_gilas117_009','review_seed_user_741',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'تابلو سبک و نصبش آسونه. کیفیت ساختش عالیه.',0,'3 اسفند 1394T00:00:00.000Z'),
('review_seed_gilas117_010','review_seed_user_742',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'کیفیت خوبه اما ارسال کمی دیر شد. ای کاش زودتر می‌فرستادین.',0,'3 شهریور 1404T00:00:00.000Z'),
('review_seed_gilas117_011','review_seed_user_743',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.',0,'7 تیر 1396T00:00:00.000Z'),
('review_seed_gilas117_012','review_seed_user_744',(SELECT id FROM products WHERE lower(sku)=lower('gilas117')),5,'تابلوی معرق مس بهترین انتخاب برای هدیه بود. گیرنده خیلی خوشحال شد.',0,'18 مهر 1404T00:00:00.000Z');
