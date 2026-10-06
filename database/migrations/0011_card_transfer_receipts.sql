-- Card transfer receipt workflow
ALTER TABLE payments ADD COLUMN receipt_status TEXT NOT NULL DEFAULT 'NONE';
ALTER TABLE payments ADD COLUMN receipt_mime TEXT;
ALTER TABLE payments ADD COLUMN receipt_size INTEGER;
ALTER TABLE payments ADD COLUMN receipt_data BLOB;
ALTER TABLE payments ADD COLUMN receipt_uploaded_at TEXT;
ALTER TABLE payments ADD COLUMN receipt_reviewed_at TEXT;
ALTER TABLE payments ADD COLUMN receipt_reviewed_by TEXT REFERENCES users(id);
