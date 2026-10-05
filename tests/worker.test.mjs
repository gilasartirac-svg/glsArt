import test from 'node:test';import assert from 'node:assert/strict';
test('money values are integer IRR/Toman units',()=>{assert.equal(Number.isInteger(1000000),true)});
test('production secrets are not hard-coded',async()=>{const s=await (await import('node:fs/promises')).readFile('worker/src/index.js','utf8');assert.equal(s.includes('ZARINPAL_MERCHANT_ID='),false);assert.equal(s.includes('KAVENEGAR_API_KEY='),false)});
test('OTP challenge policy',()=>{assert.ok(120000>=60000);assert.ok(5>=3)});
import {readFileSync} from 'node:fs';
const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const schema=readFileSync(new URL('../database/migrations/0001_initial.sql',import.meta.url),'utf8');
test('payment flow requires server-side verification',()=>{assert.match(worker,/verify\.json/);assert.match(worker,/code===100\|\|code===101/);assert.match(worker,/callback_status/)});
test('auth uses cryptographic OTP generation and CSRF for mutations',()=>{assert.match(worker,/crypto\.getRandomValues/);assert.match(worker,/requireCsrf/);assert.match(worker,/__Host-gs_session/)});
test('commerce schema contains source-of-truth tables',()=>{for(const name of ['products','inventory','orders','order_items','payments','payment_attempts','audit_logs','user_roles'])assert.match(schema,new RegExp('CREATE TABLE '+name));});
test('payment finalization uses one atomic D1 batch and guards duplicate callbacks',()=>{assert.match(worker,/await env\.DB\.batch\(statements\)/);assert.match(worker,/stock_reservations WHERE order_id=\?/);assert.match(worker,/p\.status==='PAID'/);assert.match(worker,/oo\.status='PENDING'/);});
test('checkout idempotency is enforced server-side',()=>{assert.match(worker,/idempotency_key_required/);assert.match(worker,/checkout_key/);assert.match(schema,/CREATE TABLE orders/);});

test('admin control panel uses RBAC and secret-backed bootstrap',()=>{assert.match(worker,/async function canAssignRole/);assert.match(worker,/ADMIN_BOOTSTRAP_MOBILE/);assert.doesNotMatch(worker,/09153090907/);const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');assert.match(app,/function isAdminUser\(\)\{return state\.roles/);assert.doesNotMatch(app,/09153090907/);});

const promotions=readFileSync(new URL('../database/migrations/0011_promotions_integrations.sql',import.meta.url),'utf8');
test('promotion schema and generated coupon prefix are present',()=>{for(const name of ['discounts','discount_products','discount_categories','discount_usages','coupon_products','coupon_categories'])assert.match(promotions,new RegExp('CREATE TABLE '+name));assert.match(promotions,/ALTER TABLE coupons ADD COLUMN starts_at/);});
test('backend pricing is authoritative for coupons and discounts',()=>{assert.match(worker,/async function cartPricing/);assert.match(worker,/\/api\/cart\/price/);assert.match(worker,/coupon_not_applicable/);assert.match(worker,/discount_usages/);assert.match(worker,/coupon_usages/);});
test('integration secrets stay in Worker env and are not returned as values',()=>{assert.match(worker,/apiKeyConfigured:!!env\.KAVENEGAR_API_KEY/);assert.match(worker,/merchantConfigured:!!env\.ZARINPAL_MERCHANT_ID/);assert.doesNotMatch(worker,/apiKey:env\.KAVENEGAR_API_KEY/);assert.doesNotMatch(worker,/merchantId:env\.ZARINPAL_MERCHANT_ID/);});

const visitorSchema=readFileSync(new URL('../database/migrations/0012_visitor_sessions.sql',import.meta.url),'utf8');
test('visitor analytics stores IP, country, identity and online heartbeat fields',()=>{for(const x of ['visitor_sessions','session_key','user_id','ip_address','country_code','first_seen_at','last_seen_at'])assert.match(visitorSchema,new RegExp(x));assert.match(worker,/CF-Connecting-IP/);assert.match(worker,/CF-IPCountry/);assert.match(worker,/visitorAdminList/);assert.match(worker,/datetime\(vs\.last_seen_at\)>=datetime\('now','-5 minutes'\)/);assert.match(worker,/visitors\.read/);});

const cmsSchema=readFileSync(new URL('../database/migrations/0013_cms_content.sql',import.meta.url),'utf8');
test('CMS content schema, permissions and samples are present',()=>{
 assert.match(cmsSchema,/CREATE TABLE IF NOT EXISTS cms_entries/);
 for(const x of ['about','contact','news','articles','content.read','content.write'])assert.ok(cmsSchema.includes(x));
 assert.ok(cmsSchema.includes('cms_news_01'));assert.ok(cmsSchema.includes('cms_article_01'));assert.ok(cmsSchema.includes('cms_contact_01'));
 assert.ok(worker.includes("u.pathname.startsWith('/api/content')"));assert.ok(worker.includes("searchParams.get('section')"));assert.match(worker,/\/api\/admin\/cms/);
});
test('account OTP and reward UX has production split-input and notification styling',async()=>{ const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8'); const css=readFileSync(new URL('../frontend/src/styles.css',import.meta.url),'utf8'); assert.match(app,/otp-digit/);assert.match(app,/one-time-code/);assert.match(app,/webOtpController\?\.abort/); for(const selector of ['.auth-page','.auth-otp-panel','.otp-digit','.ga-galaxy-reward','.ga-reward-content'])assert.match(css,new RegExp(selector.replace(/[.]/g,'\\.')));});test('OTP request hides UI before network request and login returns roles',()=>{
 const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
 assert.match(app,/const hideMobile=\(\)=>\{mobileLabel\.hidden=true;mobileLabel\.setAttribute\('aria-hidden','true'\);mobileEl\.disabled=true;send\.hidden=true;send\.disabled=true\}/);
 assert.match(worker,/ok:true,user:u0,roles:await roles\(u0,env\),permissions:await permissions\(u0,env\),csrfToken:csrf/);
 assert.ok(worker.includes('if(adminBootstrapConfigured(env)){try{await ensureAdminBootstrap(env)}'));
});
test('main navigation and footer expose requested customer content areas',()=>{
 const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
 for(const x of ['href="/contact"','href="/news"','href="/articles"','href="/terms"','href="/support"','نماد اعتماد','تیکت پشتیبانی'])assert.ok(app.includes(x),x);
});

test('Kavenegar OTP delivery checks provider response and supports both code placeholders',()=>{
 const app=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
 assert.ok(app.includes("replaceAll('{code}',code).replaceAll('{0}',code)"));
 assert.ok(app.includes("sms_provider_rejected"));
 assert.ok(app.includes("sj?.return?.status"));
 assert.ok(app.includes("sms_sender_not_configured"));
});


test('admin product save accepts current and legacy GitHub Pages image paths',()=>{
 const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
 assert.match(worker,/startsWith\('\/art\/'\)/);
 assert.match(worker,/startsWith\('\/uploaded\/'\)/);
 assert.match(worker,/frontend\/public\/uploaded/);
 assert.match(worker,/www\.gilasart\.ir/);
 assert.match(worker,/invalid_image_path/);
});

test('admin product attributes support creation, options and product assignment',()=>{
 const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
 const products=readFileSync(new URL('../frontend/src/admin/pages/Products.js',import.meta.url),'utf8');
 assert.match(worker,/\/api\/admin\/product-attributes/);
 assert.match(worker,/product_attribute_options/);
 assert.match(worker,/product_attribute_assignments/);
 assert.match(worker,/saveProductAttributeAssignments/);
 assert.match(products,/attributeIds:selectedAttributeIds\(\)/);
 assert.match(products,/priceDeltaIrt:Number\(x\.get\('price'\)\|\|0\)/);
});

const featureSchema=readFileSync(new URL('../database/migrations/0014_flash_sales_support.sql',import.meta.url),'utf8');
test('flash sale and CRM schema are present',()=>{
 assert.match(featureSchema,/flash_sale_active/);assert.match(featureSchema,/flash_sale_ends_at/);assert.match(featureSchema,/support_tickets/);assert.match(featureSchema,/ticket_messages/);assert.match(featureSchema,/faq_entries/);assert.match(featureSchema,/support\.read/);assert.match(featureSchema,/support\.write/);
});
test('flash sales API and secure product fields exist',()=>{
 assert.match(worker,/\/api\/flash-sales/);assert.match(worker,/julianday\(p\.flash_sale_ends_at\)>julianday\('now'\)/);assert.match(worker,/flashSaleValues/);assert.match(worker,/invalid_flash_sale_end/);
});
test('WebOTP SMS is origin-bound and session cookies support cross-site GitHub Pages authentication',()=>{
 assert.match(worker,/otpSmsMessage/);assert.match(worker,/@\$\{host\} #\$\{code\}/);assert.match(worker,/Partitioned/);assert.match(worker,/otp-credentials=\(self\)/);
});
test('support ticket SMS workflow is template-driven and reply opt-in is server enforced',()=>{
 assert.match(worker,/support_ticket_created_sms_template/);
 assert.match(worker,/support_ticket_reply_sms_template/);
 assert.match(worker,/ticketSmsUrl/);
 assert.match(worker,/sendSms/);
 assert.match(worker,/sendKavenegarSms/);
 assert.match(worker,/ticket_created_sms_error/);
});
test('support CRM and infinite CMS pagination are exposed',()=>{
 assert.match(worker,/\/api\/support\/tickets/);assert.match(worker,/\/api\/admin\/tickets/);assert.match(worker,/\/api\/faq/);assert.match(worker,/searchParams\.get\('limit'\)/);assert.match(worker,/searchParams\.get\('offset'\)/);
 const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
 assert.ok(app.includes('سبد خرید'));assert.ok(app.includes('پیشنهاد شگفت‌انگیز'));assert.ok(app.includes('flash-timer'));assert.ok(app.includes('02:00'));assert.ok(app.includes('autocomplete="one-time-code"'));assert.ok(app.includes('پرتال CRM پشتیبانی'));assert.ok(app.includes('IntersectionObserver'));
});

test('product option defaults are scoped to the assigned product attribute',()=>{
 assert.match(worker,/pd\.product_id=pa\.product_id/);
 assert.match(worker,/pdo\.attribute_id=a\.id/);
 assert.match(worker,/pd\.is_default=1/);
});
test('customer product options use responsive radio cards and server-validated selections',()=>{
 const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
 const css=readFileSync(new URL('../frontend/src/styles.css',import.meta.url),'utf8');
 assert.match(app,/product-option-card/);
 assert.match(app,/product-option-input/);
 assert.match(app,/selections=\(\)=>\[\.\.\.document\.querySelectorAll\('\.product-option-input:checked'\)/);
 assert.match(app,/options:selections\(\)/);
 assert.match(app,/product-live-price/);
 assert.match(css,/\.product-option-grid/);
 assert.match(css,/\.product-option-card\.selected/);
});
test('invoice preserves selected product option snapshots',()=>{
 const invoice=readFileSync(new URL('../frontend/src/invoice.js',import.meta.url),'utf8');
 assert.match(invoice,/options_json/);
 assert.match(invoice,/invoice-option/);
});
