-- Card transfer receipt rejection workflow
ALTER TABLE payments ADD COLUMN receipt_rejection_reason TEXT;
