-- Compatibility migration for legacy review seed files.
-- The current reviews schema uses body, while older seed migrations use comment.
-- Preserve existing rows and support both forms without changing review API consumers.

PRAGMA foreign_keys=OFF;

ALTER TABLE reviews RENAME TO reviews_legacy;

CREATE TABLE reviews(
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  body TEXT NOT NULL DEFAULT '',
  approved INTEGER NOT NULL DEFAULT 0 CHECK(approved IN(0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comment TEXT
);

INSERT INTO reviews(id,user_id,product_id,rating,body,approved,created_at)
SELECT id,user_id,product_id,rating,body,approved,created_at
FROM reviews_legacy;

DROP TABLE reviews_legacy;

PRAGMA foreign_keys=ON;

CREATE TRIGGER IF NOT EXISTS trg_reviews_sync_comment_to_body
AFTER INSERT ON reviews
WHEN NEW.body = '' AND NEW.comment IS NOT NULL AND NEW.comment <> ''
BEGIN
  UPDATE reviews SET body = NEW.comment WHERE id = NEW.id;
END;
