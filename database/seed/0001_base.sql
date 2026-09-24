INSERT OR IGNORE INTO roles(id,name) VALUES('role-customer','customer'),('role-admin','admin');
INSERT OR IGNORE INTO permissions(id,name) VALUES('perm-catalog-read','catalog.read'),('perm-order-manage','order.manage'),('perm-user-manage','user.manage'),('perm-report-read','report.read');
INSERT OR IGNORE INTO categories(id,slug,name,description) VALUES('cat-art','art','تابلو و آثار هنری','آثار منتخب گیلاآرت');
INSERT OR IGNORE INTO products(id,category_id,slug,sku,name,description,price_irt,active,seo_title,seo_description) VALUES('prod-demo','cat-art','sample-art','GA-DEMO-001','اثر نمونه گیلاآرت','محصول نمونه برای تکمیل کاتالوگ؛ در محیط واقعی با محصول فعال جایگزین شود.',12500000,0,'اثر هنری گیلاآرت','فروشگاه آثار هنری گیلاآرت');
INSERT OR IGNORE INTO inventory(product_id,quantity) VALUES('prod-demo',0);
