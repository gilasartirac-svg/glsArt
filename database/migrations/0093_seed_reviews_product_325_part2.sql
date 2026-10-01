-- Product 325 review seed part 2
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_007','نسیم کریمی','093325007');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_007',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_007',5,'معرق مس با قاب طلایی گلدارش مثل جواهر روی دیوار می‌مونه.',0,'1 مرداد 1393');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_008','مریم سادات زمانی','093325008');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_008',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_008',5,'تابلو زیباست ولی تأخیر در ارسال کمی ناراحت‌کننده بود.',0,'13 بهمن 1394');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_009','امیرحسین صادقی','093325009');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_009',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_009',5,'معرق مس با قاب طلایی گلدارش مثل یک اثر هنری واقعی می‌مونه. عالی بود.',0,'14 خرداد 1400');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_010','حسن یوسفی','093325010');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_010',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_010',5,'از خرید این معرق مس پشیمون نشدم. ارزش هر ریالی که دادم رو داره.',0,'21 فروردین 1394');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_011','مریم سلطانی','093325011');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_011',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_011',5,'قاب قهوه‌ای سوخته با طرح معرق مس ترکیب بی‌نظیری شده. ممنون از کارتون.',0,'5 اسفند 1397');
INSERT OR IGNORE INTO users (id,name,phone) VALUES ('review_seed_user_gilas325_012','محمد سلیمانی','093325012');
INSERT OR IGNORE INTO reviews (id,product_id,user_id,rating,comment,approved,created_at) VALUES ('review_seed_gilas325_012',(SELECT id FROM products WHERE lower(sku)=lower('gilas325')),'review_seed_user_gilas325_012',5,'رنگ قاب قهوه‌ای سوخته گرم و دلنشینه. با دکوراسیون چوبی عالی می‌شه.',0,'30 اردیبهشت 1400');
