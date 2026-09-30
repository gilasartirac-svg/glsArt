PRAGMA foreign_keys = ON;

-- Product catalog normalization:
-- 1) SKU is exactly the clean product slug.
-- 2) Product name is built from the existing product description/title source.
-- 3) Product description and SEO metadata are generated from that product-specific title.
-- 4) Product prices are converted by appending one zero (x10).
--
-- Google SEO note: metadata is descriptive and product-specific rather than a keyword list.
-- Google does not use the meta-keywords tag for ranking, and recommends avoiding keyword stuffing.

UPDATE products
SET
  sku = slug,
  name = CASE
    WHEN TRIM(COALESCE(description,'')) = '' THEN
      CASE WHEN name LIKE 'تابلوی معرق مس برجسته %' THEN name ELSE 'تابلوی معرق مس برجسته ' || TRIM(name) END
    WHEN TRIM(description) LIKE 'تابلوی معرق مس برجسته %' THEN TRIM(description)
    ELSE 'تابلوی معرق مس برجسته ' || TRIM(description)
  END,
  description = CASE
    WHEN TRIM(COALESCE(description,'')) = '' THEN
      'تابلوی معرق مس برجسته ' || TRIM(name) ||
      ' اثری هنری و دکوراتیو با جلوه‌ای اصیل و ماندگار؛ مناسب دکوراسیون منزل، محل کار و انتخابی ارزشمند برای هدیه در مناسبت‌های مختلف.'
    ELSE
      'تابلوی معرق مس برجسته ' || TRIM(
        CASE
          WHEN TRIM(description) LIKE 'تابلوی معرق مس برجسته %'
            THEN substr(TRIM(description), length('تابلوی معرق مس برجسته ') + 1)
          ELSE TRIM(description)
        END
      ) ||
      ' اثری هنری و دکوراتیو با جلوه‌ای اصیل و ماندگار؛ مناسب دکوراسیون منزل، محل کار و انتخابی ارزشمند برای هدیه در مناسبت‌های مختلف.'
  END,
  price_irt = CASE WHEN price_irt > 0 THEN price_irt * 10 ELSE price_irt END,
  seo_title = CASE
    WHEN TRIM(COALESCE(description,'')) = '' THEN
      'تابلوی معرق مس برجسته ' || TRIM(name) || ' | گیلاس آرت'
    ELSE
      'تابلوی معرق مس برجسته ' ||
      TRIM(
        CASE
          WHEN TRIM(description) LIKE 'تابلوی معرق مس برجسته %'
            THEN substr(TRIM(description), length('تابلوی معرق مس برجسته ') + 1)
          ELSE TRIM(description)
        END
      ) || ' | گیلاس آرت'
  END,
  seo_description = CASE
    WHEN TRIM(COALESCE(description,'')) = '' THEN
      'خرید تابلوی معرق مس برجسته ' || TRIM(name) ||
      ' از گیلاس آرت؛ انتخابی هنری برای دکوراسیون و هدیه خاص، کادویی برای روز پدر و روز مادر و هدیه سازمانی.'
    ELSE
      'خرید تابلوی معرق مس برجسته ' ||
      TRIM(
        CASE
          WHEN TRIM(description) LIKE 'تابلوی معرق مس برجسته %'
            THEN substr(TRIM(description), length('تابلوی معرق مس برجسته ') + 1)
          ELSE TRIM(description)
        END
      ) ||
      ' از گیلاس آرت؛ انتخابی هنری برای دکوراسیون، هدیه خاص و کادویی برای روز پدر، روز مادر و هدیه سازمانی.'
  END
WHERE active = 1;

-- Keep any order snapshot SKU aligned with the canonical product SKU.
UPDATE order_items
SET sku = (
  SELECT p.sku
  FROM products p
  WHERE p.id = order_items.product_id
)
WHERE EXISTS (
  SELECT 1 FROM products p
  WHERE p.id = order_items.product_id
);

-- Convert existing monetary product-option deltas to the same unit.
UPDATE product_attribute_options
SET price_delta_irt = price_delta_irt * 10
WHERE price_delta_irt > 0;
