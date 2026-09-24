# Security notes
- OTP با `crypto.getRandomValues` تولید و با SHA-256 + pepper ذخیره می‌شود؛ plaintext OTP لاگ نمی‌شود.
- OTP پنج تلاش، انقضای دو دقیقه و محدودیت درخواست بر mobile و IP دارد.
- session در cookie HttpOnly/Secure با SameSite=Lax است؛ CSRF برای mutationهای authenticated لازم است.
- قیمت، SKU، موجودی و اقلام سفارش از D1 خوانده می‌شوند؛ داده frontend منبع حقیقت نیست.
- پرداخت فقط با server-side Verify معتبر می‌شود؛ callback به‌تنهایی موفقیت نیست.
- CORS به origin مشخص محدود است.
- هدرهای امنیتی پایه و CSP فعال هستند.
- خطاهای داخلی با پیام عمومی پاسخ داده می‌شوند و secret/OTP در response لاگیک قرار نمی‌گیرند.
