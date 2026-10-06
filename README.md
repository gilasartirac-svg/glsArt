
# GilasArt — Production Architecture & Feature Reference

> **🔴 زیرپروژه Production: چهارزبانه‌سازی GilasArt — اولویت اجرایی**
>
> این زیرپروژه باید **به‌طور کامل تکمیل و تأیید شود و تا پایان آن، توسعه قابلیت‌های غیرمرتبط در اولویت بعدی قرار دارد.**
>
> **قرارداد غیرقابل‌تغییر ترجمه:** چهار فایل زبان `frontend/public/i18n/fa.json`, `ar.json`, `en.json`, `tr.json` یک dictionary واحد با کلیدهای کاملاً یکسان هستند. **هر متنی که در فایل فارسی تغییر کند، اضافه شود یا حذف شود، همان تغییر باید در همان Commit در سه فایل دیگر نیز اعمال شود. هیچ کلید یا متن کاربرپسندی نباید فقط در یک زبان وجود داشته باشد.**
>
> **فارسی زبان پیش‌فرض و زبان امن است:** سیستم فقط زمانی مجاز است زبان غیر فارسی را به‌صورت خودکار انتخاب کند که شواهد کافی و صریح از **کشور غیرایران + زبان صریح و سازگار مرورگر** داشته باشد. کشور غیرایران به‌تنهایی کافی نیست. اگر VPN، Proxy، IP نادرست، زبان مبهم، نبود Accept-Language یا هر نوع شک وجود داشته باشد، **فارسی فعال می‌شود**. کاربر ایرانی با VPN نیز نباید صرفاً به‌دلیل تغییر IP به زبان دیگری منتقل شود.
>
> **اولویت تشخیص زبان:** 1) مسیر صریح `/fa/`, `/ar/`, `/en/`, `/tr/`، 2) Cookie انتخاب زبان کاربر، 3) تشخیص محافظه‌کارانه Server-side با Cloudflare country + Accept-Language، 4) در هر ابهام فارسی. پس از انتخاب دستی کاربر، زبان در Cookie با عمر یک‌سال ذخیره می‌شود و در مراجعه بعدی **هیچ تشخیص خودکار یا درخواست اضافی برای تشخیص زبان لازم نیست**. این Cookie باید روی Frontend مصرف شود تا فشار غیرضروری به Cloudflare Worker/D1 ایجاد نشود.
>
> **منبع ترجمه:** ترجمه‌ها باید روان، طبیعی و واقعی باشند و توسط ترجمه انسانی/مدل زبانی با کنترل معنایی تولید و بازبینی شوند. **Google Translator/Google Translate ممنوع است.** ترجمه تحت‌اللفظی، ماشینی و نامتناسب با زبان مقصد قابل قبول نیست.
>
> **تعریف Done برای این زیرپروژه:** هر چهار JSON، تمام متن‌های User-facing در Frontend عمومی و Admin که در محدوده این زیرپروژه هستند، URL locale، RTL/LTR، Cookie، auto-detection محافظه‌کارانه، language switcher، SEO/hreflang، Service Worker/cache، Quality Gate و مستندات README باید با هم کامل و تست شوند. تا وقتی حتی یک متن کاربرپسند جاافتاده یا یک اختلاف کلیدی بین چهار فایل وجود دارد، زیرپروژه چهارزبانه‌سازی **تمام‌شده محسوب نمی‌شود**.
>


> مرجع فنی و معماری زنده پروژه Production گیلاس آرت / GilasArt
>
> Repository: gilasartirac-svg/glsArt
> Production: https://gilasart.ir
> Public API: https://api.gilasart.ir
> Cloudflare Worker: gilasartworker
> D1: gilasartdatabase / binding: DB
> Last audited: 2026-10-06

---

## 0. برنامه اجرایی چهارزبانه‌سازی GilasArt — Master Checklist

این برنامه یک **زیرپروژه مستقل Production** است و تا وقتی فاز 12 و Definition of Done نهایی تأیید نشده‌اند، چهارزبانه‌سازی کامل اعلام نمی‌شود. این چک‌لیست مرجع وضعیت اجراست؛ هر مورد فقط پس از بررسی/تست واقعی با **☑** علامت می‌خورد. موارد انجام‌نشده با **☐** باقی می‌مانند.

### فاز 0 — قفل معماری i18n
- ☑ فاز 0 کامل و قفل معماری تأیید شده است.
- ☑ چهار Locale رسمی: `fa / en / tr / ar`
- ☑ چهار JSON زبان با ساختار و کلیدهای یکسان
- ☑ فارسی زبان پیش‌فرض و fallback امن
- ☑ Cookie ترجیح زبان با عمر یک‌سال
- ☑ Cookie قبل از auto-detection بررسی می‌شود
- ☑ auto-detection محافظه‌کارانه: کشور غیرایران + زبان صریح و سازگار مرورگر
- ☑ ابهام/VPN/زبان فارسی → فارسی
- ☑ بدون D1 برای locale detection
- ☑ Google Translate ممنوع در قرارداد پروژه
- ☑ RTL برای fa/ar و LTR برای en/tr
- ☑ مسیرهای Production چهارگانه به‌صورت کامل End-to-End تأیید شده‌اند
- ☑ Canonical / hreflang / x-default به‌صورت کامل End-to-End تأیید شده‌اند
- ☑ Service Worker چهار JSON زبان را در Cache دارد
- ☑ Quality Gate قرارداد چهار JSON و detection را بررسی می‌کند

**خروجی فاز 0:** معماری i18n قفل و تأیید شد. Production route E2E برای `/`, `/fa/`, `/en/`, `/tr/`, `/ar/`, `/shop`، دارایی تصویر Home، 404 و همچنین Canonical/Hreflang/X-Default در GitHub Pages پس از Deployment Commit `263bf9ec489e39c51da18979a4344cd007924840` با موفقیت تأیید شدند.

### فاز 1 — هسته و اجزای مشترک
- ☐ فاز 1 کامل
- ☐ Header
- ☐ Logo
- ☐ منوی اصلی
- ☐ Hamburger
- ☐ Language switcher
- ☐ Cart
- ☐ Account
- ☐ Login / Logout
- ☐ Points
- ☐ Footer
- ☐ Social links
- ☐ Buttons
- ☐ Loading
- ☐ Error
- ☐ Empty states
- ☐ Success / Error messages
- ☐ Modalها
- ☐ Accessibility labels
- ☐ Tooltipها

### فاز 2 — Home
- ☐ فاز 2 کامل
- ☐ Hero
- ☐ معرفی GilasArt
- ☐ Categories
- ☐ Featured products
- ☐ CTAها
- ☐ بخش‌های معرفی
- ☐ Footer اختصاصی Home
- ☐ SEO text
- ☐ Dynamic messages
- ☐ تست کامل هر چهار زبان

### فاز 3 — Shop
- ☐ فاز 3 کامل
- ☐ عنوان فروشگاه
- ☐ Search
- ☐ Filters
- ☐ Sorting
- ☐ Price
- ☐ Rating
- ☐ Review count
- ☐ View
- ☐ Load more
- ☐ Infinite scroll
- ☐ Empty state
- ☐ Loading
- ☐ Error
- ☐ Product card
- ☐ Favorite
- ☐ Cart
- ☐ Pagination / navigation در صورت وجود
- ☐ جداسازی قطعی UI text از Product Data
- ☐ تست چهار زبان

### فاز 4 — Product Detail
- ☐ فاز 4 کامل
- ☐ Titles
- ☐ Price
- ☐ SKU
- ☐ Attributes
- ☐ ابعاد
- ☐ رنگ قاب
- ☐ Options
- ☐ Final price
- ☐ Inventory
- ☐ Option selection
- ☐ Add to Cart
- ☐ Favorite
- ☐ Reviews
- ☐ Rating
- ☐ Loading
- ☐ Error
- ☐ Related products
- ☐ Purchase messages
- ☐ Regression test سیستم Product Attribute/Option
- ☐ تست حفظ Option تا Cart و Quantity change

### فاز 5 — Cart / Checkout / Payment
- ☐ فاز 5 کامل
- ☐ Cart
- ☐ Order summary
- ☐ Discount
- ☐ Coupon
- ☐ Payment method selection
- ☐ ZarinPal
- ☐ NovinoPay
- ☐ Card Transfer
- ☐ Receipt upload
- ☐ Payment messages
- ☐ Payment errors
- ☐ Order
- ☐ Invoice
- ☐ تست Server-authoritative pricing/payment

### فاز 6 — Authentication / Account
- ☐ فاز 6 کامل
- ☐ Login
- ☐ OTP
- ☐ Mobile number
- ☐ Profile
- ☐ Orders
- ☐ Favorites
- ☐ Rewards
- ☐ Referral
- ☐ Notifications
- ☐ Account messages
- ☐ Logout
- ☐ Session states
- ☐ عدم تغییر بی‌دلیل منطق امنیتی Authentication

### فاز 7 — Customer Support / CRM
- ☐ فاز 7 کامل
- ☐ Support
- ☐ Ticket
- ☐ Messages
- ☐ FAQ
- ☐ Contact
- ☐ Notifications
- ☐ Ticket status / stages

### فاز 8 — Admin Panel
- ☐ فاز 8 کامل
- ☐ 8-A Dashboard
- ☐ 8-B Products
- ☐ 8-C Categories
- ☐ 8-D Inventory
- ☐ 8-E Orders
- ☐ 8-F Payments
- ☐ 8-G Reviews
- ☐ 8-H Customers
- ☐ 8-I Discounts / Coupons
- ☐ 8-J Rewards / Referral
- ☐ 8-K Notifications
- ☐ 8-L Support / CRM
- ☐ 8-M CMS
- ☐ 8-N Settings
- ☐ 8-O Audit Log / Security
- ☐ Regression test RBAC / permissions

### فاز 9 — صفحات خاص و محتوایی
- ☐ فاز 9 کامل
- ☐ درباره ما
- ☐ قوانین
- ☐ حریم خصوصی
- ☐ تماس
- ☐ Enamad
- ☐ مقالات
- ☐ اخبار
- ☐ آموزش‌ها
- ☐ Aparat
- ☐ صفحات SEO
- ☐ صفحات قانونی

### فاز 10 — SEO و Routing
- ☐ فاز 10 کامل
- ☐ Canonical
- ☐ hreflang
- ☐ Sitemap
- ☐ Page title
- ☐ Meta description
- ☐ Open Graph
- ☐ چهار Locale route
- ☐ Internal links
- ☐ 404
- ☐ Redirect
- ☐ Default language
- ☐ جلوگیری از duplicate content

### فاز 11 — PWA / Service Worker / Cache
- ☐ فاز 11 کامل
- ☐ چهار JSON زبان
- ☐ Cache
- ☐ Versioning
- ☐ Offline behavior
- ☐ Update behavior
- ☐ Stale content prevention
- ☐ Saved language behavior
- ☐ Site/app version changes
- ☐ عدم نمایش Locale قدیمی پس از Deployment

### فاز 12 — ممیزی نهایی «حتی یک کلمه جا نمانده»
- ☐ فاز 12 کامل
- ☐ اسکن کامل Frontend عمومی
- ☐ اسکن کامل Admin
- ☐ Persian hard-coded UI text = صفر مورد مجاز
- ☐ عنوان‌ها
- ☐ button
- ☐ placeholder
- ☐ title
- ☐ aria-label
- ☐ alt
- ☐ alert
- ☐ confirm
- ☐ toast
- ☐ error
- ☐ loading
- ☐ empty state
- ☐ modal
- ☐ validation
- ☐ UI text → i18n
- ☐ Product data → ترجمه خودکار نشود
- ☐ Customer/User content → ترجمه خودکار نشود
- ☐ Technical/internal text فقط در صورت User-facing بودن → i18n
- ☐ هیچ متن User-facing جاافتاده باقی نماند
- ☐ هر چهار زبان End-to-End تست شوند

### قانون سخت CI برای ادامه پروژه
- ☑ اختلاف کلید بین چهار JSON باید Build/Quality Gate را Fail کند.
- ☑ Locale/version/direction نامعتبر باید Quality Gate را Fail کند.
- ☑ قرارداد Cookie و conservative detection باید Quality Gate را Fail کند.
- ☐ Hard-coded User-facing UI text جدید باید به‌صورت خودکار در Quality Gate شناسایی و Fail/Report شود.
- ☐ CI باید پوشش ممیزی نهایی تمام Frontend و Admin را به‌صورت قابل تکرار داشته باشد.

### Definition of Done کل زیرپروژه
- ☐ فازهای 0 تا 12 کامل و تأیید شده‌اند.
- ☐ تمام متن‌های User-facing عمومی و Admin تعیین تکلیف شده‌اند.
- ☐ چهار JSON کلیدهای کاملاً یکسان دارند.
- ☐ ترجمه‌ها روان، طبیعی و بازبینی‌شده‌اند.
- ☐ فارسی fallback امن باقی مانده است.
- ☐ Cookie انتخاب دستی پایدار است و از detection مجدد جلوگیری می‌کند.
- ☐ auto-detection فقط در شرایط مطمئن انجام می‌شود.
- ☐ D1 در locale detection استفاده نمی‌شود.
- ☐ Google Translate استفاده نشده است.
- ☐ RTL/LTR و routeها End-to-End تأیید شده‌اند.
- ☐ SEO/hreflang/canonical تأیید شده‌اند.
- ☐ Service Worker/cache تأیید شده‌اند.
- ☐ Quality Gate و Security/Regression tests موفق هستند.
- ☐ Production با همه چهار Locale تأیید شده است.
- ☐ README و وضعیت همین Checklist در همان تغییر Production به‌روز شده‌اند.

**قاعده وضعیت:** فقط مواردی که واقعاً بررسی و تست شده‌اند با ☑ علامت می‌خورند. هر مورد ☐ یعنی هنوز نباید آن را Done فرض کرد.

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
    frontend/public/data/storefront.json
    frontend/public/data/storefront-manifest.json

Snapshot برای کاهش D1 Reads داده‌های عمومی مانند:

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

## 49. Production Internationalization (i18n) — Four Locale Architecture

The public GilasArt storefront uses four explicit locale prefixes. **Persian is the default locale** and browser-language detection must not silently replace it.

| Language | Direction | Production path |
|---|---|---|
| فارسی | RTL | `https://gilasart.ir/fa/` |
| العربية | RTL | `https://gilasart.ir/ar/` |
| English | LTR | `https://gilasart.ir/en/` |
| Türkçe | LTR | `https://gilasart.ir/tr/` |

### Locale source files

Translation data is stored in GitHub as four JSON dictionaries under:

- `frontend/public/i18n/fa.json`
- `frontend/public/i18n/ar.json`
- `frontend/public/i18n/en.json`
- `frontend/public/i18n/tr.json`

All four files must contain the **same variable/key set**. Only the values change by language. Each file also declares `locale`, `direction`, `defaultLocale: "fa"`, and `version`.

### Runtime handling

> **وضعیت تکمیل زیرپروژه:** زیرساخت چهار JSON، مسیرهای locale، Cookie ترجیح، تشخیص محافظه‌کارانه و قرارداد Quality Gate پیاده شده است؛ اما تا زمانی که تمام متن‌های User-facing عمومی و Admin به dictionaryهای چهارگانه منتقل و برای هر چهار زبان بازبینی نشوند، این زیرپروژه Production از نظر محتوای ترجمه‌ای Done نیست.

The public application loads the dictionary for the locale in the URL, sets `document.documentElement.lang` and `dir`, and applies the dictionary to rendered UI text/ARIA/placeholder/title/alt values. The locale path is authoritative:

- `/fa/*` → Persian / RTL
- `/ar/*` → Arabic / RTL
- `/en/*` → English / LTR
- `/tr/*` → Turkish / LTR

A bare public route such as `/` is eligible for conservative automatic locale selection only when there is no saved language Cookie and the Worker has explicit non-Iran country + compatible non-Persian browser-language evidence; otherwise it resolves to Persian. An explicit locale path such as `/fa/`, `/ar/`, `/en/`, or `/tr/` is authoritative. Admin remains Persian-only unless explicitly internationalized later.

### Translation contract

The Production Quality Gate validates that all four JSON files are valid, version-compatible, use the correct direction, and have identical translation keys. Adding a new user-facing translatable string requires adding the same key to all four locale files.

### SEO and routing

The locale system keeps locale-aware canonical/hreflang routing in the frontend. Locale changes preserve the current public route while replacing only its locale prefix. Product slugs and existing application routing rules remain unchanged.

### Service worker / cache

The PWA service worker caches all four locale dictionaries and uses a new shell cache version whenever the frontend i18n bundle changes, preventing stale locale assets from masking a deployment.

