-- Configurable SMS templates for support tickets.
INSERT INTO site_settings(key,value)
VALUES
('support_ticket_created_sms_template','گیلاس آرت\nتیکت شما با موفقیت ثبت شد.\nشماره تیکت: {ticket_id}\nمشاهده و پیگیری: {ticket_url}'),
('support_ticket_reply_sms_template','گیلاس آرت\nپاسخی برای تیکت شما ثبت شده است.\nمشاهده پاسخ: {ticket_url}')
ON CONFLICT(key) DO NOTHING;
