# GilasArt — فروشگاه هنر فارسی/RTL

این مخزن یک پایه‌ی کامل برای فروشگاه آنلاین گیلاآرت است: Frontend استاتیک RTL، Cloudflare Worker، D1، احراز هویت OTP، سبد خرید، سفارش، پرداخت ZarinPal، علاقه‌مندی، نظر، RBAC پایه، audit log، هدرهای امنیتی و CI.

## ساختار
- `frontend/` رابط کاربری SPA فارسی و RTL
- `worker/` API و منطق امنیتی/سفارش/پرداخت
- `database/` migration و seed برای D1
- `tests/` تست‌های واحد و قراردادهای پایه
- `docs/` راهنمای امنیت و استقرار

## Secretها
هرگز secret را در Git قرار ندهید. روی Worker تنظیم کنید:
- `ZARINPAL_MERCHANT_ID`
- `KAVENEGAR_API_KEY`
- `OTP_PEPPER`

متغیرهای معمول: `APP_ORIGIN`, `PAYMENT_ENV`, `PAYMENT_CALLBACK_URL`, `KAVENEGAR_SENDER`.

## تست و build
`npm install && npm test && npm run check && npm run build`

## وضعیت پرداخت
Callback به‌تنهایی موفقیت نیست. Worker پس از callback، Verify سمت سرور را اجرا می‌کند و فقط نتیجه‌ی Verify را به PAID تبدیل می‌کند.

## استقرار
ابتدا migrationهای D1 را اجرا کنید، سپس Worker را deploy کنید و secretها را با secret manager تنظیم کنید. GitHub Pages فقط فایل‌های `dist/` را سرو می‌کند.
