-- Migrate persisted runtime URLs from the old GitHub Pages repository path to the custom domain root.
UPDATE product_images SET path=substr(path,8) WHERE path LIKE '/glsArt/%';
UPDATE site_settings SET value=replace(value,'/glsArt/','/')
WHERE key IN ('invoice_logo_path','invoice_signature_path') AND value LIKE '/glsArt/%';
UPDATE site_settings SET value=replace(value,'@gilasartirac-svg.github.io','@www.gilasart.ir')
WHERE key='kavenegar_message_template' AND value LIKE '%gilasartirac-svg.github.io%';
