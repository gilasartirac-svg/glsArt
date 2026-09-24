# Deployment checklist

1. D1 migrations: `0001_initial.sql`, `0002_hardening.sql`.
2. Seed را اجرا کنید.
3. Worker vars: `APP_ORIGIN`, `PAYMENT_ENV`, `PAYMENT_CALLBACK_URL`, `KAVENEGAR_SENDER`.
4. Worker secrets: `ZARINPAL_MERCHANT_ID`, `KAVENEGAR_API_KEY`, `OTP_PEPPER`.
5. Custom domain production را برای Worker تنظیم کنید و `APP_ORIGIN` را روی origin واقعی سایت قرار دهید.
6. GitHub Pages باید `dist/` را منتشر کند؛ API URL در `dist/config.js` قرار می‌گیرد.
7. قبل از production، sandbox payment، OTP، callback/verify، idempotent replay، موجودی، CORS و cookie را تست کنید.
8. ادمین را فقط از طریق D1 به role `admin` وصل کنید و پس از bootstrap دسترسی را بررسی کنید.
