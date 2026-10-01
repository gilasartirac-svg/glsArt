-- GilasArt customer points, referrals and user-bound reward coupons.
CREATE TABLE IF NOT EXISTS loyalty_points (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  points INTEGER NOT NULL CHECK(points<>0),
  event_type TEXT NOT NULL,
  reference_type TEXT,
  reference_id TEXT,
  description TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id,event_type,reference_type,reference_id)
);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_user_created ON loyalty_points(user_id,created_at DESC);

CREATE TABLE IF NOT EXISTS referral_codes (
  user_id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS referrals (
  id TEXT PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL UNIQUE,
  referral_code TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(referred_user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);

ALTER TABLE otp_challenges ADD COLUMN referral_code TEXT;

ALTER TABLE coupons ADD COLUMN user_id TEXT;
ALTER TABLE coupons ADD COLUMN source TEXT;
ALTER TABLE coupons ADD COLUMN points_cost INTEGER;
CREATE INDEX IF NOT EXISTS idx_coupons_user_active ON coupons(user_id,active,expires_at);

-- Seed FAQ/rules copy once; existing CMS/rules content is preserved.
INSERT OR IGNORE INTO site_settings(key,value) VALUES
('loyalty_rules_title','باشگاه امتیاز گیلاس آرت'),
('loyalty_rules_body','با هر فعالیت مفید در گیلاس آرت امتیاز بگیرید و امتیازها را به کوپن تخفیف یک‌بارمصرف تبدیل کنید. قوانین تبدیل: ۱۰۰ امتیاز = ۵٪، ۲۰۰ امتیاز = ۱۰٪، ۳۰۰ امتیاز = ۱۵٪، ۴۰۰ امتیاز = ۲۰٪ تخفیف. کوپن‌های باشگاه فقط برای همان کاربری که آن را ساخته معتبرند، یک‌بار قابل استفاده‌اند و ۳۰ روز پس از صدور منقضی می‌شوند. مجموع تخفیف اعمال‌شده توسط کوپن باشگاه در هر سفارش بیش از ۲۰٪ قیمت کالاها نخواهد شد.');
