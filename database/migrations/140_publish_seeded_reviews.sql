-- Publish existing seeded product reviews so they are visible on product pages.
-- Newly submitted customer reviews keep the existing moderation flow (approved=0).
UPDATE reviews
SET approved=1
WHERE user_id LIKE 'review_seed_%'
  AND approved=0;
