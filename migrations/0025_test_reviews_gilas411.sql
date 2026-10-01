-- Test reviews for product #1 (Gilas411)
-- These are explicit demo/test records supplied by the project owner.
-- Each reviewer has a dedicated test user so the existing review schema and
-- admin/customer joins remain intact without requiring real customers.

INSERT OR IGNORE INTO users(id,mobile,name) VALUES
('test_review_user_001','09000000001','فریدون ملکی'),
('test_review_user_002','09000000002','آوا محمودی'),
('test_review_user_003','09000000003','بهار محمودی'),
('test_review_user_004','09000000004','یوسف قاسمی'),
('test_review_user_005','09000000005','آتنا صالحی'),
('test_review_user_006','09000000006','طاهره رضایی'),
('test_review_user_007','09000000007','مجید بهرامی'),
('test_review_user_008','09000000008','فرشته خسروی'),
('test_review_user_009','09000000009','آوا میرزایی'),
('test_review_user_010','09000000010','محمود نیکوکار'),
('test_review_user_011','09000000011','شایان ابراهیمی'),
('test_review_user_012','09000000012','لیلا خسروی');

INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,body,approved,created_at) VALUES
('test_review_gilas411_001','test_review_user_001','Gilas411',5,'کیفیت ساخت و ظرافت برش واقعاً قابل تقدیره. پیشنهاد ویژه.',1,'2025-04-22T00:00:00.000Z'),
('test_review_gilas411_002','test_review_user_002','Gilas411',5,'قاب مشکی مات با درخشش مس ترکیب مدرنی ساخته. عاشقش شدم.',1,'2016-08-26T00:00:00.000Z'),
('test_review_gilas411_003','test_review_user_003','Gilas411',5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',1,'2024-11-21T00:00:00.000Z'),
('test_review_gilas411_004','test_review_user_004','Gilas411',5,'از خرید این اثر هنری دست‌ساز خیلی راضی‌ام. ممنون.',1,'2020-07-31T00:00:00.000Z'),
('test_review_gilas411_005','test_review_user_005','Gilas411',5,'معرق مس با طرح‌های زیبا و قاب طلایی گلدارش دکوراسیون رو متحول کرد.',1,'2014-04-18T00:00:00.000Z'),
('test_review_gilas411_006','test_review_user_006','Gilas411',5,'تابلو خیلی سبک و محکمه. قابش هم کاملاً فیت شده.',1,'2020-11-24T00:00:00.000Z'),
('test_review_gilas411_007','test_review_user_007','Gilas411',5,'برش‌های دقیق و تمیز، قاب محکم و زیبا. واقعاً ارزش خرید داره.',1,'2024-09-18T00:00:00.000Z'),
('test_review_gilas411_008','test_review_user_008','Gilas411',5,'دست‌ساز بودنش کاملاً مشخصه. هر قطعه مس با دقت برش خورده.',1,'2024-10-29T00:00:00.000Z'),
('test_review_gilas411_009','test_review_user_009','Gilas411',5,'برش‌ها تمیز و بدون پلیسه. کیفیت کار حرفه‌ای است.',1,'2025-06-16T00:00:00.000Z'),
('test_review_gilas411_010','test_review_user_010','Gilas411',5,'رنگ طلایی گلدار قاب با درخشش مس هماهنگی بی‌نظیری داره.',1,'2017-11-24T00:00:00.000Z'),
('test_review_gilas411_011','test_review_user_011','Gilas411',5,'ترکیب مس و قاب قهوه‌ای سوخته حس سنتی زیبایی می‌ده.',1,'2015-07-01T00:00:00.000Z'),
('test_review_gilas411_012','test_review_user_012','Gilas411',5,'از وقتی این تابلو رو خریدم همه مهمون‌ها تعریف می‌کنن. معرق مس دست‌ساز عالیه.',1,'2014-04-03T00:00:00.000Z');
