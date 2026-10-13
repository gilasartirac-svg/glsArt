-- Product-specific selectable painting dimensions for the requested GilasArt catalog.

-- Customer UI reuses the existing product-attribute component; option prices remain hidden in the selector.

INSERT OR IGNORE INTO product_attributes(id,name,active,sort_order) VALUES('attr_painting_dimensions','ابعاد تابلو',1,3);

INSERT OR IGNORE INTO product_attribute_options(id,attribute_id,name,active,is_default,price_delta_irt,sort_order) VALUES
('opt_pdim_100x100_cm','attr_painting_dimensions','100x100 cm',1,0,0,1),
('opt_pdim_100x30_cm','attr_painting_dimensions','100x30 cm',1,0,0,2),
('opt_pdim_100x50_cm','attr_painting_dimensions','100x50 cm',1,0,0,3),
('opt_pdim_25x25_cm','attr_painting_dimensions','25x25 cm',1,0,0,4),
('opt_pdim_30x60_cm','attr_painting_dimensions','30x60 cm',1,0,0,5),
('opt_pdim_35x35_cm','attr_painting_dimensions','35x35 cm',1,0,0,6),
('opt_pdim_35x50_cm','attr_painting_dimensions','35x50 cm',1,0,0,7),
('opt_pdim_40x40_cm','attr_painting_dimensions','40x40 cm',1,0,0,8),
('opt_pdim_40x55_cm','attr_painting_dimensions','40x55 cm',1,0,0,9),
('opt_pdim_45x90_cm','attr_painting_dimensions','45x90 cm',1,0,0,10),
('opt_pdim_50x25_cm','attr_painting_dimensions','50x25 cm',1,0,0,11),
('opt_pdim_50x35_cm','attr_painting_dimensions','50x35 cm',1,0,0,12),
('opt_pdim_50x50_cm','attr_painting_dimensions','50x50 cm',1,0,0,13),
('opt_pdim_50x70_cm','attr_painting_dimensions','50x70 cm',1,0,0,14),
('opt_pdim_60x40_cm','attr_painting_dimensions','60x40 cm',1,0,0,15),
('opt_pdim_60x60_cm','attr_painting_dimensions','60x60 cm',1,0,0,16),
('opt_pdim_60x80_cm','attr_painting_dimensions','60x80 cm',1,0,0,17),
('opt_pdim_70x50_cm','attr_painting_dimensions','70x50 cm',1,0,0,18),
('opt_pdim_70x70_cm','attr_painting_dimensions','70x70 cm',1,0,0,19),
('opt_pdim_70x90_cm','attr_painting_dimensions','70x90 cm',1,0,0,20),
('opt_pdim_75x60_cm','attr_painting_dimensions','75x60 cm',1,0,0,21),
('opt_pdim_80x40_cm','attr_painting_dimensions','80x40 cm',1,0,0,22),
('opt_pdim_80x50_cm','attr_painting_dimensions','80x50 cm',1,0,0,23);

INSERT OR IGNORE INTO product_attribute_assignments(product_id,attribute_id,required,sort_order)
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas800')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas410')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas409')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas408')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas407')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas406')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas405')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas404')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas402')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas401')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas400')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas399')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas397')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas395')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas394')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas393')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas391')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas389')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas388')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas387')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas386')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas385')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas384')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas382')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas381')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas380')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas379')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas378')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas377')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas376')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas375')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas374')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas372')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas371')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas370')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas368')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas367')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas366')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas365')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas364')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas363')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas362')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas358')
UNION ALL
SELECT id,'attr_painting_dimensions',1,1 FROM products WHERE lower(sku)=lower('Gilas357');

INSERT OR REPLACE INTO product_attribute_option_overrides(product_id,option_id,active,is_default,price_delta_irt)
SELECT p.id,'opt_pdim_50x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas800')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas410')
UNION ALL
SELECT p.id,'opt_pdim_60x80_cm',1,0,40000000 FROM products p WHERE lower(p.sku)=lower('Gilas410')
UNION ALL
SELECT p.id,'opt_pdim_70x90_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas410')
UNION ALL
SELECT p.id,'opt_pdim_80x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas409')
UNION ALL
SELECT p.id,'opt_pdim_80x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas408')
UNION ALL
SELECT p.id,'opt_pdim_100x30_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas407')
UNION ALL
SELECT p.id,'opt_pdim_60x40_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas406')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas405')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas405')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas404')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas404')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas402')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas402')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas401')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas401')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas400')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas400')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas399')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas399')
UNION ALL
SELECT p.id,'opt_pdim_25x25_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas397')
UNION ALL
SELECT p.id,'opt_pdim_40x40_cm',1,0,30000000 FROM products p WHERE lower(p.sku)=lower('Gilas397')
UNION ALL
SELECT p.id,'opt_pdim_50x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas395')
UNION ALL
SELECT p.id,'opt_pdim_70x50_cm',1,0,60000000 FROM products p WHERE lower(p.sku)=lower('Gilas395')
UNION ALL
SELECT p.id,'opt_pdim_35x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas394')
UNION ALL
SELECT p.id,'opt_pdim_50x50_cm',1,0,60000000 FROM products p WHERE lower(p.sku)=lower('Gilas394')
UNION ALL
SELECT p.id,'opt_pdim_50x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas393')
UNION ALL
SELECT p.id,'opt_pdim_70x50_cm',1,0,60000000 FROM products p WHERE lower(p.sku)=lower('Gilas393')
UNION ALL
SELECT p.id,'opt_pdim_50x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas391')
UNION ALL
SELECT p.id,'opt_pdim_70x50_cm',1,0,75000000 FROM products p WHERE lower(p.sku)=lower('Gilas391')
UNION ALL
SELECT p.id,'opt_pdim_50x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas389')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,0,95000000 FROM products p WHERE lower(p.sku)=lower('Gilas389')
UNION ALL
SELECT p.id,'opt_pdim_75x60_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas388')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas387')
UNION ALL
SELECT p.id,'opt_pdim_100x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas386')
UNION ALL
SELECT p.id,'opt_pdim_40x55_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas385')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,0,91000000 FROM products p WHERE lower(p.sku)=lower('Gilas385')
UNION ALL
SELECT p.id,'opt_pdim_100x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas384')
UNION ALL
SELECT p.id,'opt_pdim_50x25_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas382')
UNION ALL
SELECT p.id,'opt_pdim_100x50_cm',1,0,121000000 FROM products p WHERE lower(p.sku)=lower('Gilas382')
UNION ALL
SELECT p.id,'opt_pdim_80x40_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas381')
UNION ALL
SELECT p.id,'opt_pdim_100x50_cm',1,0,100000000 FROM products p WHERE lower(p.sku)=lower('Gilas381')
UNION ALL
SELECT p.id,'opt_pdim_100x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas380')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas379')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,80000000 FROM products p WHERE lower(p.sku)=lower('Gilas379')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas378')
UNION ALL
SELECT p.id,'opt_pdim_70x90_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas378')
UNION ALL
SELECT p.id,'opt_pdim_35x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas377')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas377')
UNION ALL
SELECT p.id,'opt_pdim_35x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas376')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas376')
UNION ALL
SELECT p.id,'opt_pdim_35x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas375')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas375')
UNION ALL
SELECT p.id,'opt_pdim_35x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas374')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas374')
UNION ALL
SELECT p.id,'opt_pdim_35x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas372')
UNION ALL
SELECT p.id,'opt_pdim_50x70_cm',1,0,90000000 FROM products p WHERE lower(p.sku)=lower('Gilas372')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas371')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,400000000 FROM products p WHERE lower(p.sku)=lower('Gilas371')
UNION ALL
SELECT p.id,'opt_pdim_50x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas370')
UNION ALL
SELECT p.id,'opt_pdim_35x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas368')
UNION ALL
SELECT p.id,'opt_pdim_100x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas367')
UNION ALL
SELECT p.id,'opt_pdim_35x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas366')
UNION ALL
SELECT p.id,'opt_pdim_35x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas365')
UNION ALL
SELECT p.id,'opt_pdim_30x60_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas364')
UNION ALL
SELECT p.id,'opt_pdim_45x90_cm',1,0,85000000 FROM products p WHERE lower(p.sku)=lower('Gilas364')
UNION ALL
SELECT p.id,'opt_pdim_70x70_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas363')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,115000000 FROM products p WHERE lower(p.sku)=lower('Gilas363')
UNION ALL
SELECT p.id,'opt_pdim_50x35_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas362')
UNION ALL
SELECT p.id,'opt_pdim_70x50_cm',1,0,85000000 FROM products p WHERE lower(p.sku)=lower('Gilas362')
UNION ALL
SELECT p.id,'opt_pdim_50x50_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas358')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,115000000 FROM products p WHERE lower(p.sku)=lower('Gilas358')
UNION ALL
SELECT p.id,'opt_pdim_60x60_cm',1,1,0 FROM products p WHERE lower(p.sku)=lower('Gilas357')
UNION ALL
SELECT p.id,'opt_pdim_100x100_cm',1,0,155000000 FROM products p WHERE lower(p.sku)=lower('Gilas357');
