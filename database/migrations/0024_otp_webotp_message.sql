-- Improve OTP SMS compatibility with Android WebOTP / SMS Retriever while keeping the human-readable Persian message.
INSERT INTO site_settings(key,value) VALUES(
  'kavenegar_message_template',
  '<#> گیلاس آرت\nکد ورود شما: {code}\n\n@gilasartirac-svg.github.io #{code}'
)
ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP;
