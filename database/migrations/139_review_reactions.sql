-- Review reactions: one Like or Dislike per signed-in user per review.
CREATE TABLE IF NOT EXISTS review_reactions (
  id TEXT PRIMARY KEY,
  review_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  reaction TEXT NOT NULL CHECK(reaction IN ('like','dislike')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(review_id,user_id),
  FOREIGN KEY(review_id) REFERENCES reviews(id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_review_reactions_review ON review_reactions(review_id);
CREATE INDEX IF NOT EXISTS idx_review_reactions_user ON review_reactions(user_id);
