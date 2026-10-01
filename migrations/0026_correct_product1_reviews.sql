-- Correct the supplied product #1 reviews.
-- Product numbers map to the product SKU case-insensitively (1 -> Gilas001).
-- The existing 12 demo rows were previously seeded against Gilas411; move them
-- to product #1 and preserve the supplied names/text/dates.
UPDATE reviews
SET product_id=(SELECT id FROM products WHERE lower(sku)=lower('gilas001') LIMIT 1),
    approved=0,
    created_at=CASE id
      WHEN 'test_review_gilas411_001' THEN '2025-03-22T00:00:00.000Z'
      WHEN 'test_review_gilas411_002' THEN '2016-08-26T00:00:00.000Z'
      WHEN 'test_review_gilas411_003' THEN '2024-11-21T00:00:00.000Z'
      WHEN 'test_review_gilas411_004' THEN '2020-07-31T00:00:00.000Z'
      WHEN 'test_review_gilas411_005' THEN '2014-04-18T00:00:00.000Z'
      WHEN 'test_review_gilas411_006' THEN '2020-11-24T00:00:00.000Z'
      WHEN 'test_review_gilas411_007' THEN '2024-09-18T00:00:00.000Z'
      WHEN 'test_review_gilas411_008' THEN '2024-10-29T00:00:00.000Z'
      WHEN 'test_review_gilas411_009' THEN '2025-06-16T00:00:00.000Z'
      WHEN 'test_review_gilas411_010' THEN '2017-11-24T00:00:00.000Z'
      WHEN 'test_review_gilas411_011' THEN '2015-07-01T00:00:00.000Z'
      WHEN 'test_review_gilas411_012' THEN '2014-04-03T00:00:00.000Z'
      ELSE created_at
    END
WHERE id IN (
  'test_review_gilas411_001','test_review_gilas411_002','test_review_gilas411_003',
  'test_review_gilas411_004','test_review_gilas411_005','test_review_gilas411_006',
  'test_review_gilas411_007','test_review_gilas411_008','test_review_gilas411_009',
  'test_review_gilas411_010','test_review_gilas411_011','test_review_gilas411_012'
)
AND EXISTS (SELECT 1 FROM products WHERE lower(sku)=lower('gilas001'));

-- Keep the reviewer records as fictional/demo users, as explicitly requested.
