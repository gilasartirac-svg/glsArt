const enc=new TextEncoder();
const json=(data,status=200,extra={})=>{const h=new Headers({'content-type':'application/json; charset=utf-8'});for(const[k,v]of Object.entries(extra)){if(Array.isArray(v))v.forEach(x=>h.append(k,x));else h.set(k,v)}return new Response(JSON.stringify(data),{status,headers:h})};
const security={'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-frame-options':'DENY','permissions-policy':'camera=(),microphone=(),geolocation=(),otp-credentials=(self)','strict-transport-security':'max-age=31536000; includeSubDomains','content-security-policy':"default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://payment.zarinpal.com https://sandbox.zarinpal.com"};
const uid=()=>crypto.randomUUID();
function adminBootstrapConfigured(env){return /^09\d{9}$/.test(String(env.ADMIN_BOOTSTRAP_MOBILE||'').replace(/\D/g,''));}
const now=()=>new Date().toISOString();
async function sha(v){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(v)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
function origin(env){return env.APP_ORIGIN||''}
function frontend(env){return (env.FRONTEND_URL||`${origin(env)}/glsArt`).replace(/\/$/,'')}
function cors(req,env){const o=req.headers.get('Origin'); return o&&o===origin(env)?{'access-control-allow-origin':o,'access-control-allow-credentials':'true','access-control-allow-headers':'content-type,x-csrf-token','access-control-allow-methods':'GET,POST,PUT,DELETE,OPTIONS'}:{}}
function cookies(req){const out={};for(const x of (req.headers.get('cookie')||'').split(';')){const [k,...v]=x.trim().split('=');if(k)out[k]=v.join('=')}return out}
async function body(req){return req.json().catch(()=>({}))}
async function user(req,env){const sid=cookies(req)['__Host-gs_session'];if(!sid)return null;return env.DB.prepare("SELECT u.id,u.mobile,u.name FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.revoked_at IS NULL AND unixepoch(s.expires_at)>unixepoch('now')").bind(sid).first()}
async function roles(u,env){
 if(!u)return [];
 const legacy=await env.DB.prepare('SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id=r.id WHERE ur.user_id=?').bind(u.id).all();
 const enterprise=await env.DB.prepare('SELECT ar.name FROM admin_roles ar JOIN admin_users au ON au.role_id=ar.id WHERE au.user_id=? AND au.active=1').bind(u.id).all();
 return [...new Set([
  ...(legacy.results||[]).map(x=>x.name),
  ...(enterprise.results||[]).map(x=>x.name)
 ])];
}

async function permissions(u,env){
 if(!u)return [];
 const r=await env.DB.prepare(`
 SELECT DISTINCT p.name
 FROM permissions p
 JOIN role_permissions rp ON rp.permission_id=p.id
 JOIN admin_roles ar ON ar.id=rp.role_id
 JOIN admin_users au ON au.role_id=ar.id
 WHERE au.user_id=? AND au.active=1
 `).bind(u.id).all();
 return (r.results||[]).map(x=>x.name);
}

async function requirePermission(u,env,name){
 if(!u)return false;
 const pp=await permissions(u,env);
 return pp.includes(name);
}
async function canAssignRole(actor,env,roleId){
 const actorPermissions=new Set(await permissions(actor,env));
 const role=await env.DB.prepare('SELECT id,name FROM admin_roles WHERE id=?').bind(roleId).first();
 if(!role)return {ok:false,error:'role_not_found'};
 const rp=await env.DB.prepare('SELECT p.name FROM permissions p JOIN role_permissions r ON r.permission_id=p.id WHERE r.role_id=?').bind(roleId).all();
 const missing=(rp.results||[]).map(x=>x.name).filter(p=>!actorPermissions.has(p));
 if(missing.length)return {ok:false,error:'role_exceeds_actor_permissions'};
 return {ok:true,role};
}

function csv(rows){
 if(!rows || !rows.length) return '';
 const keys=Object.keys(rows[0]);
 return [
  keys.join(','),
  ...rows.map(r=>keys.map(k=>{
   const v=r[k]??'';
   return '"'+String(v).replaceAll('"','""')+'"';
  }).join(','))
 ].join('\n');
}

async function recordVisitor(req,env,sessionKey){
 const me=await user(req,env),ip=(req.headers.get('CF-Connecting-IP')||'').trim().slice(0,128);if(!sessionKey||!ip)return;
 const country=(req.headers.get('CF-IPCountry')||'').trim().toUpperCase().slice(0,8),ua=(req.headers.get('User-Agent')||'').slice(0,500);
 await env.DB.prepare(`INSERT INTO visitor_sessions(id,session_key,user_id,ip_address,country_code,country_name,last_seen_at,user_agent)
 VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP,?)
 ON CONFLICT(session_key) DO UPDATE SET user_id=excluded.user_id,ip_address=excluded.ip_address,country_code=excluded.country_code,country_name=excluded.country_name,last_seen_at=CURRENT_TIMESTAMP,user_agent=excluded.user_agent`)
 .bind(uid(),sessionKey,me?.id||null,ip,country||null,country||null,ua).run();
}
async function visitorAdminList(req,env){
 const me=await user(req,env);if(!await requirePermission(me,env,'visitors.read'))return json({error:'forbidden'},403);
 const u=new URL(req.url),limit=Math.min(100,Math.max(1,Number(u.searchParams.get('limit')||50))),offset=Math.max(0,Number(u.searchParams.get('offset')||0));
 const r=await env.DB.prepare(`SELECT vs.id,CASE WHEN vs.user_id IS NOT NULL THEN COALESCE(u.mobile,vs.ip_address) ELSE vs.ip_address END visitor,
 vs.ip_address,vs.country_code,vs.country_name,vs.first_seen_at,vs.last_seen_at,
 CASE WHEN datetime(vs.last_seen_at)>=datetime('now','-5 minutes') THEN 1 ELSE 0 END online
 FROM visitor_sessions vs LEFT JOIN users u ON u.id=vs.user_id
 ORDER BY vs.first_seen_at DESC LIMIT ? OFFSET ?`).bind(limit,offset).all();
 const c=await env.DB.prepare('SELECT COUNT(*) n FROM visitor_sessions').first();
 const on=await env.DB.prepare("SELECT COUNT(*) n FROM visitor_sessions WHERE datetime(last_seen_at)>=datetime('now','-5 minutes')").first();
 return json({items:r.results||[],total:Number(c?.n||0),onlineCount:Number(on?.n||0)});
}
async function audit(env,actor,action,type,id,meta,req){
 await env.DB.prepare(
 'INSERT INTO audit_logs(id,actor_user_id,action,entity_type,entity_id,metadata_json,before_json,after_json,ip) VALUES(?,?,?,?,?,?,?,?,?)'
 ).bind(
 uid(),
 actor?.id||null,
 action,
 type||null,
 id||null,
 JSON.stringify(meta||{}),
 JSON.stringify(meta?.before||null),
 JSON.stringify(meta?.after||null),
 req.headers.get('CF-Connecting-IP')||''
 ).run()
}
function requireCsrf(req){return req.headers.get('X-CSRF-Token')&&req.headers.get('X-CSRF-Token')===cookies(req)['gs_csrf']}
async function verifyMathCaptcha(env,token,answer){
 const secret=String(env.OTP_PEPPER||'').trim();
 const raw=String(token||'');
 const a=String(answer||'').trim().replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g,d=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
 if(!secret||!raw||raw.length>4096||!/^[0-9]{1,2}$/.test(a))return false;
 const parts=raw.split('.');
 if(parts.length!==2)return false;
 let payload;
 try{payload=JSON.parse(atob(parts[0].replace(/-/g,'+').replace(/_/g,'/')+'='.repeat((4-parts[0].length%4)%4)))}catch{return false}
 if(!payload||Number(payload.exp||0)<Date.now()||!Number.isInteger(payload.a)||!Number.isInteger(payload.b)||!['+','-'].includes(payload.op)||String(payload.n||'').length<12)return false;
 const expected=payload.op==='+'?payload.a+payload.b:payload.a-payload.b;
 if(Number(a)!==expected)return false;
 const sig=await sha(`${secret}:${parts[0]}:${a}`);
 return sig===parts[1];
}
function makeMathCaptcha(env){
 const raw=new Uint32Array(3);crypto.getRandomValues(raw);
 const a=1+(raw[0]%9),b=1+(raw[1]%9),op='+';
 const payload={a,b,op,n:uid(),exp:Date.now()+5*60*1000};
 const encoded=btoa(JSON.stringify(payload)).replace(/\\+/g,'-').replace(/\\//g,'_').replace(/=+$/,'');
 return sha(`${env.OTP_PEPPER}:${encoded}:${op==='+'?a+b:a-b}`).then(sig=>({question:op==='+'?`${a} + ${b} = ؟`:`${a} − ${b} = ؟`,token:`${encoded}.${sig}`,expiresIn:300}));
}

async function requireUser(req,env){const u=await user(req,env);return u}
function flashSaleValues(b,before={}){
 const active=b.flashSaleActive===true||b.flashSaleActive===1||b.flashSaleActive==='1';
 const end=b.flashSaleEndsAt===undefined?before.flash_sale_ends_at:b.flashSaleEndsAt;
 const price=b.flashSalePriceIrt===undefined?before.flash_sale_price_irt:b.flashSalePriceIrt;
 if(active){const d=new Date(String(end||''));if(!end||Number.isNaN(d.getTime())||d.getTime()<=Date.now())throw new Error('invalid_flash_sale_end');}
 const p=price===null||price===undefined||price===''?null:Math.max(0,Math.trunc(Number(price)||0));
 return {active:active?1:0,end:active?new Date(String(end)).toISOString():null,price:p};
}
function otpSmsMessage(env,code,template){
 const host=new URL(frontend(env)).hostname;
 const base=String(template||'گیلاس آرت\\nکد ورود : {code}').replaceAll('{code}',code).replaceAll('{0}',code).split(/\\r?\\n/).filter(x=>!/^\\s*@[^\\s]+\\s+#\\d{6}\\s*$/.test(x)).join('\\n').trim();
 return `${base}\\n\\n@${host} #${code}`;
}
async function ensureAdminBootstrap(env){
  const bootstrapMobile=String(env.ADMIN_BOOTSTRAP_MOBILE||'').replace(/\D/g,'');
  if(!/^09\d{9}$/.test(bootstrapMobile)) return false;
  try{
    await env.DB.prepare('SELECT is_sample FROM orders LIMIT 1').first();
  }catch{
    try{await env.DB.prepare("ALTER TABLE orders ADD COLUMN is_sample INTEGER NOT NULL DEFAULT 0 CHECK(is_sample IN(0,1))").run()}catch{}
  }
  const statements=[
    env.DB.prepare("INSERT OR IGNORE INTO admin_roles(id,name,description) VALUES('admin-role','admin','دسترسی کامل پنل مدیریت گیلاس آرت')"),
    env.DB.prepare("INSERT OR IGNORE INTO permissions(id,name) VALUES('perm_products_read','products.read'),('perm_products_write','products.write'),('perm_orders_read','orders.read'),('perm_orders_write','orders.write'),('perm_customers_read','customers.read'),('perm_customers_write','customers.write'),('perm_payments_read','payments.read'),('perm_reports_read','reports.read'),('perm_settings_read','settings.read'),('perm_settings_write','settings.write'),('perm_inventory_read','inventory.read'),('perm_inventory_write','inventory.write'),('perm_coupons_read','coupons.read'),('perm_coupons_write','coupons.write'),('perm_reviews_read','reviews.read'),('perm_reviews_write','reviews.write'),('perm_users_write','users.write'),('perm_users_manage','users.manage'),('perm_roles_manage','roles.manage'),('perm_visitors_read','visitors.read')"),
    env.DB.prepare("INSERT OR IGNORE INTO role_permissions(role_id,permission_id) SELECT 'admin-role',id FROM permissions"),
    env.DB.prepare("INSERT OR IGNORE INTO users(id,mobile,name) VALUES(?,?,?)").bind('usr_admin_gilasart',bootstrapMobile,'مدیر گیلاس آرت'),
    env.DB.prepare("INSERT OR REPLACE INTO admin_users(user_id,role_id,active) SELECT id,'admin-role',1 FROM users WHERE mobile=?").bind(bootstrapMobile),
    env.DB.prepare("INSERT OR IGNORE INTO categories(id,slug,name,description,active) VALUES('cat_abstract','abstract','آبستره','آثار انتزاعی با تمرکز بر رنگ، فرم و بافت.',1),('cat_modern','modern','مدرن','تابلوهای مدرن برای فضاهای معاصر.',1),('cat_minimal','minimal','مینیمال','آثار آرام و مینیمال برای دکوراسیون خلوت.',1),('cat_classic','classic','کلاسیک','آثار با حال‌وهوای اصیل و ماندگار.',1)"),
    env.DB.prepare("INSERT OR IGNORE INTO products(id,category_id,slug,sku,name,description,price_irt,active,seo_title,seo_description) VALUES('sample_mehr','cat_abstract','mehr','GA-1001','مهرِ خاک و نور','تابلوی آبستره با ترکیب خاکی، مسی و نور گرم.',8900000,1,'مهر خاک و نور | تابلو آبستره','تابلو آبستره مهر خاک و نور برای دکوراسیون گرم و هنری.'),('sample_shab','cat_modern','shab','GA-1002','شبِ آرام','اثری مدرن با فضای شبانه و نور ماه.',7600000,1,'شب آرام | تابلو مدرن','تابلو مدرن شب آرام با طیف آبی و نور ماه.'),('sample_khak','cat_minimal','khak','GA-1003','هندسه‌ی خاک','ترکیب مینیمال فرم‌های هندسی و رنگ‌های خاکی.',6400000,1,'هندسه خاک | تابلو مینیمال','تابلو مینیمال هندسه خاک برای دکوراسیون مدرن.'),('sample_barg','cat_abstract','barg','GA-1004','رقص برگ‌ها','اثری انتزاعی با خطوط روان و رنگ‌های سبز و طلایی.',9800000,1,'رقص برگ‌ها | اثر هنری','تابلو رقص برگ‌ها با ترکیب سبز و طلایی.'),('sample_sokoot','cat_minimal','sokoot','GA-1005','سکوت روشن','تابلویی مینیمال با فرم‌های روشن و خطوط تیره.',5200000,1,'سکوت روشن | تابلو مینیمال','تابلو مینیمال سکوت روشن.'),('sample_atiq','cat_classic','atiq','GA-1006','عطرِ عتیق','اثری با حال‌وهوای کلاسیک و پالت گرم.',12500000,1,'عطر عتیق | تابلو کلاسیک','تابلو کلاسیک عطر عتیق با پالت گرم.')"),
    env.DB.prepare("INSERT OR IGNORE INTO inventory(product_id,quantity) VALUES('sample_mehr',8),('sample_shab',6),('sample_khak',10),('sample_barg',5),('sample_sokoot',12),('sample_atiq',4)"),
    env.DB.prepare("INSERT OR IGNORE INTO product_images(id,product_id,path,alt_text,sort_order,is_primary) VALUES('img_mehr','sample_mehr','/glsArt/art/mehr.svg','تابلو آبستره مهر خاک و نور',0,1),('img_shab','sample_shab','/glsArt/art/shab.svg','تابلو مدرن شب آرام',0,1),('img_khak','sample_khak','/glsArt/art/khak.svg','تابلو مینیمال هندسه خاک',0,1),('img_barg','sample_barg','/glsArt/art/barg.svg','تابلو رقص برگ‌ها',0,1),('img_sokoot','sample_sokoot','/glsArt/art/sokoot.svg','تابلو مینیمال سکوت روشن',0,1),('img_atiq','sample_atiq','/glsArt/art/atiq.svg','تابلو کلاسیک عطر عتیق',0,1)"),
    env.DB.prepare("INSERT OR IGNORE INTO users(id,mobile,name) VALUES('usr_sample_01','09120000001','مشتری نمونه یک'),('usr_sample_02','09120000002','مشتری نمونه دو'),('usr_sample_03','09120000003','مشتری نمونه سه')"),
    env.DB.prepare("INSERT OR IGNORE INTO orders(id,user_id,status,subtotal_irt,shipping_irt,total_irt,is_sample) VALUES('ord_sample_paid','usr_sample_01','PAID',8900000,500000,9400000,1),('ord_sample_pending','usr_sample_02','PENDING',7600000,500000,8100000,1),('ord_sample_cancelled','usr_sample_03','CANCELLED',6400000,500000,6900000,1)"),
    env.DB.prepare("INSERT OR IGNORE INTO order_items(id,order_id,product_id,sku,name,unit_price_irt,quantity,line_total_irt) VALUES('oi_sample_paid','ord_sample_paid','sample_mehr','GA-1001','مهرِ خاک و نور',8900000,1,8900000),('oi_sample_pending','ord_sample_pending','sample_shab','GA-1002','شبِ آرام',7600000,1,7600000),('oi_sample_cancelled','ord_sample_cancelled','sample_khak','GA-1003','هندسه‌ی خاک',6400000,1,6400000)"),
    env.DB.prepare("INSERT OR IGNORE INTO payments(id,order_id,status,amount_irt,authority,ref_id,paid_at) VALUES('pay_sample_paid','ord_sample_paid','PAID',9400000,'SAMPLE-AUTH-1001','SAMPLE-REF-1001',CURRENT_TIMESTAMP),('pay_sample_pending','ord_sample_pending','CREATED',8100000,'SAMPLE-AUTH-1002',NULL,NULL),('pay_sample_cancelled','ord_sample_cancelled','CANCELLED',6900000,NULL,NULL,NULL)"),
    env.DB.prepare("INSERT OR IGNORE INTO payment_attempts(id,payment_id,authority,request_code,verify_code,callback_status,raw_status) VALUES('attempt_sample_paid','pay_sample_paid','SAMPLE-AUTH-1001',100,100,'OK','SAMPLE'),('attempt_sample_pending','pay_sample_pending','SAMPLE-AUTH-1002',100,NULL,'PENDING','SAMPLE')"),
    env.DB.prepare("INSERT OR IGNORE INTO coupons(id,code,kind,value,max_uses,active,expires_at) VALUES('coupon_sample_10','SAMPLE10','PERCENT',10,100,1,datetime('now','+90 day')),('coupon_sample_fixed','SAMPLE500','FIXED',500000,50,1,datetime('now','+60 day'))"),
    env.DB.prepare("INSERT OR IGNORE INTO reviews(id,user_id,product_id,rating,body,approved) VALUES('review_sample_01','usr_sample_01','sample_mehr',5,'نظر نمونه برای تست مدیریت نظرات.',0),('review_sample_02','usr_sample_02','sample_shab',4,'نظر نمونه دوم برای تست مدیریت نظرات.',0)")
  ];
  await env.DB.batch(statements);
  try{
    await env.DB.prepare("INSERT OR IGNORE INTO site_settings(key,value) VALUES('admin_bootstrap_v1','ready')").run();
  }catch{}
  return true;
}
async function rate(env,key,limit,minutes){const h=await env.DB.prepare('SELECT COUNT(*) n FROM otp_challenges WHERE request_ip=? AND created_at>datetime(\'now\',?)').bind(key,`-${minutes} minutes`).first();return (h?.n||0)<limit}
async function releaseReservation(env,orderId,orderStatus='FAILED'){const r=await env.DB.prepare('SELECT product_id,quantity FROM stock_reservations WHERE order_id=?').bind(orderId).all();const items=r.results||[];if(!items.length)return false;const statements=items.map(x=>env.DB.prepare('UPDATE inventory SET quantity=quantity+?,updated_at=CURRENT_TIMESTAMP WHERE product_id=?').bind(x.quantity,x.product_id));statements.push(env.DB.prepare('DELETE FROM stock_reservations WHERE order_id=?').bind(orderId));statements.push(env.DB.prepare("UPDATE payments SET status='CANCELLED',updated_at=CURRENT_TIMESTAMP WHERE order_id=? AND status!='PAID'").bind(orderId));statements.push(env.DB.prepare('UPDATE orders SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status=\'PENDING\'').bind(orderStatus,orderId));await env.DB.batch(statements);return true}
async function cleanupExpiredReservations(env){const r=await env.DB.prepare("SELECT DISTINCT sr.order_id FROM stock_reservations sr JOIN orders o ON o.id=sr.order_id JOIN payments p ON p.order_id=o.id WHERE o.status='PENDING' AND p.status!='PAID' AND sr.reserved_until<=CURRENT_TIMESTAMP").all();for(const x of (r.results||[])){try{await releaseReservation(env,x.order_id,'FAILED')}catch(e){console.error('reservation_cleanup_failed',x.order_id,e?.message||e)}}}
async function siteSetting(env,key,fallback=''){
  try{const r=await env.DB.prepare('SELECT value FROM site_settings WHERE key=?').bind(key).first();return r?.value ?? fallback}catch{return fallback}
}
async function paymentEnvironment(env){const v=String(await siteSetting(env,'zarinpal_environment',env.PAYMENT_ENV||'production')).toLowerCase();return v==='sandbox'?'sandbox':'production'}

function validVideoUrl(v){
  if(v===null||v===undefined||String(v).trim()==='')return null;
  try{const u=new URL(String(v).trim());return u.protocol==='https:'?u.href:null}catch{return null}
}
async function loadProductAttributes(env,productId){
  const rows=(await env.DB.prepare(`
    SELECT a.id attribute_id,a.name attribute_name,a.active attribute_active,a.sort_order attribute_sort,
           o.id option_id,o.name option_name,o.active option_active,o.is_default,o.price_delta_irt,o.sort_order option_sort
    FROM product_attribute_assignments pa
    JOIN product_attributes a ON a.id=pa.attribute_id
    JOIN product_attribute_options o ON o.attribute_id=a.id
    WHERE pa.product_id=?
    ORDER BY pa.sort_order,a.sort_order,o.sort_order
  `).bind(productId).all()).results||[];
  const map=new Map();
  for(const r of rows){
    if(!map.has(r.attribute_id))map.set(r.attribute_id,{id:r.attribute_id,name:r.attribute_name,active:Number(r.attribute_active)===1,required:true,options:[]});
    if(Number(r.attribute_active)===1&&Number(r.option_active)===1)map.get(r.attribute_id).options.push({
      id:r.option_id,name:r.option_name,is_default:Number(r.is_default)===1,price_delta_irt:Number(r.price_delta_irt||0)
    });
  }
  return [...map.values()].filter(a=>a.active&&a.options.length);
}
async function resolveProductOptions(env,productId,raw){
  let requested=[];
  try{requested=Array.isArray(raw)?raw:raw?JSON.parse(raw):[]}catch{throw new Error('invalid_product_options')}
  if(requested.length>50)throw new Error('invalid_product_options');
  const attrs=await loadProductAttributes(env,productId);
  const byAttr=new Map(attrs.map(a=>[a.id,a]));
  const chosen=new Map();
  for(const x of requested){
    const attributeId=String(x?.attributeId||'');
    const optionId=String(x?.optionId||'');
    if(!attributeId||!optionId||chosen.has(attributeId))throw new Error('invalid_product_options');
    const a=byAttr.get(attributeId),o=a?.options.find(v=>v.id===optionId);
    if(!a||!o)throw new Error('invalid_product_options');
    chosen.set(attributeId,o);
  }
  const normalized=[];
  let adjustment=0;
  for(const a of attrs){
    let o=chosen.get(a.id);
    if(!o)o=a.options.find(v=>v.is_default);
    if(!o){
      if(a.required)throw new Error('product_options_required');
      continue;
    }
    normalized.push({attributeId:a.id,attributeName:a.name,optionId:o.id,optionName:o.name,priceDeltaIrt:Number(o.price_delta_irt||0)});
    adjustment+=Number(o.price_delta_irt||0);
  }
  if(chosen.size!==normalized.length)throw new Error('invalid_product_options');
  return {options:normalized,adjustment_irt:adjustment};
}
async function saveProductAttributeAssignments(env,productId,attributeIds){
  const ids=[...new Set((Array.isArray(attributeIds)?attributeIds:[]).map(x=>String(x||'')).filter(Boolean))].slice(0,50);
  const valid=ids.length?await env.DB.prepare(`SELECT id FROM product_attributes WHERE active=1 AND id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).all():{results:[]};
  const validIds=new Set((valid.results||[]).map(x=>x.id));
  if(validIds.size!==ids.length)throw new Error('invalid_product_attribute');
  const stmts=[env.DB.prepare('DELETE FROM product_attribute_assignments WHERE product_id=?').bind(productId)];
  ids.forEach((id,i)=>stmts.push(env.DB.prepare('INSERT INTO product_attribute_assignments(product_id,attribute_id,required,sort_order) VALUES(?,?,1,?)').bind(productId,id,i+1)));
  if(stmts.length)await env.DB.batch(stmts);
}

async function cartPricing(env,me,couponCode=''){
  const c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();
  if(!c)return {items:[],subtotal_irt:0,automatic_discount_irt:0,coupon_discount_irt:0,discount_irt:0,shipping_irt:0,total_irt:0,coupon:null,discounts:[]};
  const rows=(await env.DB.prepare('SELECT ci.product_id,ci.quantity,ci.options_json,p.sku,p.name,p.price_irt,p.category_id,c.slug category_slug,c.name category_name,pi.path image,i.quantity stock FROM cart_items ci JOIN products p ON p.id=ci.product_id LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 LEFT JOIN inventory i ON i.product_id=p.id WHERE ci.cart_id=? AND p.active=1 ORDER BY p.created_at DESC').bind(c.id).all()).results||[];
  if(!rows.length)return {items:[],subtotal_irt:0,automatic_discount_irt:0,coupon_discount_irt:0,discount_irt:0,shipping_irt:0,total_irt:0,coupon:null,discounts:[]};
  for(const row of rows){
    const resolved=await resolveProductOptions(env,row.product_id,row.options_json);
    row.selected_options=resolved.options;
    row.option_adjustment_irt=resolved.adjustment_irt;
    row.unit_price_irt=Number(row.price_irt||0)+resolved.adjustment_irt;
  }
  const subtotal=rows.reduce((s,x)=>s+Number(x.unit_price_irt||0)*Number(x.quantity||0),0);
  const discounts=(await env.DB.prepare("SELECT * FROM discounts WHERE active=1 AND (starts_at IS NULL OR starts_at<=CURRENT_TIMESTAMP) AND (ends_at IS NULL OR ends_at>=CURRENT_TIMESTAMP) AND (max_uses IS NULL OR usage_count<max_uses) ORDER BY created_at DESC").all()).results||[];
  const dp=(await env.DB.prepare('SELECT discount_id,product_id FROM discount_products').all()).results||[],dc=(await env.DB.prepare('SELECT discount_id,category_id FROM discount_categories').all()).results||[];
  const productTargets=new Map(),categoryTargets=new Map();
  for(const x of dp){if(!productTargets.has(x.discount_id))productTargets.set(x.discount_id,new Set());productTargets.get(x.discount_id).add(x.product_id)}
  for(const x of dc){if(!categoryTargets.has(x.discount_id))categoryTargets.set(x.discount_id,new Set());categoryTargets.get(x.discount_id).add(x.category_id)}
  const chosen=new Map(),usedGlobalFixed=new Set();
  for(const row of rows){
    const base=Number(row.unit_price_irt||0)*Number(row.quantity||0);let best=null;
    for(const d of discounts){
      if(subtotal<Number(d.min_order_irt||0))continue;
      const pt=productTargets.get(d.id),ct=categoryTargets.get(d.id),targeted=pt?.has(row.product_id)||ct?.has(row.category_id),global=!pt?.size&&!ct?.size;
      if(!targeted&&!global)continue;
      if(global&&d.kind==='FIXED'&&usedGlobalFixed.has(d.id))continue;
      const amount=d.kind==='PERCENT'?Math.floor(base*Math.min(100,Number(d.value||0))/100):Math.min(base,Math.max(0,Number(d.value||0)));
      if(amount>0&&(!best||amount>best.amount)){best={id:d.id,title:d.title,amount};if(global&&d.kind==='FIXED')usedGlobalFixed.add(d.id)}
    }
    if(best)chosen.set(row.product_id,best);
  }
  const automaticDiscount=Array.from(chosen.values()).reduce((s,x)=>s+x.amount,0);
  let coupon=null,couponDiscount=0;const code=String(couponCode||'').trim().toUpperCase();
  if(code){
    const cpn=await env.DB.prepare('SELECT * FROM coupons WHERE code=?').bind(code).first();if(!cpn)throw new Error('coupon_not_found');
    const nowOk=Number(cpn.active)===1&&(!cpn.starts_at||new Date(cpn.starts_at).getTime()<=Date.now())&&(!cpn.expires_at||new Date(cpn.expires_at).getTime()>=Date.now());
    if(!nowOk)throw new Error('coupon_expired_or_inactive');
    if(subtotal<Number(cpn.min_order_irt||0))throw new Error('coupon_min_order');
    if(cpn.max_uses!==null&&cpn.max_uses!==undefined){const used=await env.DB.prepare('SELECT COUNT(*) n FROM coupon_usages WHERE coupon_id=?').bind(cpn.id).first();if(Number(used?.n||0)>=Number(cpn.max_uses))throw new Error('coupon_usage_limit')}
    if(await env.DB.prepare('SELECT 1 FROM coupon_usages WHERE coupon_id=? AND user_id=?').bind(cpn.id,me.id).first())throw new Error('coupon_already_used');
    const cp=(await env.DB.prepare('SELECT product_id FROM coupon_products WHERE coupon_id=?').bind(cpn.id).all()).results||[],cc=(await env.DB.prepare('SELECT category_id FROM coupon_categories WHERE coupon_id=?').bind(cpn.id).all()).results||[];
    const cps=new Set(cp.map(x=>x.product_id)),ccs=new Set(cc.map(x=>x.category_id));
    const eligible=rows.filter(x=>(!cps.size&&!ccs.size)||cps.has(x.product_id)||ccs.has(x.category_id)),eligibleBase=eligible.reduce((s,x)=>s+Number(x.unit_price_irt||0)*Number(x.quantity||0),0);
    if(!eligibleBase)throw new Error('coupon_not_applicable');
    const couponBase=Math.max(0,eligibleBase-automaticDiscount);
    couponDiscount=cpn.kind==='PERCENT'?Math.floor(couponBase*Math.min(100,Number(cpn.value||0))/100):Math.min(couponBase,Math.max(0,Number(cpn.value||0)));
    coupon={id:cpn.id,code:cpn.code,kind:cpn.kind,value:cpn.value,discount_irt:couponDiscount};
  }
  const appliedDiscounts=new Map();for(const d of chosen.values()){const x=appliedDiscounts.get(d.id)||{id:d.id,title:d.title,amount:0};x.amount+=d.amount;appliedDiscounts.set(d.id,x)}
  const discountIrt=Math.min(subtotal,automaticDiscount+couponDiscount),shipping=subtotal>=10000000?0:500000,total=Math.max(0,subtotal-discountIrt+shipping);
  return {items:rows,subtotal_irt:subtotal,automatic_discount_irt:automaticDiscount,coupon_discount_irt:couponDiscount,discount_irt:discountIrt,shipping_irt:shipping,total_irt:total,coupon,discounts:Array.from(appliedDiscounts.values())};
}
function promotionErrorCode(e){const c=String(e?.message||'');return ['coupon_not_found','coupon_expired_or_inactive','coupon_min_order','coupon_usage_limit','coupon_already_used','coupon_not_applicable'].includes(c)?c:null}
function allowedImagePath(v){try{const s=String(v||'').trim();if(s.startsWith('/glsArt/art/'))return true;const u=new URL(s);return u.protocol==='https:'&&u.hostname==='raw.githubusercontent.com'&&((u.pathname.startsWith('/gilasartirac-svg/gls-media/main/image/')&&/\.(png|jpe?g|webp|gif|svg)$/i.test(u.pathname))||(u.pathname.startsWith('/gilasartirac-svg/glsArt/main/frontend/public/art/')&&/\.(png|jpe?g|webp|gif|svg)$/i.test(u.pathname)))}catch{return false}}

async function zarin(env,endpoint,payload){const mode=await paymentEnvironment(env);const base=mode==='production'?'https://api.zarinpal.com/pg/v4/payment':'https://sandbox.zarinpal.com/pg/v4/payment';const r=await fetch(base+'/'+endpoint,{method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({...payload,merchant_id:env.ZARINPAL_MERCHANT_ID})});return r.json()}
async function route(req,env){const u=new URL(req.url);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req,env)});
 if(u.pathname==='/api/visitors/heartbeat'&&req.method==='POST'){
  const b=await body(req),key=String(b.sessionKey||'').replace(/[^A-Za-z0-9_-]/g,'').slice(0,80);
  if(key.length<16)return json({error:'invalid_session_key'},400);
  await recordVisitor(req,env,key);return json({ok:true});
 }
 if(u.pathname==='/api/admin/visitors'&&req.method==='GET')return visitorAdminList(req,env);
 if(u.pathname==='/api/health')return json({ok:true,service:'gilasartworker',db:!!env.DB,paymentEnv:env.PAYMENT_ENV||'sandbox',smsConfigured:!!env.KAVENEGAR_API_KEY,smsSenderConfigured:!!String(env.KAVENEGAR_SENDER||'')});
 if(u.pathname==='/api/categories'&&req.method==='GET'){const r=await env.DB.prepare('SELECT id,slug,name,description FROM categories WHERE active=1 ORDER BY name').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/products'&&req.method==='GET'){const q=(u.searchParams.get('q')||'').trim(),cat=u.searchParams.get('category'),limit=Math.min(60,Math.max(1,Number(u.searchParams.get('limit')||12))),offset=Math.max(0,Math.min(10000,Number(u.searchParams.get('offset')||0)));let sql='SELECT p.id,p.slug,p.sku,p.name,p.description,p.price_irt,p.category_id,p.flash_sale_active,p.flash_sale_ends_at,p.flash_sale_price_irt,p.video_url,pi.path image FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE p.active=1';const args=[];if(q){sql+=' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';args.push(`%${q}%`,`%${q}%`,`%${q}%`)}if(cat){sql+=' AND p.category_id=?';args.push(cat)}sql+=' ORDER BY p.created_at DESC,p.id DESC LIMIT ? OFFSET ?';args.push(limit,offset);const r=await env.DB.prepare(sql).bind(...args).all();return json({items:r.results||[],limit,offset})}
 if(u.pathname.startsWith('/api/products/')&&req.method==='GET'){const slug=decodeURIComponent(u.pathname.split('/').pop());const p=await env.DB.prepare('SELECT p.*,c.name category_name,pi.path image FROM products p LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE p.slug=? AND p.active=1').bind(slug).first();if(!p)return json({error:'not_found'},404);const images=(await env.DB.prepare('SELECT path,alt_text,sort_order,is_primary FROM product_images WHERE product_id=? ORDER BY sort_order,is_primary DESC').bind(p.id).all()).results||[];const attributes=await loadProductAttributes(env,p.id);const reviews=await env.DB.prepare('SELECT r.rating,r.body,r.created_at,u.name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? AND r.approved=1 ORDER BY r.created_at DESC').bind(p.id).all();return json({product:p,images,attributes,reviews:reviews.results||[]})}
 if(u.pathname==='/api/flash-sales'&&req.method==='GET'){const r=await env.DB.prepare("SELECT p.id,p.slug,p.sku,p.name,p.description,p.price_irt,p.flash_sale_price_irt,p.flash_sale_ends_at,pi.path image FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE p.active=1 AND p.flash_sale_active=1 AND p.flash_sale_ends_at IS NOT NULL AND julianday(p.flash_sale_ends_at)>julianday('now') ORDER BY p.flash_sale_ends_at ASC,p.created_at DESC LIMIT 20").all();return json({items:r.results||[]})}

 if(u.pathname==='/api/security/captcha'&&req.method==='GET'){if(!env.OTP_PEPPER)return json({error:'captcha_not_configured'},503);return json(await makeMathCaptcha(env))}
 if(u.pathname==='/api/auth/request-otp'&&req.method==='POST'){if(!env.OTP_PEPPER)return json({error:'otp_not_configured'},503);const b=await body(req);if(!await verifyMathCaptcha(env,b.captchaToken,b.captchaAnswer))return json({error:'captcha_failed'},403);const mobile=String(b.mobile||'').replace(/\D/g,''),ip=req.headers.get('CF-Connecting-IP')||'unknown';if(!/^09\d{9}$/.test(mobile))return json({error:'invalid_mobile'},400);const okM=await rate(env,mobile,3,10),okI=await rate(env,ip,12,10);if(!okM||!okI)return json({error:'rate_limited'},429);const raw=new Uint32Array(1);crypto.getRandomValues(raw);const code=String(100000+(raw[0]%900000));const challenge=uid();await env.DB.prepare('INSERT INTO otp_challenges(id,mobile,code_hash,expires_at,request_ip) VALUES(?,?,?,?,?)').bind(challenge,mobile,await sha(`${env.OTP_PEPPER}:${code}`),new Date(Date.now()+120000).toISOString(),ip).run();if(env.KAVENEGAR_API_KEY){const template=String(await siteSetting(env,'kavenegar_message_template','گیلاس آرت\\nکد ورود : {code}')).slice(0,500);const message=template.replaceAll('{code}',code).replaceAll('{0}',code);const sender=String(await siteSetting(env,'kavenegar_sender',env.KAVENEGAR_SENDER||'')).slice(0,50);if(!sender)return json({error:'sms_sender_not_configured'},503);const p=new URLSearchParams({receptor:mobile,message,sender});let sr;try{sr=await fetch(`https://api.kavenegar.com/v1/${env.KAVENEGAR_API_KEY}/sms/send.json`,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:p})}catch(e){console.error('kavenegar_network_error',e?.message||e);return json({error:'sms_unavailable'},502)}let sj=null;try{sj=await sr.json()}catch{}const rs=Number(sj?.return?.status);if(!sr.ok||!Number.isFinite(rs)||rs!==200){console.error('kavenegar_rejected',JSON.stringify({httpStatus:sr.status,returnStatus:Number.isFinite(rs)?rs:null,returnMessage:sj?.return?.message||null,senderConfigured:!!sender}));return json({error:'sms_provider_rejected'},502)}}else return json({error:'otp_provider_not_configured'},503);return json({ok:true,challengeId:challenge,expiresIn:120})}
 if(u.pathname==='/api/auth/verify-otp'&&req.method==='POST'){const b=await body(req),c=await env.DB.prepare("SELECT * FROM otp_challenges WHERE id=? AND consumed_at IS NULL AND unixepoch(expires_at)>unixepoch('now')").bind(String(b.challengeId||'')).first();if(!c||c.attempts>=5)return json({error:'invalid_or_locked'},400);const ok=await sha(`${env.OTP_PEPPER}:${String(b.code||'')}`)===c.code_hash;await env.DB.prepare('UPDATE otp_challenges SET attempts=attempts+1 WHERE id=?').bind(c.id).run();if(!ok)return json({error:'invalid_or_locked'},400);let u0=await env.DB.prepare('SELECT id,mobile,name FROM users WHERE mobile=?').bind(c.mobile).first();if(!u0){u0={id:uid(),mobile:c.mobile};await env.DB.prepare('INSERT INTO users(id,mobile) VALUES(?,?)').bind(u0.id,u0.mobile).run()}const sid=uid(),csrf=uid().replaceAll('-','');await env.DB.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,datetime('now','+30 days'))").bind(sid,u0.id).run();await env.DB.prepare("UPDATE otp_challenges SET consumed_at=datetime('now') WHERE id=?").bind(c.id).run();return json({ok:true,user:u0,roles:await roles(u0,env),permissions:await permissions(u0,env),csrfToken:csrf},200,{'set-cookie':[`__Host-gs_session=${sid}; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=2592000`,`gs_csrf=${csrf}; Path=/; Secure; SameSite=None; Partitioned; Max-Age=2592000`]})}
 if(u.pathname==='/api/me'&&req.method==='GET'){if(adminBootstrapConfigured(env)){try{await ensureAdminBootstrap(env)}catch(e){console.error('admin bootstrap failed',e?.message||e)}}const u0=await user(req,env);const csrfToken=cookies(req)['gs_csrf']||null;return json({user:u0,roles:await roles(u0,env),permissions:await permissions(u0,env),csrfToken})}
 if(u.pathname==='/api/auth/logout'&&req.method==='POST'){if(!requireCsrf(req))return json({error:'forbidden'},403);const sid=cookies(req)['__Host-gs_session'];if(sid)await env.DB.prepare("UPDATE sessions SET revoked_at=datetime('now') WHERE id=?").bind(sid).run();return json({ok:true},200,{'set-cookie':['__Host-gs_session=; Path=/; HttpOnly; Secure; SameSite=None; Partitioned; Max-Age=0','gs_csrf=; Path=/; Secure; SameSite=None; Partitioned; Max-Age=0']})}
 const me=await requireUser(req,env);
 if(u.pathname==='/api/site-rules'&&req.method==='GET'){
 const r=await env.DB.prepare("SELECT key,value,updated_at FROM site_settings WHERE key IN ('site_rules_title','site_rules_body') ORDER BY key").all();
 const rows=r.results||[],map=Object.fromEntries(rows.map(x=>[x.key,x.value])),updated=rows.map(x=>x.updated_at).filter(Boolean).sort().pop()||null;
 return json({item:{title:map.site_rules_title||'قوانین سایت',body:map.site_rules_body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.',updated_at:updated}});
}

if(u.pathname.startsWith('/api/content/')&&req.method==='GET'){
  const parts=u.pathname.split('/').filter(Boolean);const section=String(parts[2]||'').toLowerCase(),slug=decodeURIComponent(parts.slice(3).join('/'));if(!['news','articles'].includes(section)||!slug)return json({error:'invalid_content'},400);const x=await env.DB.prepare('SELECT id,section,title,slug,summary,body,phone,mobile,address,map_url,active,published_at,sort_order,created_at,updated_at FROM cms_entries WHERE section=? AND slug=? AND active=1').bind(section,slug).first();if(!x)return json({error:'not_found'},404);return json({item:x});
 }
 if(u.pathname.startsWith('/api/content')&&req.method==='GET'){
  const section=String(u.searchParams.get('section')||'').trim().toLowerCase();
  if(!['about','contact','news','articles'].includes(section))return json({error:'invalid_section'},400);
  const limit=Math.min(20,Math.max(1,Number(u.searchParams.get('limit')||8))),offset=Math.max(0,Number(u.searchParams.get('offset')||0)),q=String(u.searchParams.get('q')||'').trim();
  let sql='SELECT id,section,title,slug,summary,body,phone,mobile,address,map_url,active,published_at,sort_order,created_at,updated_at FROM cms_entries WHERE section=? AND active=1';const args=[section];
  if(q){sql+=' AND (title LIKE ? OR summary LIKE ? OR body LIKE ?)';const like='%'+q+'%';args.push(like,like,like)}
  sql+=' ORDER BY published_at DESC,created_at DESC LIMIT ? OFFSET ?';args.push(limit,offset);
  const r=await env.DB.prepare(sql).bind(...args).all();return json({items:r.results||[],limit,offset,hasMore:(r.results||[]).length===limit});
 }
 
 if(u.pathname==='/api/faq'&&req.method==='GET'){const r=await env.DB.prepare('SELECT id,question,answer FROM faq_entries WHERE active=1 ORDER BY sort_order ASC,created_at ASC').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/support/tickets'&&req.method==='GET'){
  if(!me)return json({error:'unauthorized'},401);
  const limit=Math.min(50,Math.max(1,Number(u.searchParams.get('limit')||20))),offset=Math.max(0,Number(u.searchParams.get('offset')||0));
  const r=await env.DB.prepare('SELECT id,subject,category,priority,status,stage,created_at,updated_at,closed_at FROM support_tickets WHERE user_id=? ORDER BY updated_at DESC LIMIT ? OFFSET ?').bind(me.id,limit,offset).all();return json({items:r.results||[],hasMore:(r.results||[]).length===limit});
 }
 if(u.pathname==='/api/support/tickets'&&req.method==='POST'){
  if(!me)return json({error:'unauthorized'},401);if(!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req);if(!await verifyMathCaptcha(env,b.captchaToken,b.captchaAnswer))return json({error:'captcha_failed'},403);const subject=String(b.subject||'').trim().slice(0,180),bodyText=String(b.message||'').trim().slice(0,10000),category=String(b.category||'عمومی').trim().slice(0,60),priority=['low','normal','high'].includes(String(b.priority))?String(b.priority):'normal';if(!subject||!bodyText)return json({error:'invalid_ticket'},400);const id=uid();await env.DB.batch([env.DB.prepare('INSERT INTO support_tickets(id,user_id,subject,category,priority,status,stage) VALUES(?,?,?,?,?,\'open\',\'ثبت شده\')').bind(id,me.id,subject,category,priority),env.DB.prepare('INSERT INTO ticket_messages(id,ticket_id,user_id,author_type,body) VALUES(?,?,?,\'customer\',?)').bind(uid(),id,me.id,bodyText)]);return json({ok:true,id});
 }
 if(u.pathname.startsWith('/api/support/tickets/')&&req.method==='GET'){
  if(!me)return json({error:'unauthorized'},401);const id=u.pathname.split('/').pop(),t=await env.DB.prepare('SELECT id,subject,category,priority,status,stage,created_at,updated_at,closed_at FROM support_tickets WHERE id=? AND user_id=?').bind(id,me.id).first();if(!t)return json({error:'not_found'},404);const m=await env.DB.prepare('SELECT id,author_type,body,created_at FROM ticket_messages WHERE ticket_id=? ORDER BY created_at ASC').bind(id).all();return json({ticket:t,messages:m.results||[]});
 }
 if(u.pathname.startsWith('/api/support/tickets/')&&req.method==='POST'){
  if(!me)return json({error:'unauthorized'},401);if(!requireCsrf(req))return json({error:'forbidden'},403);const pre=await body(req);if(!await verifyMathCaptcha(env,pre.captchaToken,pre.captchaAnswer))return json({error:'captcha_failed'},403);const id=u.pathname.split('/').pop(),t=await env.DB.prepare('SELECT id,status FROM support_tickets WHERE id=? AND user_id=?').bind(id,me.id).first();if(!t)return json({error:'not_found'},404);if(t.status==='closed')return json({error:'ticket_closed'},409);const b=await body(req),bodyText=String(b.message||'').trim().slice(0,10000);if(!bodyText)return json({error:'invalid_message'},400);await env.DB.batch([env.DB.prepare('INSERT INTO ticket_messages(id,ticket_id,user_id,author_type,body) VALUES(?,?,?,\'customer\',?)').bind(uid(),id,me.id,bodyText),env.DB.prepare("UPDATE support_tickets SET stage='در انتظار بررسی',updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(id)]);return json({ok:true});
 }
 if(u.pathname==='/api/admin/tickets'&&req.method==='GET'){if(!(await requirePermission(me,env,'support.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT t.*,u.mobile FROM support_tickets t JOIN users u ON u.id=t.user_id ORDER BY t.updated_at DESC LIMIT 500').all();return json({items:r.results||[]})}
 if(u.pathname.startsWith('/api/admin/tickets/')&&req.method==='GET'){if(!(await requirePermission(me,env,'support.read')))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),t=await env.DB.prepare('SELECT t.*,u.mobile FROM support_tickets t JOIN users u ON u.id=t.user_id WHERE t.id=?').bind(id).first();if(!t)return json({error:'not_found'},404);const m=await env.DB.prepare('SELECT id,author_type,body,created_at FROM ticket_messages WHERE ticket_id=? ORDER BY created_at ASC').bind(id).all();return json({ticket:t,messages:m.results||[]})}
 if(u.pathname.startsWith('/api/admin/tickets/')&&req.method==='POST'){if(!(await requirePermission(me,env,'support.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),t=await env.DB.prepare('SELECT * FROM support_tickets WHERE id=?').bind(id).first();if(!t)return json({error:'not_found'},404);const b=await body(req),message=String(b.message||'').trim().slice(0,10000),status=['open','closed'].includes(String(b.status))?String(b.status):t.status,stage=String(b.stage||'پاسخ داده شد').slice(0,80);const stm=[env.DB.prepare("UPDATE support_tickets SET status=?,stage=?,updated_at=CURRENT_TIMESTAMP,closed_at=CASE WHEN ?='closed' THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id=?").bind(status,stage,status,id)];if(message)stm.push(env.DB.prepare("INSERT INTO ticket_messages(id,ticket_id,user_id,author_type,body) VALUES(?,?,?, 'admin',?)").bind(uid(),id,me.id,message));await env.DB.batch(stm);return json({ok:true})}

 if(u.pathname.startsWith('/api/admin')){
  if(!me)return json({error:'unauthorized'},401);
  if(adminBootstrapConfigured(env)){try{await ensureAdminBootstrap(env)}catch(e){console.error('admin bootstrap failed',e?.message||e)}}
  if(!(await requirePermission(me,env,'settings.read')))return json({error:'forbidden'},403);
}

 if(u.pathname==='/api/admin/me'&&req.method==='GET'){
  if(!me)return json({error:'unauthorized'},401);
  return json({
   user:me,
   roles:await roles(me,env),
   permissions:await permissions(me,env)
  });
 }


 if(u.pathname==='/api/admin/permissions'&&req.method==='GET'){
  if(!me)return json({error:'unauthorized'},401);
  return json({items:await permissions(me,env)});
 }


 if(u.pathname==='/api/admin/roles'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'roles.manage')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(
   'SELECT id,name,description FROM admin_roles ORDER BY name'
  ).all();

  return json({items:r.results||[]});
 }


 if(u.pathname.startsWith('/api/admin/users/') &&
    u.pathname.endsWith('/roles') &&
    req.method==='POST'){

  if(!(await requirePermission(me,env,'roles.manage'))||!requireCsrf(req))
   return json({error:'forbidden'},403);

  const id=u.pathname.split('/')[4];
  const b=await body(req);
  if(!b.roleId)return json({error:'role_required'},400);
  if(id===me.id)return json({error:'self_role_change_forbidden'},403);
  const target=await env.DB.prepare('SELECT id FROM users WHERE id=?').bind(id).first();
  if(!target)return json({error:'user_not_found'},404);
  const allowed=await canAssignRole(me,env,String(b.roleId));
  if(!allowed.ok)return json({error:allowed.error},allowed.error==='role_not_found'?404:403);

  const before=await env.DB.prepare(
   'SELECT * FROM admin_users WHERE user_id=?'
  ).bind(id).first();


  await env.DB.prepare(
   'INSERT OR REPLACE INTO admin_users(user_id,role_id,active) VALUES(?,?,1)'
  ).bind(id,String(b.roleId)).run();


  await audit(
   env,
   me,
   'admin.role.assign',
   'user',
   id,
   {
    before,
    after:{roleId:b.roleId}
   },
   req
  );

  return json({ok:true});
 }


 if(u.pathname.startsWith('/api/admin/users/') &&
    u.pathname.endsWith('/status') &&
    req.method==='PUT'){

  if(!(await requirePermission(me,env,'users.manage'))||!requireCsrf(req))
   return json({error:'forbidden'},403);

  const id=u.pathname.split('/')[4];
  const b=await body(req);
  if(id===me.id && !b.active)return json({error:'self_deactivation_forbidden'},403);
  const target=await env.DB.prepare('SELECT id FROM users WHERE id=?').bind(id).first();
  if(!target)return json({error:'user_not_found'},404);

  const before=await env.DB.prepare(
   'SELECT * FROM admin_users WHERE user_id=?'
  ).bind(id).first();
  if(!before)return json({error:'admin_user_not_found'},404);


  await env.DB.prepare(
   'UPDATE admin_users SET active=? WHERE user_id=?'
  ).bind(b.active?1:0,id).run();


  await audit(
   env,
   me,
   'admin.user.status',
   'user',
   id,
   {
    before,
    after:{active:b.active}
   },
   req
  );

  return json({ok:true});
 }


 if(u.pathname==='/api/addresses'&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const b=await body(req);if(!b.recipientName||!b.province||!b.city||!b.address||!b.postalCode)return json({error:'invalid_address'},400);const aid=uid();await env.DB.prepare('INSERT INTO addresses(id,user_id,title,recipient_name,mobile,province,city,address,postal_code) VALUES(?,?,?,?,?,?,?,?,?)').bind(aid,me.id,b.title||'آدرس اصلی',String(b.recipientName).slice(0,120),me.mobile,String(b.province).slice(0,80),String(b.city).slice(0,80),String(b.address).slice(0,500),String(b.postalCode).replace(/\D/g,'').slice(0,10)).run();return json({ok:true,addressId:aid})}
 if(u.pathname==='/api/addresses'&&req.method==='GET'){if(!me)return json({items:[]});const r=await env.DB.prepare('SELECT id,title,recipient_name,mobile,province,city,address,postal_code FROM addresses WHERE user_id=? ORDER BY created_at DESC').bind(me.id).all();return json({items:r.results||[]})}
 if(u.pathname.startsWith('/api/products/')&&u.pathname.endsWith('/reviews')&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const slug=u.pathname.split('/')[3],p=await env.DB.prepare('SELECT id FROM products WHERE slug=? AND active=1').bind(slug).first();if(!p)return json({error:'not_found'},404);const b=await body(req);if(!await verifyMathCaptcha(env,b.captchaToken,b.captchaAnswer))return json({error:'captcha_failed'},403);const rating=Number(b.rating),txt=String(b.body||'').trim();if(!Number.isInteger(rating)||rating<1||rating>5||txt.length<3||txt.length>1000)return json({error:'invalid_review'},400);await env.DB.prepare('INSERT INTO reviews(id,user_id,product_id,rating,body,approved) VALUES(?,?,?,?,?,0)').bind(uid(),me.id,p.id,rating,txt).run();return json({ok:true})}

 if(u.pathname==='/api/cart'&&req.method==='GET'){if(!me)return json({items:[],subtotal_irt:0,discount_irt:0,shipping_irt:0,total_irt:0});try{return json(await cartPricing(env,me,''))}catch(e){return json({error:'cart_pricing_failed'},500)}}
 if(u.pathname==='/api/cart/price'&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const b=await body(req),code=String(b.code||'').trim().toUpperCase();if(!code)return json({error:'coupon_required'},400);try{return json(await cartPricing(env,me,code))}catch(e){const c=promotionErrorCode(e);if(c)return json({error:c},400);return json({error:'cart_pricing_failed'},500)}}
 if(u.pathname==='/api/cart'&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const b=await body(req),pid=String(b.productId||''),qty=Math.max(1,Math.min(99,Number(b.quantity)||1));const p=await env.DB.prepare('SELECT id FROM products WHERE id=? AND active=1').bind(pid).first();if(!p)return json({error:'product_not_found'},404);let resolved;try{resolved=await resolveProductOptions(env,pid,b.options||[])}catch(e){return json({error:e.message||'invalid_product_options'},400)}let c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(!c){c={id:uid()};await env.DB.prepare('INSERT INTO carts(id,user_id) VALUES(?,?)').bind(c.id,me.id).run()}await env.DB.prepare('INSERT INTO cart_items(cart_id,product_id,quantity,options_json) VALUES(?,?,?,?) ON CONFLICT(cart_id,product_id) DO UPDATE SET quantity=excluded.quantity,options_json=excluded.options_json').bind(c.id,pid,qty,JSON.stringify(resolved.options)).run();return json({ok:true,unitPriceIrt:Number((await env.DB.prepare('SELECT price_irt FROM products WHERE id=?').bind(pid).first())?.price_irt||0)+resolved.adjustment_irt,options:resolved.options})}
 if(u.pathname==='/api/cart'&&req.method==='DELETE'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const pid=u.searchParams.get('productId');const c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(c&&pid)await env.DB.prepare('DELETE FROM cart_items WHERE cart_id=? AND product_id=?').bind(c.id,pid).run();return json({ok:true})}
 if(u.pathname==='/api/orders'&&req.method==='POST'){
  if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);
  const b=await body(req),addressId=String(b.addressId||''),couponCode=String(b.couponCode||'').trim().toUpperCase();
  const a=await env.DB.prepare('SELECT * FROM addresses WHERE id=? AND user_id=?').bind(addressId,me.id).first();
  if(!a)return json({error:'address_required'},400);
  const c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(!c)return json({error:'empty_cart'},400);
  let pricing;try{pricing=await cartPricing(env,me,couponCode)}catch(e){const code=promotionErrorCode(e);if(code)return json({error:code},400);throw e}
  const rows=pricing.items||[];if(!rows.length)return json({error:'empty_cart'},400);if(rows.some(x=>Number(x.quantity)>Number(x.stock||0)))return json({error:'insufficient_stock'},409);
  const checkoutKey=String(b.idempotencyKey||'').trim();if(!/^[A-Za-z0-9_-]{16,128}$/.test(checkoutKey))return json({error:'idempotency_key_required'},400);
  const existing=await env.DB.prepare('SELECT id,total_irt FROM orders WHERE user_id=? AND checkout_key=?').bind(me.id,checkoutKey).first();if(existing)return json({ok:true,orderId:existing.id,total_irt:existing.total_irt,reused:true});
  const oid=uid(),pay=uid(),reservedUntil=new Date(Date.now()+2*60*60*1000).toISOString(),discounts=pricing.discounts||[],stmts=[];
  stmts.push(env.DB.prepare("INSERT INTO stock_reservations(order_id,product_id,quantity,reserved_until) SELECT ?,ci.product_id,ci.quantity,? FROM cart_items ci JOIN inventory i ON i.product_id=ci.product_id WHERE ci.cart_id=? AND i.quantity>=ci.quantity").bind(oid,reservedUntil,c.id));
  for(const d of discounts)stmts.push(env.DB.prepare("INSERT INTO discount_usages(discount_id,user_id,order_id,discount_irt) SELECT ?,?,?,? WHERE (SELECT max_uses FROM discounts WHERE id=?) IS NULL OR (SELECT usage_count FROM discounts WHERE id=?) < (SELECT max_uses FROM discounts WHERE id=?)").bind(d.id,me.id,oid,d.amount,d.id,d.id,d.id));
  if(pricing.coupon)stmts.push(env.DB.prepare("INSERT INTO coupon_usages(coupon_id,user_id,order_id) SELECT ?,?,? WHERE NOT EXISTS(SELECT 1 FROM coupon_usages WHERE coupon_id=? AND user_id=?) AND ((SELECT max_uses FROM coupons WHERE id=?) IS NULL OR (SELECT COUNT(*) FROM coupon_usages WHERE coupon_id=?) < (SELECT max_uses FROM coupons WHERE id=?))").bind(pricing.coupon.id,me.id,oid,pricing.coupon.id,me.id,pricing.coupon.id,pricing.coupon.id,pricing.coupon.id));
  let orderSql="INSERT INTO orders(id,user_id,address_id,status,subtotal_irt,shipping_irt,total_irt,checkout_key,discount_irt,coupon_id,coupon_code) SELECT ?,?,?, 'PENDING',?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM stock_reservations WHERE order_id=?)=?";
  const orderArgs=[oid,me.id,addressId,pricing.subtotal_irt,pricing.shipping_irt,pricing.total_irt,checkoutKey,pricing.discount_irt,pricing.coupon?.id||null,pricing.coupon?.code||null,oid,rows.length];
  for(const d of discounts){orderSql+=" AND (SELECT COUNT(*) FROM discount_usages WHERE order_id=? AND discount_id=?)=1";orderArgs.push(oid,d.id)}
  if(pricing.coupon){orderSql+=" AND (SELECT COUNT(*) FROM coupon_usages WHERE order_id=? AND coupon_id=?)=1";orderArgs.push(oid,pricing.coupon.id)}
  stmts.push(env.DB.prepare(orderSql).bind(...orderArgs));
  for(const x of rows)stmts.push(env.DB.prepare('INSERT INTO order_items(id,order_id,product_id,sku,name,unit_price_irt,quantity,line_total_irt,options_json) VALUES(?,?,?,?,?,?,?,?,?)').bind(uid(),oid,x.product_id,x.sku,x.name,x.unit_price_irt,x.quantity,x.unit_price_irt*x.quantity,JSON.stringify(x.selected_options||[])));
  stmts.push(env.DB.prepare('INSERT INTO payments(id,order_id,status,amount_irt) VALUES(?,?,\'CREATED\',?)').bind(pay,oid,pricing.total_irt));
  for(const x of rows)stmts.push(env.DB.prepare('UPDATE inventory SET quantity=quantity-?,updated_at=CURRENT_TIMESTAMP WHERE product_id=? AND quantity>=?').bind(x.quantity,x.product_id,x.quantity));
  for(const d of discounts)stmts.push(env.DB.prepare('UPDATE discounts SET usage_count=usage_count+1,updated_at=CURRENT_TIMESTAMP WHERE id=? AND EXISTS(SELECT 1 FROM discount_usages WHERE discount_id=? AND order_id=?)').bind(d.id,d.id,oid));
  stmts.push(env.DB.prepare("DELETE FROM cart_items WHERE cart_id=? AND EXISTS(SELECT 1 FROM orders WHERE id=?)").bind(c.id,oid));
  try{await env.DB.batch(stmts)}catch(e){const msg=String(e?.message||'');if(msg.includes('constraint')||msg.includes('FOREIGN KEY'))return json({error:'promotion_or_stock_conflict'},409);throw e}
  const created=await env.DB.prepare('SELECT id,total_irt FROM orders WHERE id=?').bind(oid).first();if(!created)return json({error:'promotion_or_stock_conflict'},409);
  return json({ok:true,orderId:oid,total_irt:pricing.total_irt,discount_irt:pricing.discount_irt});
 }
 if(u.pathname.startsWith('/api/orders/')&&req.method==='GET'){if(!me)return json({error:'unauthorized'},401);const oid=u.pathname.split('/')[3];const o=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND user_id=?').bind(oid,me.id).first();if(!o)return json({error:'not_found'},404);const items=(await env.DB.prepare('SELECT * FROM order_items WHERE order_id=?').bind(oid).all()).results||[];const pay=await env.DB.prepare('SELECT status,amount_irt,ref_id,authority FROM payments WHERE order_id=?').bind(oid).first();return json({order:o,items,payment:pay})}
 if(u.pathname.startsWith('/api/orders/')&&u.pathname.endsWith('/pay')&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const oid=u.pathname.split('/')[3],o=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND user_id=? AND status=\'PENDING\'').bind(oid,me.id).first();if(!o)return json({error:'order_not_payable'},400);const p=await env.DB.prepare('SELECT * FROM payments WHERE order_id=?').bind(oid).first();if(!p)return json({error:'payment_missing'},500);if(p.status==='PAID')return json({ok:true,url:frontend(env)+'/#/payment/success?order='+oid,reused:true});if(p.authority&&['REDIRECTED','CALLBACK','VERIFYING'].includes(p.status)){const mode=await paymentEnvironment(env);const host=mode==='production'?'https://www.zarinpal.com':'https://sandbox.zarinpal.com';return json({ok:true,url:host+'/pg/StartPay/'+p.authority,reused:true})}if(!env.ZARINPAL_MERCHANT_ID)return json({error:'payment_not_configured'},503);const reqz=await zarin(env,'request.json',{amount:o.total_irt,description:'GilasArt Order '+oid,callback_url:await siteSetting(env,'zarinpal_callback_url',env.PAYMENT_CALLBACK_URL||new URL(req.url).origin+'/api/payment/callback'),metadata:{mobile:me.mobile}});const data=reqz.data||{},code=Number(data.code||reqz.code||0),authority=data.authority;if(code!==100||!authority)return json({error:'payment_request_failed',details:reqz.errors||[]},502);await env.DB.batch([env.DB.prepare("UPDATE payments SET status='REDIRECTED',authority=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID'").bind(authority,p.id),env.DB.prepare('INSERT INTO payment_attempts(id,payment_id,authority,request_code,raw_status) VALUES(?,?,?,?,?)').bind(uid(),p.id,authority,code,JSON.stringify({code,message:data.message||null}))]);const mode=await paymentEnvironment(env);const host=mode==='production'?'https://www.zarinpal.com':'https://sandbox.zarinpal.com';return json({ok:true,url:host+'/pg/StartPay/'+authority})}
 if(u.pathname==='/api/payment/callback'&&req.method==='GET'){const authority=u.searchParams.get('Authority'),status=u.searchParams.get('Status');if(!authority)return json({error:'missing_authority'},400);const p=await env.DB.prepare('SELECT p.*,o.status order_status FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.authority=?').bind(authority).first();if(!p)return json({error:'payment_not_found'},404);if(status!=='OK'){await releaseReservation(env,p.order_id,'FAILED');return Response.redirect(frontend(env)+'/#/payment/failed?order='+p.order_id,302)}if(p.status==='PAID')return Response.redirect(frontend(env)+'/#/payment/success?order='+p.order_id,302);if(!env.ZARINPAL_MERCHANT_ID)return json({error:'payment_not_configured'},503);const vr=await zarin(env,'verify.json',{amount:p.amount_irt,authority});const code=Number(vr.code||vr.data?.code||0),ref=vr.data?.ref_id,ok=code===100||code===101;await env.DB.prepare('INSERT INTO payment_attempts(id,payment_id,authority,verify_code,callback_status,raw_status) VALUES(?,?,?,?,?,?)').bind(uid(),p.id,authority,code||null,status,JSON.stringify({code,message:vr.message||vr.data?.message||null})).run();if(!ok){await env.DB.prepare("UPDATE payments SET status='FAILED',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID'").bind(p.id).run();return Response.redirect(frontend(env)+'/#/payment/failed?order='+p.order_id,302)}const reservationCount=await env.DB.prepare('SELECT COUNT(*) n FROM stock_reservations WHERE order_id=?').bind(p.order_id).first();if(!reservationCount?.n)return json({error:'stock_reservation_missing'},409);const statements=[env.DB.prepare("UPDATE payments SET status='PAID',ref_id=COALESCE(?,ref_id),paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP),updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID' AND EXISTS (SELECT 1 FROM orders oo WHERE oo.id=payments.order_id AND oo.status='PENDING')").bind(ref,p.id),env.DB.prepare("UPDATE orders SET status='PAID',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='PENDING' AND EXISTS (SELECT 1 FROM payments pp WHERE pp.order_id=orders.id AND pp.status='PAID')").bind(p.order_id),env.DB.prepare('DELETE FROM stock_reservations WHERE order_id=?').bind(p.order_id)];await env.DB.batch(statements);return Response.redirect(frontend(env)+'/#/payment/success?order='+p.order_id+'&ref='+encodeURIComponent(ref||''),302)}
 if(u.pathname==='/api/favorites'&&req.method==='GET'){if(!me)return json({items:[]});const r=await env.DB.prepare('SELECT p.id,p.slug,p.name,p.price_irt,pi.path image FROM favorites f JOIN products p ON p.id=f.product_id LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE f.user_id=?').bind(me.id).all();return json({items:r.results||[]})}
 if(u.pathname==='/api/favorites'&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const b=await body(req);await env.DB.prepare('INSERT OR IGNORE INTO favorites(user_id,product_id) VALUES(?,?)').bind(me.id,String(b.productId||'')).run();return json({ok:true})}
 if(u.pathname==='/api/favorites'&&req.method==='DELETE'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const pid=u.searchParams.get('productId');await env.DB.prepare('DELETE FROM favorites WHERE user_id=? AND product_id=?').bind(me.id,pid).run();return json({ok:true})}
 if(u.pathname==='/api/admin/inventory'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'inventory.read')))return json({error:'forbidden'},403);
  const r=await env.DB.prepare('SELECT p.id,p.name,p.sku,p.price_irt,COALESCE(i.quantity,0) quantity, i.updated_at FROM products p LEFT JOIN inventory i ON i.product_id=p.id ORDER BY p.name LIMIT 500').all();
  return json({items:r.results||[]});
 }
 if(u.pathname.startsWith('/api/admin/inventory/')&&req.method==='PUT'){
  if(!(await requirePermission(me,env,'inventory.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
  const id=u.pathname.split('/').pop();
  const b=await body(req), quantity=Math.max(0,Math.min(1000000,Number(b.quantity)));
  if(!Number.isFinite(quantity))return json({error:'invalid_quantity'},400);
  const before=await env.DB.prepare('SELECT product_id,quantity FROM inventory WHERE product_id=?').bind(id).first();
  if(!before)return json({error:'not_found'},404);
  await env.DB.prepare('UPDATE inventory SET quantity=?,updated_at=CURRENT_TIMESTAMP WHERE product_id=?').bind(Math.trunc(quantity),id).run();
  await audit(env,me,'admin.inventory.update','product',id,{before,after:{product_id:id,quantity:Math.trunc(quantity)}},req);
  return json({ok:true});
 }
 if(u.pathname==='/api/admin/payments'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'payments.read')))return json({error:'forbidden'},403);
  const r=await env.DB.prepare('SELECT p.id,p.order_id,p.status,p.amount_irt,p.authority,p.ref_id,p.paid_at,p.created_at,u.mobile FROM payments p JOIN orders o ON o.id=p.order_id JOIN users u ON u.id=o.user_id ORDER BY p.created_at DESC LIMIT 500').all();
  return json({items:r.results||[]});
 }


 if(u.pathname==='/api/admin/product-attributes'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'products.read')))return json({error:'forbidden'},403);
  const attrs=(await env.DB.prepare('SELECT * FROM product_attributes ORDER BY sort_order,name').all()).results||[];
  const opts=(await env.DB.prepare('SELECT * FROM product_attribute_options ORDER BY attribute_id,sort_order,name').all()).results||[];
  return json({items:attrs.map(a=>({...a,active:Number(a.active)===1,options:opts.filter(o=>o.attribute_id===a.id).map(o=>({...o,active:Number(o.active)===1,is_default:Number(o.is_default)===1,price_delta_irt:Number(o.price_delta_irt||0)}))}))});
 }
 if(u.pathname==='/api/admin/product-attributes'&&req.method==='POST'){
  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
  const b=await body(req),name=String(b.name||'').trim().slice(0,120);if(!name)return json({error:'invalid_attribute'},400);
  const id=uid();try{await env.DB.prepare('INSERT INTO product_attributes(id,name,active,sort_order) VALUES(?,?,?,?)').bind(id,name,b.active===false?0:1,Number(b.sortOrder)||0).run()}catch(e){return json({error:'attribute_exists'},409)}return json({ok:true,id});
 }
 if(u.pathname.startsWith('/api/admin/product-attributes/')&&req.method==='PUT'){
  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
  const id=u.pathname.split('/')[4],b=await body(req);const before=await env.DB.prepare('SELECT * FROM product_attributes WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);
  await env.DB.prepare('UPDATE product_attributes SET name=?,active=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(String(b.name||before.name).trim().slice(0,120),b.active===false?0:1,Number(b.sortOrder??before.sort_order)||0,id).run();return json({ok:true});
 }
 if(u.pathname.startsWith('/api/admin/product-attributes/')&&u.pathname.endsWith('/options')&&req.method==='POST'){
  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
  const id=u.pathname.split('/')[4],a=await env.DB.prepare('SELECT id FROM product_attributes WHERE id=?').bind(id).first();if(!a)return json({error:'not_found'},404);
  const b=await body(req),name=String(b.name||'').trim().slice(0,120),delta=Math.max(0,Math.trunc(Number(b.priceDeltaIrt)||0));if(!name)return json({error:'invalid_option'},400);
  const oid=uid(),isDefault=b.isDefault===true||b.isDefault===1||b.isDefault==='1';
  try{if(isDefault)await env.DB.prepare('UPDATE product_attribute_options SET is_default=0,updated_at=CURRENT_TIMESTAMP WHERE attribute_id=?').bind(id).run();await env.DB.prepare('INSERT INTO product_attribute_options(id,attribute_id,name,active,is_default,price_delta_irt,sort_order) VALUES(?,?,?,?,?,?,?)').bind(oid,id,name,b.active===false?0:1,isDefault?1:0,delta,Number(b.sortOrder)||0).run()}catch(e){return json({error:'option_exists'},409)}return json({ok:true,id:oid});
 }
 if(u.pathname.startsWith('/api/admin/product-attribute-options/')&&req.method==='PUT'){
  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
  const id=u.pathname.split('/')[4],before=await env.DB.prepare('SELECT * FROM product_attribute_options WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);
  const b=await body(req),isDefault=b.isDefault===true||b.isDefault===1||b.isDefault==='1';
  if(isDefault)await env.DB.prepare('UPDATE product_attribute_options SET is_default=0,updated_at=CURRENT_TIMESTAMP WHERE attribute_id=?').bind(before.attribute_id).run();
  await env.DB.prepare('UPDATE product_attribute_options SET name=?,active=?,is_default=?,price_delta_irt=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(String(b.name||before.name).trim().slice(0,120),b.active===false?0:1,isDefault?1:0,Math.max(0,Math.trunc(Number(b.priceDeltaIrt??before.price_delta_irt)||0)),Number(b.sortOrder??before.sort_order)||0,id).run();return json({ok:true});
 }
 if(u.pathname.startsWith('/api/admin/product-attribute-options/')&&req.method==='DELETE'){
  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
  const id=u.pathname.split('/')[4];await env.DB.prepare('DELETE FROM product_attribute_options WHERE id=?').bind(id).run();return json({ok:true});
 }

 if(u.pathname==='/api/admin/products'&&req.method==='GET'){if(!(await requirePermission(me,env,'products.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT p.*,i.quantity stock,pi.path image FROM products p LEFT JOIN inventory i ON i.product_id=p.id LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 ORDER BY p.created_at DESC').all();const items=r.results||[];const a=await env.DB.prepare('SELECT product_id,attribute_id FROM product_attribute_assignments ORDER BY sort_order').all();const by=new Map();for(const x of (a.results||[])){if(!by.has(x.product_id))by.set(x.product_id,[]);by.get(x.product_id).push(x.attribute_id)}for(const x of items)x.attribute_ids=by.get(x.id)||[];return json({items})}
 if(u.pathname==='/api/admin/products'&&req.method==='POST'){if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req);if(b.imagePath&&!allowedImagePath(b.imagePath))return json({error:'invalid_image_path'},400);const videoUrl=validVideoUrl(b.videoUrl);if(b.videoUrl&&!videoUrl)return json({error:'invalid_video_url'},400);let flash;try{flash=flashSaleValues(b)}catch(e){return json({error:e.message},400)}const id=uid();await env.DB.batch([env.DB.prepare('INSERT INTO products(id,category_id,slug,sku,name,description,price_irt,active,seo_title,seo_description,video_url,flash_sale_active,flash_sale_ends_at,flash_sale_price_irt) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,b.categoryId||null,b.slug,b.sku,b.name,b.description||'',Number(b.priceIrt)||0,b.active===false?0:1,b.seoTitle||b.name,b.seoDescription||'',videoUrl,flash.active,flash.end,flash.price),env.DB.prepare('INSERT INTO inventory(product_id,quantity) VALUES(?,?)').bind(id,Math.max(0,Number(b.stock)||0)),...(b.imagePath?[env.DB.prepare('INSERT INTO product_images(id,product_id,path,alt_text,is_primary) VALUES(?,?,?,?,1)').bind(uid(),id,String(b.imagePath),String(b.imageAlt||b.name))]:[])]);await saveProductAttributeAssignments(env,id,b.attributeIds||[]);
  await audit(env,me,'admin.product.create','product',id,{
 before:null,
 after:{
  sku:b.sku,
  name:b.name,
  priceIrt:Number(b.priceIrt)||0,
  stock:Number(b.stock)||0
 }
},req);return json({ok:true,id})}


 if(u.pathname.startsWith('/api/admin/products/') &&
    req.method==='PUT'){

  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))
   return json({error:'forbidden'},403);

  const id=u.pathname.split('/').pop();

  const before=await env.DB.prepare(
   'SELECT * FROM products WHERE id=?'
  ).bind(id).first();

  if(!before)
   return json({error:'not_found'},404);

  const b=await body(req);
  if(b.imagePath&&!allowedImagePath(b.imagePath))return json({error:'invalid_image_path'},400);
  const videoUrl=b.videoUrl===undefined?before.video_url:validVideoUrl(b.videoUrl);if(b.videoUrl!==undefined&&b.videoUrl!==''&&!videoUrl)return json({error:'invalid_video_url'},400);
  let flash;try{flash=flashSaleValues(b,before)}catch(e){return json({error:e.message},400)}

  await env.DB.prepare(`
   UPDATE products
   SET
    name=?,
    description=?,
    price_irt=?,
    active=?,
    seo_title=?,
    seo_description=?,
    video_url=?,
    flash_sale_active=?,
    flash_sale_ends_at=?,
    flash_sale_price_irt=?,
    updated_at=CURRENT_TIMESTAMP
   WHERE id=?
  `).bind(
   b.name||before.name,
   b.description??before.description,
   Number(b.priceIrt ?? before.price_irt),
   b.active===false?0:1,
   b.seoTitle||before.seo_title,
   b.seoDescription||before.seo_description,
   videoUrl,
   flash.active,flash.end,flash.price,
   id
  ).run();
  if(b.categoryId!==undefined)await env.DB.prepare('UPDATE products SET category_id=? WHERE id=?').bind(b.categoryId||null,id).run();
  if(b.imagePath){await env.DB.prepare('DELETE FROM product_images WHERE product_id=?').bind(id).run();await env.DB.prepare('INSERT INTO product_images(id,product_id,path,alt_text,is_primary) VALUES(?,?,?,?,1)').bind(uid(),id,String(b.imagePath),String(b.imageAlt||before.name),).run();}
  if(b.attributeIds!==undefined)await saveProductAttributeAssignments(env,id,b.attributeIds);

  const after=await env.DB.prepare(
   'SELECT * FROM products WHERE id=?'
  ).bind(id).first();

  await audit(
   env,
   me,
   'admin.product.update',
   'product',
   id,
   {before,after},
   req
  );

  return json({ok:true});
 }


 if(u.pathname.startsWith('/api/admin/products/') &&
    req.method==='DELETE'){

  if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))
   return json({error:'forbidden'},403);

  const id=u.pathname.split('/').pop();

  const before=await env.DB.prepare(
   'SELECT * FROM products WHERE id=?'
  ).bind(id).first();

  if(!before)
   return json({error:'not_found'},404);

  await env.DB.prepare(
   'DELETE FROM products WHERE id=?'
  ).bind(id).run();

  await audit(
   env,
   me,
   'admin.product.delete',
   'product',
   id,
   {before,after:null},
   req
  );

  return json({ok:true});
 }


 if(u.pathname.startsWith('/api/admin/orders/') &&
    u.pathname.endsWith('/status') &&
    req.method==='PUT'){

  if(!(await requirePermission(me,env,'orders.write'))||!requireCsrf(req))
   return json({error:'forbidden'},403);

  const id=u.pathname.split('/')[4];

  const before=await env.DB.prepare(
   'SELECT * FROM orders WHERE id=?'
  ).bind(id).first();

  if(!before)
   return json({error:'not_found'},404);

  const b=await body(req);

  await env.DB.prepare(`
   UPDATE orders
   SET status=?, updated_at=CURRENT_TIMESTAMP
   WHERE id=?
  `).bind(
   String(b.status||before.status),
   id
  ).run();

  const after=await env.DB.prepare(
   'SELECT * FROM orders WHERE id=?'
  ).bind(id).first();

  await audit(
   env,
   me,
   'admin.order.status.change',
   'order',
   id,
   {before,after},
   req
  );

  return json({ok:true});
 }

 if(u.pathname==='/api/admin/orders'&&req.method==='GET'){if(!(await requirePermission(me,env,'orders.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT o.*,u.mobile FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 200').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/settings'&&req.method==='GET'){const r=await env.DB.prepare("SELECT key,value FROM site_settings").all();const out={};for(const x of (r.results||[]))out[x.key]=x.value;return json({settings:out})}
 if(u.pathname==='/api/admin/categories'&&req.method==='GET'){if(!(await requirePermission(me,env,'products.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT id,slug,name,description,active FROM categories ORDER BY name').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/admin/categories'&&req.method==='POST'){if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req),id=uid(),slug=String(b.slug||'').trim().toLowerCase();if(!slug||!b.name)return json({error:'invalid_category'},400);await env.DB.prepare('INSERT INTO categories(id,slug,name,description,active) VALUES(?,?,?,?,?)').bind(id,slug,String(b.name).trim(),String(b.description||''),b.active===false?0:1).run();await audit(env,me,'admin.category.create','category',id,{after:{slug,name:b.name}},req);return json({ok:true,id})}
 if(u.pathname.startsWith('/api/admin/categories/')&&req.method==='PUT'){if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM categories WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);const b=await body(req);await env.DB.prepare('UPDATE categories SET slug=?,name=?,description=?,active=? WHERE id=?').bind(String(b.slug||before.slug).trim().toLowerCase(),String(b.name||before.name).trim(),String(b.description??before.description??''),b.active===false?0:1,id).run();const after=await env.DB.prepare('SELECT * FROM categories WHERE id=?').bind(id).first();await audit(env,me,'admin.category.update','category',id,{before,after},req);return json({ok:true})}
 if(u.pathname.startsWith('/api/admin/categories/')&&req.method==='DELETE'){if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM categories WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);const used=await env.DB.prepare('SELECT COUNT(*) n FROM products WHERE category_id=?').bind(id).first();if(Number(used?.n||0)>0)return json({error:'category_has_products'},409);await env.DB.prepare('DELETE FROM categories WHERE id=?').bind(id).run();await audit(env,me,'admin.category.delete','category',id,{before,after:null},req);return json({ok:true})}
 

if(u.pathname==='/api/admin/cms'&&req.method==='GET'){
 const section=String(u.searchParams.get('section')||'').trim().toLowerCase();
 if(!['about','contact','news','articles'].includes(section))return json({error:'invalid_section'},400);
 if(!(await requirePermission(me,env,'content.read')))return json({error:'forbidden'},403);
 const r=await env.DB.prepare('SELECT * FROM cms_entries WHERE section=? ORDER BY sort_order ASC,created_at DESC').bind(section).all();
 return json({items:r.results||[]});
}
if(u.pathname==='/api/admin/cms'&&req.method==='POST'){
 if(!(await requirePermission(me,env,'content.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const b=await body(req),section=String(b.section||'').toLowerCase();
 if(!['about','contact','news','articles'].includes(section)||!String(b.title||'').trim())return json({error:'invalid_content'},400);
 const id=uid(),slug=String(b.slug||b.title).trim().toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\s_-]/g,'').replace(/\s+/g,'-').slice(0,160);
 await env.DB.prepare('INSERT INTO cms_entries(id,section,title,slug,summary,body,phone,mobile,address,map_url,active,published_at,sort_order) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)')
 .bind(id,section,String(b.title).trim().slice(0,180),slug,String(b.summary||'').slice(0,500),String(b.body||'').slice(0,12000),String(b.phone||'').slice(0,50),String(b.mobile||'').slice(0,50),String(b.address||'').slice(0,500),String(b.mapUrl||'').slice(0,500),b.active===false?0:1,b.publishedAt||now(),Math.trunc(Number(b.sortOrder)||0)).run();
 await audit(env,me,'admin.cms.create','cms',id,{after:{section,title:b.title}},req);return json({ok:true,id});
}
if(u.pathname.startsWith('/api/admin/cms/')&&req.method==='PUT'){
 if(!(await requirePermission(me,env,'content.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM cms_entries WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);
 const b=await body(req);
 await env.DB.prepare('UPDATE cms_entries SET title=?,slug=?,summary=?,body=?,phone=?,mobile=?,address=?,map_url=?,active=?,published_at=?,sort_order=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')
 .bind(String(b.title??before.title).slice(0,180),String(b.slug??before.slug).slice(0,160),String(b.summary??before.summary??'').slice(0,500),String(b.body??before.body??'').slice(0,12000),String(b.phone??before.phone??'').slice(0,50),String(b.mobile??before.mobile??'').slice(0,50),String(b.address??before.address??'').slice(0,500),String(b.mapUrl??before.map_url??'').slice(0,500),b.active===false?0:1,b.publishedAt??before.published_at,Math.trunc(Number(b.sortOrder??before.sort_order)||0),id).run();
 const after=await env.DB.prepare('SELECT * FROM cms_entries WHERE id=?').bind(id).first();await audit(env,me,'admin.cms.update','cms',id,{before,after},req);return json({ok:true});
}
if(u.pathname.startsWith('/api/admin/cms/')&&req.method==='DELETE'){
 if(!(await requirePermission(me,env,'content.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM cms_entries WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);
 await env.DB.prepare('DELETE FROM cms_entries WHERE id=?').bind(id).run();await audit(env,me,'admin.cms.delete','cms',id,{before,after:null},req);return json({ok:true});
}

if(u.pathname==='/api/admin/site-rules'&&req.method==='GET'){
 if(!(await requirePermission(me,env,'settings.read')))return json({error:'forbidden'},403);
 const r=await env.DB.prepare("SELECT key,value,updated_at FROM site_settings WHERE key IN ('site_rules_title','site_rules_body') ORDER BY key").all();
 const rows=r.results||[],map=Object.fromEntries(rows.map(x=>[x.key,x.value])),updated=rows.map(x=>x.updated_at).filter(Boolean).sort().pop()||null;
 return json({item:{title:map.site_rules_title||'قوانین سایت',body:map.site_rules_body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.',updated_at:updated}});
}
if(u.pathname==='/api/admin/site-rules'&&req.method==='PUT'){
 if(!(await requirePermission(me,env,'settings.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const b=await body(req),title=String(b.title||'').trim().slice(0,180),rules=String(b.body||'').trim().slice(0,30000);
 if(!title||!rules)return json({error:'invalid_site_rules'},400);
 await env.DB.batch([
  env.DB.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind('site_rules_title',title),
  env.DB.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind('site_rules_body',rules)
 ]);
 await audit(env,me,'admin.site_rules.update','site_rules','site_rules',{after:{title,body_length:rules.length}},req);
 return json({ok:true});
}

if(u.pathname==='/api/admin/settings'&&req.method==='GET'){if(!(await requirePermission(me,env,'settings.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare("SELECT key,value,updated_at FROM site_settings ORDER BY key").all();return json({items:r.results||[]})}
if(u.pathname==='/api/admin/settings'&&req.method==='PUT'){if(!(await requirePermission(me,env,'settings.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req),allowed=['site_name','site_description','seo_title','seo_description','seo_keywords','og_image'];for(const key of allowed)if(Object.prototype.hasOwnProperty.call(b,key))await env.DB.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(key,String(b[key]??'').slice(0,2000)).run();await audit(env,me,'admin.settings.update','settings','site_settings',{updated:allowed.filter(k=>Object.prototype.hasOwnProperty.call(b,k))},req);return json({ok:true})}

if(u.pathname==='/api/admin/integrations'&&req.method==='GET'){
 if(!(await requirePermission(me,env,'settings.read')))return json({error:'forbidden'},403);
 const keys=['kavenegar_sender','kavenegar_message_template','zarinpal_environment','zarinpal_callback_url'];
 const r=await env.DB.prepare("SELECT key,value,updated_at FROM site_settings WHERE key IN ('kavenegar_sender','kavenegar_message_template','zarinpal_environment','zarinpal_callback_url')").all();
 const map={};for(const x of(r.results||[]))map[x.key]=x.value;
 return json({kavenegar:{sender:map.kavenegar_sender||env.KAVENEGAR_SENDER||'9982007299',messageTemplate:map.kavenegar_message_template||'گیلاس آرت\\nکد ورود : {code}',apiKeyConfigured:!!env.KAVENEGAR_API_KEY},zarinpal:{environment:map.zarinpal_environment||env.PAYMENT_ENV||'production',callbackUrl:map.zarinpal_callback_url||env.PAYMENT_CALLBACK_URL||new URL(req.url).origin+'/api/payment/callback',merchantConfigured:!!env.ZARINPAL_MERCHANT_ID}});
}
if(u.pathname==='/api/admin/integrations'&&req.method==='PUT'){
 if(!(await requirePermission(me,env,'settings.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const b=await body(req),updates={};
 const sender=String(b.kavenegarSender||'').trim().slice(0,50),template=String(b.kavenegarMessageTemplate||'').trim().slice(0,500),zenv=String(b.zarinpalEnvironment||'').toLowerCase(),callback=String(b.zarinpalCallbackUrl||'').trim();
 if(sender)updates.kavenegar_sender=sender;
 if(template&&template.includes('{code}'))updates.kavenegar_message_template=template;
 if(zenv==='production'||zenv==='sandbox')updates.zarinpal_environment=zenv;else if(b.zarinpalEnvironment!==undefined)return json({error:'invalid_payment_environment'},400);
 if(callback){try{const x=new URL(callback);if(x.protocol!=='https:'||x.origin!==new URL(req.url).origin||x.pathname!=='/api/payment/callback')return json({error:'invalid_payment_callback'},400)}catch{return json({error:'invalid_payment_callback'},400)}updates.zarinpal_callback_url=callback}
 for(const [key,value] of Object.entries(updates))await env.DB.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(key,value).run();
 await audit(env,me,'admin.integrations.update','settings','integrations',{updated:Object.keys(updates),secrets:['KAVENEGAR_API_KEY','ZARINPAL_MERCHANT_ID']},req);
 return json({ok:true});
}

if(u.pathname==='/api/admin/discounts'&&req.method==='GET'){
 if(!(await requirePermission(me,env,'coupons.read')))return json({error:'forbidden'},403);
 const d=await env.DB.prepare('SELECT * FROM discounts ORDER BY created_at DESC').all();
 const p=await env.DB.prepare('SELECT dp.discount_id,dp.product_id,pr.name FROM discount_products dp JOIN products pr ON pr.id=dp.product_id').all();
 const c=await env.DB.prepare('SELECT dc.discount_id,dc.category_id,ca.name FROM discount_categories dc JOIN categories ca ON ca.id=dc.category_id').all();
 const items=(d.results||[]).map(x=>({...x,products:(p.results||[]).filter(y=>y.discount_id===x.id),categories:(c.results||[]).filter(y=>y.discount_id===x.id)}));
 return json({items});
}
if(u.pathname==='/api/admin/discounts'&&req.method==='POST'){
 if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const b=await body(req),id=uid(),title=String(b.title||'').trim().slice(0,160),kind=String(b.kind||'PERCENT').toUpperCase(),value=Math.trunc(Number(b.value)||0),min=Math.max(0,Math.trunc(Number(b.minOrderIrt)||0)),max=b.maxUses?Math.max(1,Math.trunc(Number(b.maxUses))):null;
 if(!title||!['PERCENT','FIXED'].includes(kind)||value<0||(kind==='PERCENT'&&value>100))return json({error:'invalid_discount'},400);
 const productIds=Array.isArray(b.productIds)?[...new Set(b.productIds.map(String))].slice(0,100):[],categoryId=b.categoryId?String(b.categoryId):null;
 const stmts=[env.DB.prepare('INSERT INTO discounts(id,title,kind,value,min_order_irt,max_uses,starts_at,ends_at,active) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,title,kind,value,min,max,b.startsAt||null,b.endsAt||null,b.active===false?0:1)];
 for(const pid of productIds)stmts.push(env.DB.prepare('INSERT INTO discount_products(discount_id,product_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM products WHERE id=?)').bind(id,pid,pid));
 if(categoryId)stmts.push(env.DB.prepare('INSERT INTO discount_categories(discount_id,category_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM categories WHERE id=?)').bind(id,categoryId,categoryId));
 await env.DB.batch(stmts);await audit(env,me,'admin.discount.create','discount',id,{after:{title,kind,value,min,max,productIds,categoryId}},req);return json({ok:true,id});
}
if(u.pathname.startsWith('/api/admin/discounts/')&&req.method==='PUT'){
 if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM discounts WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);
 const b=await body(req),kind=String(b.kind||before.kind).toUpperCase(),value=Math.trunc(Number(b.value??before.value));if(!['PERCENT','FIXED'].includes(kind)||value<0||(kind==='PERCENT'&&value>100))return json({error:'invalid_discount'},400);
 const productIds=Array.isArray(b.productIds)?[...new Set(b.productIds.map(String))].slice(0,100):null,categoryId=b.categoryId===undefined?undefined:(b.categoryId?String(b.categoryId):null);
 const stmts=[env.DB.prepare('UPDATE discounts SET title=?,kind=?,value=?,min_order_irt=?,max_uses=?,starts_at=?,ends_at=?,active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(String(b.title||before.title).trim().slice(0,160),kind,value,Math.max(0,Math.trunc(Number(b.minOrderIrt??before.min_order_irt))),b.maxUses?Math.max(1,Math.trunc(Number(b.maxUses))):null,b.startsAt??before.starts_at,b.endsAt??before.ends_at,b.active===false?0:1,id)];
 if(productIds){stmts.push(env.DB.prepare('DELETE FROM discount_products WHERE discount_id=?').bind(id));for(const pid of productIds)stmts.push(env.DB.prepare('INSERT INTO discount_products(discount_id,product_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM products WHERE id=?)').bind(id,pid,pid))}
 if(categoryId!==undefined){stmts.push(env.DB.prepare('DELETE FROM discount_categories WHERE discount_id=?').bind(id));if(categoryId)stmts.push(env.DB.prepare('INSERT INTO discount_categories(discount_id,category_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM categories WHERE id=?)').bind(id,categoryId,categoryId))}
 await env.DB.batch(stmts);const after=await env.DB.prepare('SELECT * FROM discounts WHERE id=?').bind(id).first();await audit(env,me,'admin.discount.update','discount',id,{before,after},req);return json({ok:true});
}
if(u.pathname.startsWith('/api/admin/discounts/')&&req.method==='DELETE'){
 if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM discounts WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);await env.DB.prepare('DELETE FROM discounts WHERE id=?').bind(id).run();await audit(env,me,'admin.discount.delete','discount',id,{before,after:null},req);return json({ok:true});
}

if(u.pathname==='/api/admin/coupons'&&req.method==='GET'){
 if(!(await requirePermission(me,env,'coupons.read')))return json({error:'forbidden'},403);
 const c=await env.DB.prepare('SELECT * FROM coupons ORDER BY expires_at DESC,code').all();const p=await env.DB.prepare('SELECT cp.coupon_id,cp.product_id,pr.name FROM coupon_products cp JOIN products pr ON pr.id=cp.product_id').all();const cats=await env.DB.prepare('SELECT cc.coupon_id,cc.category_id,ca.name FROM coupon_categories cc JOIN categories ca ON ca.id=cc.category_id').all();
 return json({items:(c.results||[]).map(x=>({...x,products:(p.results||[]).filter(y=>y.coupon_id===x.id),categories:(cats.results||[]).filter(y=>y.coupon_id===x.id)}))});
}
if(u.pathname==='/api/admin/coupons'&&req.method==='POST'){
 if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const b=await body(req),kind=String(b.kind||'PERCENT').toUpperCase(),value=Math.trunc(Number(b.value)||0);if(!['PERCENT','FIXED'].includes(kind)||value<0||(kind==='PERCENT'&&value>100))return json({error:'invalid_coupon'},400);
 let code='',id=uid();for(let n=0;n<5&&!code;n++){const a=new Uint8Array(8);crypto.getRandomValues(a);code='GLS'+Array.from(a,x=>'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[x%36]).join('');if(await env.DB.prepare('SELECT 1 FROM coupons WHERE code=?').bind(code).first())code=''}if(!code)return json({error:'coupon_generation_failed'},503);
 const productIds=Array.isArray(b.productIds)?[...new Set(b.productIds.map(String))].slice(0,100):[],categoryId=b.categoryId?String(b.categoryId):null;
 const stmts=[env.DB.prepare('INSERT INTO coupons(id,code,kind,value,max_uses,active,starts_at,expires_at,min_order_irt) VALUES(?,?,?,?,?,?,?,?,?)').bind(id,code,kind,value,b.maxUses?Math.max(1,Math.trunc(Number(b.maxUses))):null,b.active===false?0:1,b.startsAt||null,b.expiresAt||null,Math.max(0,Math.trunc(Number(b.minOrderIrt)||0)))];
 for(const pid of productIds)stmts.push(env.DB.prepare('INSERT INTO coupon_products(coupon_id,product_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM products WHERE id=?)').bind(id,pid,pid));
 if(categoryId)stmts.push(env.DB.prepare('INSERT INTO coupon_categories(coupon_id,category_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM categories WHERE id=?)').bind(id,categoryId,categoryId));
 await env.DB.batch(stmts);await audit(env,me,'admin.coupon.create','coupon',id,{after:{code,kind,value}},req);return json({ok:true,id,code});
}
if(u.pathname.startsWith('/api/admin/coupons/')&&req.method==='PUT'){
 if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM coupons WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);const b=await body(req),kind=String(b.kind||before.kind).toUpperCase(),value=Math.trunc(Number(b.value??before.value));if(!['PERCENT','FIXED'].includes(kind)||value<0||(kind==='PERCENT'&&value>100))return json({error:'invalid_coupon'},400);
 const productIds=Array.isArray(b.productIds)?[...new Set(b.productIds.map(String))].slice(0,100):null,categoryId=b.categoryId===undefined?undefined:(b.categoryId?String(b.categoryId):null);
 const stmts=[env.DB.prepare('UPDATE coupons SET kind=?,value=?,max_uses=?,active=?,starts_at=?,expires_at=?,min_order_irt=? WHERE id=?').bind(kind,value,b.maxUses?Math.max(1,Math.trunc(Number(b.maxUses))):null,b.active===false?0:1,b.startsAt??before.starts_at,b.expiresAt??before.expires_at,Math.max(0,Math.trunc(Number(b.minOrderIrt??before.min_order_irt))),id)];
 if(productIds){stmts.push(env.DB.prepare('DELETE FROM coupon_products WHERE coupon_id=?').bind(id));for(const pid of productIds)stmts.push(env.DB.prepare('INSERT INTO coupon_products(coupon_id,product_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM products WHERE id=?)').bind(id,pid,pid))}
 if(categoryId!==undefined){stmts.push(env.DB.prepare('DELETE FROM coupon_categories WHERE coupon_id=?').bind(id));if(categoryId)stmts.push(env.DB.prepare('INSERT INTO coupon_categories(coupon_id,category_id) SELECT ?,? WHERE EXISTS(SELECT 1 FROM categories WHERE id=?)').bind(id,categoryId,categoryId))}
 await env.DB.batch(stmts);const after=await env.DB.prepare('SELECT * FROM coupons WHERE id=?').bind(id).first();await audit(env,me,'admin.coupon.update','coupon',id,{before,after},req);return json({ok:true});
}
if(u.pathname.startsWith('/api/admin/coupons/')&&req.method==='DELETE'){
 if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);
 const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM coupons WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);await env.DB.prepare('DELETE FROM coupons WHERE id=?').bind(id).run();await audit(env,me,'admin.coupon.delete','coupon',id,{before,after:null},req);return json({ok:true});
}

if(u.pathname==='/api/admin/media-images'&&req.method==='GET'){
 if(!(await requirePermission(me,env,'products.read')))return json({error:'forbidden'},403);
 const sources=[['media','gilasartirac-svg/gls-media','image'],['catalog','gilasartirac-svg/glsArt','frontend/public/art']];
 const items=[];
 for(const [source,repo,path] of sources){try{const rr=await fetch('https://api.github.com/repos/'+repo+'/contents/'+path,{headers:{accept:'application/vnd.github+json','user-agent':'GilasArt-Admin'}});if(!rr.ok)continue;const data=await rr.json();for(const x of Array.isArray(data)?data:[]){if(x.type==='file'&&/\.(png|jpe?g|webp|gif|svg)$/i.test(x.name))items.push({source,name:x.name,path:x.path,url:'https://raw.githubusercontent.com/'+repo+'/main/'+x.path})}}catch{}}
 return json({items});
}
 if(u.pathname==='/api/admin/reviews'&&req.method==='GET'){if(!(await requirePermission(me,env,'reviews.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT r.*,p.name product_name,u.mobile FROM reviews r JOIN products p ON p.id=r.product_id JOIN users u ON u.id=r.user_id ORDER BY r.created_at DESC LIMIT 500').all();return json({items:r.results||[]})}
 if(u.pathname.startsWith('/api/admin/reviews/')&&req.method==='PUT'){if(!(await requirePermission(me,env,'reviews.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM reviews WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);const b=await body(req);await env.DB.prepare('UPDATE reviews SET approved=? WHERE id=?').bind(b.approved?1:0,id).run();const after=await env.DB.prepare('SELECT * FROM reviews WHERE id=?').bind(id).first();await audit(env,me,'admin.review.moderate','review',id,{before,after},req);return json({ok:true})}
 if(u.pathname.startsWith('/api/admin/reviews/')&&req.method==='DELETE'){if(!(await requirePermission(me,env,'reviews.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM reviews WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);await env.DB.prepare('DELETE FROM reviews WHERE id=?').bind(id).run();await audit(env,me,'admin.review.delete','review',id,{before,after:null},req);return json({ok:true})}
 if(u.pathname==='/api/admin/stats'&&req.method==='GET'){if(!(await requirePermission(me,env,'reports.read')))return json({error:'forbidden'},403);const [a,b,c,d]=await Promise.all([env.DB.prepare('SELECT COUNT(*) n FROM orders WHERE is_sample=0').first(),env.DB.prepare("SELECT COALESCE(SUM(total_irt),0) n FROM orders WHERE is_sample=0 AND status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')").first(),env.DB.prepare('SELECT COUNT(*) n FROM users WHERE mobile NOT LIKE \'0912000000%\'').first(),env.DB.prepare("SELECT COALESCE(SUM(total_irt),0) n FROM orders WHERE is_sample=0 AND DATE(created_at)=DATE('now') AND status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')").first()]);return json({orders:a.n,revenue_irt:b.n,users:c.n,today_sales_irt:d.n})}


 if(u.pathname==='/api/admin/audit'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    id,
    actor_user_id,
    action,
    entity_type,
    entity_id,
    before_json,
    after_json,
    ip,
    created_at
   FROM audit_logs
   ORDER BY created_at DESC
   LIMIT 500
  `).all();

  return json({items:r.results||[]});
 }


 if(u.pathname==='/api/admin/reports/sales'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    DATE(created_at) day,
    COUNT(*) orders,
    COALESCE(SUM(total_irt),0) revenue_irt
   FROM orders
   WHERE is_sample=0 AND status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
   GROUP BY DATE(created_at)
   ORDER BY day DESC
   LIMIT 365
  `).all();

  return json({items:r.results||[]});
 }


 if(u.pathname==='/api/admin/reports/products'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    p.id,
    p.name,
    p.sku,
    COALESCE(s.sold,0) sold,
    COALESCE(s.revenue_irt,0) revenue_irt
   FROM products p
   LEFT JOIN (
    SELECT oi.product_id,SUM(oi.quantity) sold,SUM(oi.line_total_irt) revenue_irt
    FROM order_items oi
    JOIN orders o ON o.id=oi.order_id
    WHERE o.is_sample=0 AND o.status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
    GROUP BY oi.product_id
   ) s ON s.product_id=p.id
   ORDER BY sold DESC
   LIMIT 200
  `).all();

  return json({items:r.results||[]});
 }


 if(u.pathname==='/api/admin/reports/customers'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    u.id,
    u.mobile,
    u.name,
    COUNT(o.id) orders,
    COALESCE(SUM(o.total_irt),0) total_purchase_irt
   FROM users u
   LEFT JOIN orders o ON o.user_id=u.id AND o.is_sample=0
   GROUP BY u.id
   ORDER BY total_purchase_irt DESC
   LIMIT 500
  `).all();

  return json({items:r.results||[]});
 }



 if(u.pathname==='/api/admin/export/audit.csv'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    actor_user_id,
    action,
    entity_type,
    entity_id,
    before_json,
    after_json,
    ip,
    created_at
   FROM audit_logs
   ORDER BY created_at DESC
   LIMIT 500
  `).all();

  return new Response(csv(r.results||[]),{
   headers:{
    'content-type':'text/csv; charset=utf-8',
    'content-disposition':'attachment; filename="audit.csv"'
   }
  });
 }


 if(u.pathname==='/api/admin/export/sales.csv'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    DATE(created_at) day,
    COUNT(*) orders,
    COALESCE(SUM(total_irt),0) revenue_irt
   FROM orders
   WHERE status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
   GROUP BY DATE(created_at)
   ORDER BY day DESC
  `).all();

  return new Response(csv(r.results||[]),{
   headers:{
    'content-type':'text/csv; charset=utf-8',
    'content-disposition':'attachment; filename="sales.csv"'
   }
  });
 }


 if(u.pathname==='/api/admin/export/products.csv'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    p.name,
    p.sku,
    COALESCE(SUM(oi.quantity),0) sold,
    COALESCE(SUM(oi.line_total_irt),0) revenue_irt
   FROM products p
   LEFT JOIN order_items oi ON oi.product_id=p.id
   GROUP BY p.id
   ORDER BY sold DESC
  `).all();

  return new Response(csv(r.results||[]),{
   headers:{
    'content-type':'text/csv; charset=utf-8',
    'content-disposition':'attachment; filename="products.csv"'
   }
  });
 }


 if(u.pathname==='/api/admin/export/customers.csv'&&req.method==='GET'){
  if(!(await requirePermission(me,env,'reports.read')))
   return json({error:'forbidden'},403);

  const r=await env.DB.prepare(`
   SELECT
    u.id,
    u.mobile,
    u.name,
    COUNT(o.id) orders,
    COALESCE(SUM(o.total_irt),0) total_purchase_irt
   FROM users u
   LEFT JOIN orders o ON o.user_id=u.id
   GROUP BY u.id
   ORDER BY total_purchase_irt DESC
  `).all();

  return new Response(csv(r.results||[]),{
   headers:{
    'content-type':'text/csv; charset=utf-8',
    'content-disposition':'attachment; filename="customers.csv"'
   }
  });
 }

 return json({error:'not_found'},404)}
export default {async fetch(req,env){const headers={...security,...cors(req,env)};try{const r=await route(req,env);for(const[k,v]of Object.entries(headers)){if(k==='set-cookie')continue;r.headers.set(k,v)}return r}catch(e){console.error('request_failed',{path:new URL(req.url).pathname,error:String(e)});return json({error:'internal_error'},500,headers)}},async scheduled(event,env){try{await cleanupExpiredReservations(env)}catch(e){console.error('scheduled_cleanup_failed',e?.message||e)}}};
