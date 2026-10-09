---

## 1. هدف و وضعیت پروژه

GilasArt یک گالری و فروشگاه آنلاین آثار هنری با معماری Serverless است. پروژه فقط یک Storefront ساده نیست و این لایه‌ها را در یک معماری واحد دارد:

- وب‌سایت عمومی و چندزبانه
- Home و Landing Gallery
- فروشگاه و کاتالوگ آثار
- جستجو، فیلتر و مرتب‌سازی
- صفحه جزئیات محصول
- ویژگی و گزینه اختصاصی هر محصول
- سبد خرید
- تخفیف تعدادی
- Coupon و Discount
- ثبت سفارش
- پرداخت چندروشی
- فاکتور
- پرداخت کارت‌به‌کارت و بررسی فیش
- حساب کاربری
- آدرس و اطلاعات تحویل
- علاقه‌مندی
- Reviews و Like/Dislike
- باشگاه امتیاز
- Referral
- Notification
- پشتیبانی و Ticket/CRM
- FAQ
- CMS برای About، Contact، News و Articles
- کنترل پنل کامل مدیریت
- مدیریت محصول، ویژگی، گزینه، دسته‌بندی و موجودی
- مدیریت سفارش و پرداخت
- RBAC و Permission Matrix
- Audit Log
- Reports
- Visitor Analytics
- SEO
- PWA و Service Worker
- Public Storefront Snapshot برای کاهش مصرف D1
- CI/CD و Quality/Security Gates

اصل معماری:

    Frontend
        |
        v
    Cloudflare Worker
        |
        v
    Cloudflare D1

سرویس‌های حساس مانند Kavenegar و درگاه‌های پرداخت فقط از سمت Worker مصرف می‌شوند.

---

## 2. ساختار Repository

    /
    ├── .github/workflows/
    │   ├── cloudflare-usage-guard.yml
    │   ├── pages.yml
    │   ├── production-quality-gate.yml
    │   ├── security-tests.yml
    │   ├── storefront-snapshot.yml
    │   └── worker-deploy.yml
    │
    ├── database/
    │   ├── migrations/
    │   └── seed/
    │
    ├── docs/
    │   ├── DEPLOYMENT.md
    │   └── SECURITY.md
    │
    ├── frontend/
    │   ├── public/
    │   └── src/
    │       ├── app.js
    │       ├── index.html
    │       ├── styles.css
    │       ├── invoice.js
    │       ├── shop/
    │       └── admin/
    │           ├── AdminApp.js
    │           ├── router.js
    │           ├── components/
    │           ├── pages/
    │           └── services/
    │
    ├── scripts/
    │   └── build-frontend.mjs
    ├── tests/
    ├── worker/src/index.js
    ├── package.json
    ├── wrangler.toml
    ├── CNAME
    ├── 404.html
    └── README.md

---

## 3. معماری Production

    User / Web / PWA
          |
          v
    GitHub Pages / Frontend
          |
          | HTTPS API
          v
    Cloudflare Worker
    api.gilasart.ir
          |
          +----> Cloudflare D1
          |
          +----> Kavenegar
          |
          +----> ZarinPal
          |
          +----> NovinoPay

Frontend منبع حقیقت موارد حساس نیست. قیمت نهایی، SKU، موجودی، اقلام سفارش، تخفیف، وضعیت پرداخت، دسترسی و گزینه‌های معتبر محصول باید توسط Backend تعیین شوند.

---

## 4. Frontend Routing

Router اصلی در frontend/src/app.js قرار دارد.

مسیرهای اصلی:

| Route | کاربرد |
|---|---|
| / | صفحه اصلی |
| /shop | فروشگاه |
| /product/<slug> | جزئیات اثر |
| /cart | سبد خرید و ثبت سفارش |
| /account | حساب کاربری |
| /rewards | باشگاه امتیاز |
| /checkout | مسیر checkout فعلی |
| /about | درباره ما |
| /contact | تماس |
| /news | اخبار |
| /news/<slug> | خبر |
| /articles | مقالات |
| /articles/<slug> | مقاله |
| /terms | قوانین |
| /support | پشتیبانی |
| /support/<id> | جزئیات تیکت |
| /payment/manual?order=<id> | کارت‌به‌کارت |
| /payment/success?order=<id> | پرداخت موفق |
| /admin/... | کنترل پنل |

Localeهای رسمی:

- fa
- en
- tr
- ar

برای Locale از path، Cookie ترجیح کاربر و فقط در نبود Cookie از تشخیص محافظه‌کارانه Worker با کشور Cloudflare و Accept-Language استفاده می‌شود. **localStorage منبع ترجیح زبان نیست.** Canonical، hreflang و x-default نیز مدیریت می‌شوند.

Legacy hash route مانند #/shop به مسیر واقعی منتقل می‌شود.

---

## 5. Home

Home از Public Storefront Snapshot استفاده می‌کند تا درخواست‌های غیرضروری به D1 کاهش پیدا کند.

اجزای اصلی:

- Hero Gallery
- اثر منتخب
- معرفی گالری
- مجموعه‌ها و دسته‌بندی‌ها
- Flash Sale
- آخرین آثار
- معرفی هنرکده گیلاس آرت
- CTA فروشگاه و درباره ما
- SEO و Open Graph
- تصویر اثر منتخب

اگر داده Dynamic کامل در دسترس نباشد، صفحه نباید وانمود کند که اطلاعات کامل فروشگاه را دارد.

---

## 6. Shop

Shop یک کاتالوگ کم‌مصرف و Snapshot-based است.

قابلیت‌ها:

### جستجو
بر اساس نام، توضیحات، SKU و داده‌های SEO.

### فیلتر دسته‌بندی
انتخاب یک یا چند دسته.

### فیلتر قیمت
حداقل، حداکثر، Slider و ورودی عددی.

### فیلتر امتیاز
- همه
- 4 ستاره و بیشتر
- 3 ستاره و بیشتر
- 2 ستاره و بیشتر

### Sort
- جدیدترین آثار
- پیشنهاد خریداران
- پرفروش‌ترین
- محبوب‌ترین
- بیشترین امتیاز
- بیشترین نظر
- ارزان‌ترین
- گران‌ترین

### Loading
- صفحه‌بندی تدریجی
- Infinite Scroll
- دکمه نمایش آثار بیشتر
- جلوگیری از بارگذاری همه محصولات در اولین Render

Filter state در Query String نگهداری می‌شود تا Refresh و Back/Forward رفتار قابل پیش‌بینی داشته باشند.

---

## 7. Product Detail

مسیر /product/<slug> عمداً به Backend اصلی متصل است.

Product Detail نباید برای اطلاعات حساس یا گزینه‌های اختصاصی از Snapshot ناقص fallback بگیرد.

اطلاعات:

- نام
- SKU
- قیمت پایه
- تصویر اصلی
- گالری
- توضیحات
- دسته‌ها
- ویدئو
- ویژگی‌ها
- گزینه‌ها
- قیمت تغییر گزینه
- گزینه پیش‌فرض
- موجودی
- Reviews
- Like/Dislike
- quantity discount

### Product Attributes

مدل:

    Attribute
       |
       +-- Global Options
       |
       +-- Product Assignment
              |
              +-- Product-specific Overrides

ویژگی‌های فعلی مهم:

- ابعاد
- رنگ قاب

اگر یک Product برای یک Attribute تنظیم اختصاصی داشته باشد، گزینه‌های Global آن Attribute نباید به آن Product نشت کنند.

### قیمت

    Final Price =
    Base Price
    + Selected Option Delta
    - Default Option Delta

Delta منفی معتبر است و نباید بدون دلیل Clamp شود.

گزینه انتخاب‌شده باید تا Cart و تغییر تعداد حفظ شود.

---

## 8. Product Option Examples

نمونه قرارداد فعلی:

### Gilas411

ابعاد:
- 30x30 = +0، پیش‌فرض
- 70x70 = +80,000,000 ریال

رنگ قاب:
- مشکی = +0، پیش‌فرض
- طلایی گلدار = +8,500,000 ریال
- سفید = +5,500,000 ریال

### Gilas020

ابعاد:
- 80x40 = +0، پیش‌فرض
- 110x60 = +85,000,000 ریال

رنگ قاب:
- مشکی = +0، پیش‌فرض
- طلایی گلدار = +10,500,000 ریال
- سفید = +5,500,000 ریال
- قهوه‌ای تنه درختی = +6,500,000 ریال

این موارد در Production Quality Gate نیز Regression Check دارند.

---

## 9. Reviews

قابلیت‌ها:

- نمایش Reviewهای تأییدشده
- امتیاز 1 تا 5
- نام و تاریخ
- Like
- Dislike
- شمارش واکنش‌ها
- Moderation در Admin

هر کاربر برای هر Review یک Reaction یکتا دارد.

Review جدید ابتدا در جریان moderation قرار می‌گیرد.

---

## 10. Favorites

کاربر واردشده می‌تواند اثر را:

- اضافه به علاقه‌مندی کند
- حذف کند
- در حساب مشاهده کند

این رویداد در Loyalty نیز می‌تواند امتیاز ایجاد کند.

---

## 11. Authentication

Authentication فعلی:

    SMS OTP
        |
        v
    hashed OTP challenge
        |
        v
    D1-backed opaque session
        |
        v
    HttpOnly/Secure cookie

این معماری JWT نیست.

### Request OTP

POST /api/auth/request-otp

- Validate mobile
- Rate limit روی mobile
- Rate limit روی IP
- crypto.getRandomValues
- SHA-256 + OTP_PEPPER
- ثبت challenge در D1
- ارسال SMS از Kavenegar

### Verify OTP

POST /api/auth/verify-otp

- بررسی challenge
- بررسی expiration
- حداکثر 5 تلاش
- hash کردن OTP ورودی
- مقایسه hash
- ایجاد/یافتن User
- ایجاد Session

Session cookie:

    __Host-gs_session

CSRF:

    gs_csrf

Mutationهای authenticated باید CSRF معتبر داشته باشند.

---

## 12. Session Hydration

Frontend قبل از Render مسیرها /api/me را hydrate می‌کند.

اطلاعات Session:

- user
- roles
- permissions
- csrfToken
- session expiration

این کار باعث می‌شود Home، Shop، Product، Account و Admin در تشخیص User و Admin state رفتار یکسان داشته باشند.

Session ID در localStorage به‌عنوان bearer token ذخیره نمی‌شود.

---

## 13. RBAC / Authorization

Admin بر اساس Role و Permission کنترل می‌شود.

ساختار:

    User
      |
    admin_users
      |
    admin_roles
      |
    role_permissions
      |
    permissions

نمونه Permissionها:

- products.read
- products.write
- orders.read
- orders.write
- users.manage
- roles.manage
- reviews.read
- reviews.write
- reports.read
- settings.read
- settings.write
- support.read

ورود به /api/admin/* نیازمند Authentication و Permission است. UI فقط نمایش‌دهنده مجوز است و Backend همیشه باید Authorization را enforce کند.

---

## 14. Admin Pages

کنترل پنل فعلی شامل:

| صفحه | قابلیت |
|---|---|
| Dashboard | فروش، سفارش‌های اخیر، موجودی کم، وضعیت |
| Products | محصول، تصویر، SEO، ویژگی و گزینه |
| Categories | دسته‌بندی |
| Orders | سفارش، اقلام، وضعیت، فیش |
| Site Rules | قوانین |
| Customers | مشتری |
| Inventory | موجودی |
| Payments | پرداخت‌ها |
| Discounts | تخفیف |
| Coupons | کوپن |
| Reviews | moderation |
| Reports | گزارش‌ها |
| Access Control | سطح دسترسی |
| Audit | لاگ |
| Settings | SEO و تنظیمات |
| Invoice Settings | Seller و Invoice |
| SMS | سیستم پیامکی |
| Payment | درگاه‌ها |
| Visitors | بازدیدکنندگان |
| Storefront Snapshot | Snapshot |
| Support | Ticket/CRM و FAQ |
| About | درباره ما |
| Contact | تماس |
| News | اخبار |
| Articles | مقالات |

---

## 15. Admin Products

Products یکی از حساس‌ترین بخش‌های Admin است.

قابلیت‌ها:

- ایجاد
- ویرایش
- فعال/غیرفعال
- Slug
- SKU
- نام
- توضیحات
- قیمت
- موجودی
- تصویر
- Alt Text
- SEO title
- SEO description
- Video URL
- Flash Sale
- پایان Flash Sale
- قیمت Flash Sale
- دسته‌بندی
- انتخاب Attribute
- تنظیم Option Override
- Default Option
- Price Delta
- Media Picker
- Catalog data

APIهای مرتبط:

    /api/admin/products
    /api/admin/products/<id>
    /api/admin/products/<id>/attribute-options
    /api/admin/product-attributes
    /api/admin/product-attributes/<id>
    /api/admin/product-attributes/<id>/options
    /api/admin/product-attribute-options/<id>
    /api/admin/media-images

---

## 16. Categories

Admin می‌تواند:

- مشاهده
- ایجاد
- ویرایش
- فعال/غیرفعال
- تغییر slug
- توضیحات
- حذف در صورت نداشتن محصول وابسته

---

## 17. Inventory

Inventory در D1 نگهداری می‌شود.

قابلیت Admin:

- مشاهده موجودی
- تغییر موجودی
- بررسی کمبود
- پشتیبانی از Reservation

موجودی Frontend منبع حقیقت نیست.

---

## 18. Cart

Cart برای User در Backend نگهداری می‌شود.

قابلیت‌ها:

- Add
- Remove
- Quantity +/-
- نمایش Product Options
- Unit Price
- Line Total
- Quantity Discount
- Coupon
- Shipping
- Grand Total
- Address
- Payment Method

قیمت نهایی باید Server-authoritative باشد.

---

## 19. Discounts / Coupons

Discount و Coupon دو مفهوم جدا هستند.

Discount:
- قوانین تخفیف فروش

Coupon:
- کد قابل ورود
- درصدی یا مبلغ ثابت
- فعال/غیرفعال
- تاریخ انقضا
- محدودیت User
- یک‌بار مصرف
- پشتیبانی از Couponهای Loyalty

---

## 20. Loyalty / Rewards

Migration اصلی Loyalty:

    141_loyalty_points.sql

فعالیت‌های امتیازی:

- ثبت‌نام: 10
- Review تأییدشده: 5
- معرفی دوست پس از ثبت‌نام او: 30
- تکمیل اطلاعات ارسال: 5
- افزودن به علاقه‌مندی: 3
- خرید موفق: طبق مقدار خرید و سقف تعریف‌شده

تبدیل:

- 100 امتیاز = 5%
- 200 امتیاز = 10%
- 300 امتیاز = 15%
- 400 امتیاز = 20%

Coupon باشگاه User-bound، یک‌بار مصرف و دارای expiration است.

---

## 21. Referral

هر User می‌تواند Referral Code داشته باشد.

جریان:

    User A
      |
      | referral code
      v
    User B registers
      |
      +--> signup reward
      |
      +--> referral reward for A

رویداد Referral می‌تواند Notification نیز ایجاد کند.

---

## 22. Notifications

کاربر واردشده Notificationهای خوانده‌نشده را دریافت می‌کند.

Frontend Polling دارد.

مواردی مانند Referral Reward و رویدادهای حساب/پشتیبانی می‌توانند Notification ایجاد کنند.

Read با API و CSRF کنترل می‌شود.

---

## 23. Support / CRM

Public:

    /support

Admin:

    /admin/support

قابلیت‌ها:

- Ticket
- Subject
- Category
- Priority
- Status
- Stage
- Message Thread
- پاسخ Admin
- بستن/مدیریت Ticket
- FAQ
- SMS Template برای ایجاد Ticket
- SMS Template برای پاسخ

---

## 24. CMS

CMS برای:

- About
- Contact
- News
- Articles

داده‌هایی مانند:

- title
- slug
- summary
- body
- cover_image
- phone
- mobile
- address
- map_url
- active
- published_at
- sort_order

را مدیریت می‌کند.

Admin Cover Picker از Media Repository تصویر واقعی انتخاب می‌کند.

---

## 25. Payment Architecture

فقط یک معماری Order/Payment/Invoice وجود دارد.

Providerها:

1. ZarinPal
2. NovinoPay
3. Card Transfer

اصل مهم:

Callback به‌تنهایی موفقیت پرداخت نیست.

فقط Server-side Verify باید Payment را Paid کند.

---

## 26. Card Transfer

جریان:

    Create Order
       |
    Payment Method: Card Transfer
       |
    User transfers money
       |
    Upload receipt
       |
    Admin Review
       |
    Approve / Reject

وضعیت‌ها:

- PENDING_REVIEW
- APPROVED
- REJECTED

در Reject دلیل رد می‌تواند به کاربر نمایش داده شود.

تصویر فیش در Frontend به حدود 150KB فشرده می‌شود.

---

## 27. Orders / Payments / Invoice

موجودیت‌های اصلی:

    orders
      |
      +-- order_items
      +-- payments
      +-- payment_attempts
      +-- order_status_history
      +-- invoice tracking
      +-- card transfer receipt

Idempotency برای جلوگیری از Order/Payment تکراری و Replay مهم است.

Invoice از Assets رسمی زیر استفاده می‌کند:

    frontend/public/invoice/logo.svg
    frontend/public/invoice/stamp-signature.png

Admin می‌تواند Seller Identity و Invoice Settings را مدیریت کند.

---

## 28. Catalog Metrics

Product metricهای materialized:

- view_count
- review_count
- rating_avg
- favorite_count
- sold_count

Migrationهای مرتبط Triggerهایی برای Review، Favorite، Order و Order Item دارند.

این metricها برای Sort حرفه‌ای Shop استفاده می‌شوند.

---

## 29. Visitor Analytics

Frontend برای Visitor Session یک شناسه تصادفی محلی ایجاد می‌کند.

Heartbeat:

    POST /api/visitors/heartbeat

Admin:

    /admin/visitors

گزارش‌ها شامل Online Visitors و Visitor Reports است.

اطلاعات حساس Visitor نباید وارد Public Snapshot شود.

---

## 30. Public Storefront Snapshot

فایل‌های اصلی:

    frontend/public/data/home.json
    frontend/public/data/storefront-index.json
    frontend/public/data/storefront-manifest.json

Snapshot سبک برای کاهش D1 Reads؛ فهرست محصولات و داده خانه جدا شده‌اند و جزئیات محصول از API خوانده می‌شود:

- Product Catalog
- Categories
- Public Settings
- FAQ
- News
- Articles
- Reviews طبق Snapshot
- Flash Sales

را در اختیار Frontend قرار می‌دهد.

### هرگز نباید در Snapshot عمومی قرار گیرد

- Secret
- Admin Bootstrap
- Kavenegar credential
- Payment credential
- Session
- National ID
- Postal/private account data
- اطلاعات خصوصی فاکتور

Product Detail به‌صورت عمدی از Snapshot fallback نمی‌گیرد، چون ویژگی و قیمت‌گذاری اختصاصی باید از Backend اصلی خوانده شود.

---

## 31. Service Worker / PWA

Assets:

    frontend/public/sw.js
    frontend/public/site.webmanifest
    frontend/public/mobile-release.json

قابلیت‌ها:

- PWA standalone
- cache shell
- network refresh
- versioned cache
- حذف cache قدیمی
- Mobile Release Check
- Update prompt برای نسخه جدید Android/iOS

هر تغییر مهم Frontend باید Cache Version را نیز بررسی کند.

---

## 32. Mobile UX

هدف:

    320
    360
    375
    390
    414
    768
    1024
    Desktop

قابلیت‌ها:

- Mobile-first
- RTL
- Hamburger Menu
- Admin Mobile Drawer
- Touch-friendly UI
- Day/Night Theme
- App-like layout
- کنترل interaction طبق سیاست فعلی پروژه

---

## 33. Design System

جهت طراحی:

**Luxury Iranian Art Gallery**

اصول:

- RTL-first
- Mobile-first
- اثر هنری در مرکز توجه
- Deep Navy / Charcoal
- Warm Cream
- Warm Gold / Brass
- Copper / Terracotta
- Warm Gray
- Arabesque / Islamic accents
- پنل‌های حرفه‌ای
- بدون 3D افراطی
- عدم تغییر بی‌دلیل Font
- تصویر واقعی اثر

### Day / Night Theme Contract

پالت روز و شب فقط در بلوک‌های اصلی Theme Tokens در `frontend/src/styles.css` تعریف می‌شود؛ breakpointهای Desktop، Tablet و Mobile مجاز به تعریف دوباره رنگ‌های اصلی نیستند.

**تم روز (Light):**
- Background: `#f5f2ec`
- Surface: `#fffdfa`
- Secondary surface: `#f0ece4`
- Primary text: `#202020`
- Muted text: `#6d685f`
- Gold / brass: `#805f20`
- Strong gold: `#76551e`
- Copper: `#965222`
- Warning: `#8a570d`
- متن دکمه طلایی: `#fffdfa`

**تم شب (Dark):**
- Background: `#0b0d11`
- Surface: `#12161d`
- Secondary surface: `#181e27`
- Raised surface: `#222a35`
- Primary text: `#f4f1ea`
- Muted text: `#a9a69f`
- Gold / brass: `#d9a441`
- Strong gold: `#f0cf86`
- Copper: `#c27643`
- متن روی دکمه طلایی: `#16130d`

**قرارداد واکنش‌گرایی:**
- Desktop: عرض `1024px` به بالا
- Tablet: `768px` تا `1023px`
- Mobile: تا `767px`؛ عرض‌های بسیار کوچک `320–359px` نیز پوشش داده می‌شوند.
- رنگ‌های معنایی در هر سه گروه یکسان‌اند؛ فقط چیدمان، فاصله‌ها، اندازه کنترل‌ها و تراکم محتوا تغییر می‌کند.
- رنگ متن‌های معمولیِ Gold، Copper، Warning و Muted در تم روز باید نسبت کنتراست WCAG AA حداقل `4.5:1` روی سطوح اصلی را حفظ کند.
- تنها یک `meta[name="theme-color"]` وجود دارد و رنگ نوار مرورگر باید با تم انتخاب‌شده همگام باشد. در نبود انتخاب ذخیره‌شده، تم سیستم‌عامل در اولین نمایش رعایت می‌شود.
- تست‌های معماری CSS باید از تکرار پالت تم و افت کنتراست جلوگیری کنند.

---

## 34. SEO

قابلیت‌ها:

- Dynamic Title
- Meta Description
- Open Graph
- Canonical
- hreflang
- x-default
- Product SEO
- CMS SEO
- Sitemap
- robots.txt
- JSON-LD
- Cover Image

Assets:

    frontend/public/robots.txt
    frontend/public/sitemap.xml

---

## 35. Security

اصول امنیتی:

- HTTPS
- محدودیت CORS
- Security Headers
- CSP
- HttpOnly Session
- Secure Cookie
- CSRF
- OTP Rate Limit
- OTP Hash + Pepper
- RBAC
- Permission enforcement
- Audit Log
- Server-authoritative price
- Server-authoritative inventory
- Server-side payment verification
- Idempotency
- Public Snapshot isolation
- Image/Video URL validation
- Parameterized SQL
- عمومی‌سازی Internal Error
- تشخیص D1 service limit

Secretها فقط در Worker/Cloudflare/GitHub Secrets قرار می‌گیرند.

---

## 36. Audit Log

Mutationهای حساس Admin مانند موارد زیر Audit می‌شوند:

- Product
- Category
- Discount
- Coupon
- Review moderation
- Role assignment/revocation
- Admin status
- Order
- Payment Receipt
- Settings
- سایر عملیات حساس

---

## 37. Database

Schema به‌صورت Migration-based تکامل یافته است.

موجودیت‌های مهم:

    users
    sessions
    otp_challenges

    roles
    user_roles
    permissions
    admin_roles
    admin_users
    role_permissions

    categories
    products
    product_images
    product_category_assignments
    inventory

    product_attributes
    product_attribute_options
    product_attribute_assignments
    product_attribute_option_overrides

    carts
    cart_items

    orders
    order_items
    order_status_history
    payments
    payment_attempts

    addresses
    favorites
    reviews
    review_reactions

    coupons
    coupon_usages
    discounts

    loyalty_points
    referral_codes
    referrals
    user_notifications

    support_tickets
    ticket_messages
    faq_entries

    cms_entries
    site_settings

    visitor_sessions
    audit_logs

Migrationهای پروژه علاوه بر Core Schema، قابلیت‌های Flash Sale، Invoice، Seller Identity، Social Links، SEO، Product Video/Grid، Review Indexing، Card Transfer، Multi-payment، Stock Reservation، Loyalty، Catalog Metrics و Support SMS را نیز پوشش می‌دهند.

---

## 38. Social Links

Footer Social Links از Settings کنترل می‌شوند.

Assets:

    frontend/public/assets/social/

شامل:

- Telegram
- Instagram
- Aparat
- WhatsApp
- YouTube
- LinkedIn
- Other

---

## 39. Media

Admin Media Picker:

    /api/admin/media-images

برای Product و CMS Cover استفاده می‌شود.

Worker مسیرهای تصویر را Validate می‌کند.

---

## 40. Service Status / D1 Limit

فایل:

    frontend/public/service-status.json

در Deployment Gate استفاده می‌شود.

اگر D1/Cloudflare موقتاً محدود باشد:

- Dynamic UI نباید وانمود کند کامل است.
- Public Catalog در صورت معتبر بودن Snapshot می‌تواند کار کند.
- Product Detail نباید با Optionهای ناقص Render شود.
- پیام Customer-facing باید انسانی باشد.
- متن فنی D1 quota نباید مستقیماً به مشتری نمایش داده شود.
- Deployment ناقص نباید Success تلقی شود.

Worker خطاهای شناخته‌شده D1 Free Tier را به service-limit تبدیل می‌کند.

---

## 41. CI/CD

### Pages

.github/workflows/pages.yml

موارد اصلی:

1. Checkout
2. Node setup
3. npm ci
4. npm check
5. Syntax check
6. Tests
7. Deployment Gate
8. Live API Health
9. Build
10. Upload Artifact
11. Deploy Pages
12. Production route verification
13. Homepage image verification
14. 404 verification

### Worker + D1

.github/workflows/worker-deploy.yml

- Credentials
- Migration reconciliation
- D1 migration apply
- Bootstrap secret sync در صورت وجود
- Worker deploy

### Production Quality Gate

.github/workflows/production-quality-gate.yml

بررسی می‌کند:

- Frontend syntax
- Worker syntax
- PWA
- Service status
- Worker deployment
- API health
- Home API
- Products API
- Categories
- Flash Sales
- Settings
- Storefront Snapshot
- CORS
- Product Attribute regression

### Security Regression

.github/workflows/security-tests.yml

    npm run check
    node --test tests/*.test.mjs

### Snapshot

Workflow مستقل برای تولید/به‌روزرسانی Public Storefront Snapshot وجود دارد.

### Usage Guard

Workflow مستقل برای کنترل Cloudflare/D1 usage وجود دارد.

---

## 42. Test Commands

    npm ci
    npm run check
    npm test
    npm run build

Scripts:

    check
      node --check worker/src/index.js
      node --check scripts/build-frontend.mjs

    test
      node --test tests/*.test.mjs

    build
      npm run build:frontend

---

## 43. Production Quality Contract

قبل از اعلام موفقیت هر تغییر:

    DISCOVER
       ↓
    TRACE
       ↓
    UNDERSTAND
       ↓
    ROOT CAUSE
       ↓
    MINIMAL FIX
       ↓
    SYNTAX
       ↓
    REGRESSION TEST
       ↓
    API CONTRACT
       ↓
    D1 HEALTH / DATA
       ↓
    SECURITY
       ↓
    DEPLOY
       ↓
    DEPLOYMENT STATUS
       ↓
    PRODUCTION VERIFY
       ↓
    REPORT

Build موفق به‌تنهایی Production Success نیست.

---

## 44. Current API Surface

### Public

    GET  /api/locale
    GET  /api/health
    GET  /api/home
    GET  /api/categories
    GET  /api/products
    GET  /api/products/<slug>
    POST /api/products/<slug>/view
    GET  /api/flash-sales
    GET  /api/settings
    GET  /api/site-rules
    GET  /api/faq
    GET  /api/content
    GET  /api/content/<section>/<slug>
    GET  /api/storefront-snapshot
    GET  /api/payment/options

### Authentication

    POST /api/auth/request-otp
    POST /api/auth/verify-otp
    GET  /api/me
    POST /api/auth/logout

### User

    GET/POST /api/addresses
    GET /api/rewards
    POST /api/rewards/redeem
    POST /api/referrals/apply
    GET /api/notifications
    POST /api/notifications/read
    GET/POST/DELETE /api/favorites
    GET/POST /api/reviews/...
    GET/POST /api/support/tickets
    GET/POST /api/support/tickets/...

### Commerce

    GET/POST/PUT/DELETE /api/cart...
    POST /api/orders
    GET /api/orders
    GET /api/orders/<id>
    POST /api/orders/<id>/pay
    POST /api/orders/<id>/payment-receipt
    GET/POST /api/payment/callback

### Admin

    /api/admin/me
    /api/admin/permissions
    /api/admin/users
    /api/admin/roles
    /api/admin/products
    /api/admin/product-attributes
    /api/admin/product-attribute-options
    /api/admin/categories
    /api/admin/orders
    /api/admin/inventory
    /api/admin/payments
    /api/admin/reviews
    /api/admin/cms
    /api/admin/site-rules
    /api/admin/invoice-settings
    /api/admin/settings
    /api/admin/integrations
    /api/admin/discounts
    /api/admin/coupons
    /api/admin/media-images
    /api/admin/stats
    /api/admin/audit
    /api/admin/reports/*
    /api/admin/export/*
    /api/admin/tickets
    /api/admin/faq
    /api/admin/rewards
    /api/admin/rewards/points
    /api/admin/notifications
    /api/admin/visitors
    /api/admin/storefront-snapshot/trigger

Worker source و Tests مرجع نهایی Contract دقیق هر endpoint هستند.

---

## 45. Architectural Rules

1. پروژه از صفر بازنویسی نشود.
2. قبل از تغییر، Source واقعی و مسیر داده بررسی شود.
3. Minimal Fix ترجیح دارد.
4. Authentication دوباره‌نویسی نشود.
5. Order/Payment/Invoice موازی ساخته نشود.
6. D1 Schema بدون دلیل تغییر نکند.
7. Secret وارد Frontend یا Snapshot نشود.
8. Frontend منبع حقیقت قیمت و موجودی نیست.
9. Product-specific options با Global options مخلوط نشوند.
10. Product selection تا Cart/Order حفظ شود.
11. Product Detail با Snapshot ناقص تغذیه نشود.
12. داده User/Order بدون دلیل حذف نشود.
13. Migration موجود بدون بررسی تاریخچه تغییر نکند.
14. Cache Version بعد از تغییر Frontend بررسی شود.
15. Routing و click/event handling قبل از تغییر بررسی شود.
16. RTL و Mobile UX حفظ شود.
17. هیچ Deployment ناقصی Success اعلام نشود.
18. هر قابلیت جدید Production باید در README ثبت شود.
19. README نباید قابلیت حذف‌شده را به‌عنوان قابلیت فعال معرفی کند.
20. README نباید قابلیت فعال Production را فراموش کند.

---

## 46. Files That Are Architectural Contracts

فایل‌های زیر قبل از تغییرات بزرگ باید بررسی شوند:

    frontend/src/app.js
    frontend/src/styles.css
    frontend/src/index.html
    frontend/src/admin/AdminApp.js
    frontend/src/admin/router.js
    frontend/src/admin/components/Sidebar.js
    frontend/src/admin/services/api.js
    worker/src/index.js
    wrangler.toml
    scripts/build-frontend.mjs
    database/migrations/*
    .github/workflows/*
    tests/*
    docs/SECURITY.md
    docs/DEPLOYMENT.md

---

## 47. Final Architecture

    GILAS ART
        |
        +-- Storefront
        |     +-- Home
        |     +-- Shop
        |     +-- Product
        |     +-- CMS
        |
        +-- Customer
        |     +-- Auth
        |     +-- Account
        |     +-- Cart
        |     +-- Orders
        |     +-- Payments
        |     +-- Rewards
        |     +-- Referral
        |     +-- Support
        |
        +-- Admin
        |     +-- Products
        |     +-- Orders
        |     +-- Payments
        |     +-- Inventory
        |     +-- Customers
        |     +-- CMS
        |     +-- Reports
        |     +-- RBAC
        |     +-- Audit
        |
        +-- Cloudflare Worker
        |
        +-- D1
        |
        +-- Kavenegar
        |
        +-- ZarinPal / NovinoPay
        |
        +-- PWA / Snapshot / CI-CD

هدف این معماری:

**یک سیستم واحد، امن، قابل نگهداری، کم‌مصرف و Server-authoritative برای گالری، فروشگاه، حساب کاربری، پرداخت و کنترل پنل GilasArt.**

---

## 48. README Maintenance Policy

این README یک سند معماری زنده است، نه متن تبلیغاتی.

هر قابلیت جدیدی که در Production اضافه شود و روی یکی از موارد زیر اثر بگذارد باید در همین فایل ثبت شود:

- Route
- API
- Database
- Admin Page
- Customer Feature
- Payment
- Authentication
- Authorization
- PWA/Mobile
- Security
- Deployment
- Snapshot
- Business Rule
- Product Option
- Loyalty/Referral
- CMS
- Reporting

قبل از حذف هر قابلیت از README، Source و Production باید بررسی شوند.

**هدف این فایل این است که مهندس بعدی بتواند بدون حدس زدن بفهمد GilasArt امروز دقیقاً چه معماری و چه امکاناتی دارد.**

## 49. Production Language Policy — Persian Storefront

The current public GilasArt storefront is **Persian-only**.

- Public customer routes use the canonical routes documented in section 4, without locale prefixes.
- The public header must not display a language selector or language flags.
- The public storefront must remain RTL and Persian.
- Browser language detection must not redirect customers to another language.
- Legacy locale-prefixed public URLs such as `/fa/*`, `/en/*`, `/tr/*`, and `/ar/*` are normalized back to the canonical Persian route.
- Internal translation compatibility code may remain where required by the existing application, but it must not expose or activate a customer-facing multilingual storefront.

This is the current product requirement and overrides any older multilingual storefront experiment.



## 50. Virtual Gallery — Stage 1

A standalone cinematic Three.js gallery is served at:

    https://gilasart.ir/virtual-gallery/

Source assets:

    frontend/public/virtual-gallery/index.html
    frontend/public/virtual-gallery/gallery.css
    frontend/public/virtual-gallery/gallery.js
    frontend/public/virtual-gallery-entry.js

The homepage entry-point enhancer adds a link to the gallery inside the existing home hero action row only; it does not replace the storefront router or change commerce flows. The gallery reads the already-published `/data/storefront-index.json` snapshot for product artwork and falls back to generated decorative artwork if the snapshot or an image is unavailable. It does not query D1 directly.

Stage 1 includes a welcome screen, loading state, cinematic 3D room, warm metallic frames, soft spot lighting, smooth camera movement, keyboard/touch movement controls, help panel, responsive layout, and reduced-motion support. Gallery JavaScript syntax is included in `npm run check`.

The gallery is a separate public route. Storefront, authentication, checkout, payments, and Admin routing remain unchanged.
