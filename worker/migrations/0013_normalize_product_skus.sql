-- Normalize product SKU values from GA-XLS-#### to GA-####
-- Temporary values avoid UNIQUE(sku) collisions during the migration.
UPDATE products
SET sku = 'TMP-GA-XLS-' || id
WHERE sku GLOB 'GA-XLS-[0-9][0-9][0-9][0-9]';

UPDATE products
SET sku = 'GA-' || substr(sku, length('TMP-GA-XLS-') + 1)
WHERE sku GLOB 'TMP-GA-XLS-[0-9][0-9][0-9][0-9]';
