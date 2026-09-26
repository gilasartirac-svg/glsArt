const enc=new TextEncoder();
const json=(data,status=200,extra={})=>{const h=new Headers({'content-type':'application/json; charset=utf-8'});for(const[k,v]of Object.entries(extra)){if(Array.isArray(v))v.forEach(x=>h.append(k,x));else h.set(k,v)}return new Response(JSON.stringify(data),{status,headers:h})};
const security={'x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','x-frame-options':'DENY','permissions-policy':'camera=(),microphone=(),geolocation=()','strict-transport-security':'max-age=31536000; includeSubDomains','content-security-policy':"default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://payment.zarinpal.com https://sandbox.zarinpal.com"};
const uid=()=>crypto.randomUUID();
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
async function requireUser(req,env){const u=await user(req,env);return u}
async function rate(env,key,limit,minutes){const h=await env.DB.prepare('SELECT COUNT(*) n FROM otp_challenges WHERE request_ip=? AND created_at>datetime(\'now\',?)').bind(key,`-${minutes} minutes`).first();return (h?.n||0)<limit}
async function zarin(env,endpoint,payload){const base=env.PAYMENT_ENV==='production'?'https://api.zarinpal.com/pg/v4/payment':'https://sandbox.zarinpal.com/pg/v4/payment';const r=await fetch(base+'/'+endpoint,{method:'POST',headers:{'content-type':'application/json','accept':'application/json'},body:JSON.stringify({...payload,merchant_id:env.ZARINPAL_MERCHANT_ID})});return r.json()}
async function route(req,env){const u=new URL(req.url);if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors(req,env)});
 if(u.pathname==='/api/health')return json({ok:true,service:'gilasartworker',db:!!env.DB,paymentEnv:env.PAYMENT_ENV||'sandbox'});
 if(u.pathname==='/api/categories'&&req.method==='GET'){const r=await env.DB.prepare('SELECT id,slug,name,description FROM categories WHERE active=1 ORDER BY name').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/products'&&req.method==='GET'){const q=(u.searchParams.get('q')||'').trim(),cat=u.searchParams.get('category');let sql='SELECT p.id,p.slug,p.sku,p.name,p.description,p.price_irt,p.category_id,pi.path image FROM products p LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE p.active=1';const args=[];if(q){sql+=' AND (p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)';args.push(`%${q}%`,`%${q}%`,`%${q}%`)}if(cat){sql+=' AND p.category_id=?';args.push(cat)}sql+=' ORDER BY p.created_at DESC LIMIT 60';const r=await env.DB.prepare(sql).bind(...args).all();return json({items:r.results||[]})}
 if(u.pathname.startsWith('/api/products/')&&req.method==='GET'){const slug=decodeURIComponent(u.pathname.split('/').pop());const p=await env.DB.prepare('SELECT p.*,c.name category_name,pi.path image FROM products p LEFT JOIN categories c ON c.id=p.category_id LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE p.slug=? AND p.active=1').bind(slug).first();if(!p)return json({error:'not_found'},404);const reviews=await env.DB.prepare('SELECT r.rating,r.body,r.created_at,u.name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.product_id=? AND r.approved=1 ORDER BY r.created_at DESC').bind(p.id).all();return json({product:p,reviews:reviews.results||[]})}
 if(u.pathname==='/api/auth/request-otp'&&req.method==='POST'){const b=await body(req),mobile=String(b.mobile||'').replace(/\D/g,''),ip=req.headers.get('CF-Connecting-IP')||'unknown';if(!/^09\d{9}$/.test(mobile))return json({error:'invalid_mobile'},400);const okM=await rate(env,mobile,3,10),okI=await rate(env,ip,12,10);if(!okM||!okI)return json({error:'rate_limited'},429);const raw=new Uint32Array(1);crypto.getRandomValues(raw);const code=String(100000+(raw[0]%900000));const challenge=uid();await env.DB.prepare('INSERT INTO otp_challenges(id,mobile,code_hash,expires_at,request_ip) VALUES(?,?,?,?,?)').bind(challenge,mobile,await sha(`${env.OTP_PEPPER||'gilasart'}:${code}`),new Date(Date.now()+120000).toISOString(),ip).run();if(env.KAVENEGAR_API_KEY){const p=new URLSearchParams({receptor:mobile,message:`کد ورود گیلاآرت: ${code}`,sender:env.KAVENEGAR_SENDER||'9982007299'});const sr=await fetch(`https://api.kavenegar.com/v1/${env.KAVENEGAR_API_KEY}/sms/send.json`,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:p});if(!sr.ok)return json({error:'sms_unavailable'},502)}else return json({error:'otp_provider_not_configured'},503);return json({ok:true,challengeId:challenge,expiresIn:120})}
 if(u.pathname==='/api/auth/verify-otp'&&req.method==='POST'){const b=await body(req),c=await env.DB.prepare("SELECT * FROM otp_challenges WHERE id=? AND consumed_at IS NULL AND unixepoch(expires_at)>unixepoch('now')").bind(String(b.challengeId||'')).first();if(!c||c.attempts>=5)return json({error:'invalid_or_locked'},400);const ok=await sha(`${env.OTP_PEPPER||'gilasart'}:${String(b.code||'')}`)===c.code_hash;await env.DB.prepare('UPDATE otp_challenges SET attempts=attempts+1 WHERE id=?').bind(c.id).run();if(!ok)return json({error:'invalid_or_locked'},400);let u0=await env.DB.prepare('SELECT id,mobile,name FROM users WHERE mobile=?').bind(c.mobile).first();if(!u0){u0={id:uid(),mobile:c.mobile};await env.DB.prepare('INSERT INTO users(id,mobile) VALUES(?,?)').bind(u0.id,u0.mobile).run()}const sid=uid(),csrf=uid().replaceAll('-','');await env.DB.prepare("INSERT INTO sessions(id,user_id,expires_at) VALUES(?,?,datetime('now','+30 days'))").bind(sid,u0.id).run();await env.DB.prepare("UPDATE otp_challenges SET consumed_at=datetime('now') WHERE id=?").bind(c.id).run();return json({ok:true,user:u0,csrfToken:csrf},200,{'set-cookie':[`__Host-gs_session=${sid}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=2592000`,`gs_csrf=${csrf}; Path=/; Secure; SameSite=None; Max-Age=2592000`]})}
 if(u.pathname==='/api/me'&&req.method==='GET'){const u0=await user(req,env);const csrfToken=cookies(req)['gs_csrf']||null;return json({user:u0,roles:await roles(u0,env),csrfToken})}
 if(u.pathname==='/api/auth/logout'&&req.method==='POST'){if(!requireCsrf(req))return json({error:'forbidden'},403);const sid=cookies(req)['__Host-gs_session'];if(sid)await env.DB.prepare("UPDATE sessions SET revoked_at=datetime('now') WHERE id=?").bind(sid).run();return json({ok:true},200,{'set-cookie':['__Host-gs_session=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0','gs_csrf=; Path=/; Secure; SameSite=None; Max-Age=0']})}
 const me=await requireUser(req,env);

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

  const before=await env.DB.prepare(
   'SELECT * FROM admin_users WHERE user_id=?'
  ).bind(id).first();


  await env.DB.prepare(
   'INSERT OR REPLACE INTO admin_users(user_id,role_id,active) VALUES(?,?,1)'
  ).bind(id,b.roleId).run();


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

  const before=await env.DB.prepare(
   'SELECT * FROM admin_users WHERE user_id=?'
  ).bind(id).first();


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
 if(u.pathname.startsWith('/api/products/')&&u.pathname.endsWith('/reviews')&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const slug=u.pathname.split('/')[3],p=await env.DB.prepare('SELECT id FROM products WHERE slug=? AND active=1').bind(slug).first();if(!p)return json({error:'not_found'},404);const b=await body(req),rating=Number(b.rating),txt=String(b.body||'').trim();if(!Number.isInteger(rating)||rating<1||rating>5||txt.length<3||txt.length>1000)return json({error:'invalid_review'},400);await env.DB.prepare('INSERT INTO reviews(id,user_id,product_id,rating,body,approved) VALUES(?,?,?,?,?,0)').bind(uid(),me.id,p.id,rating,txt).run();return json({ok:true})}
 if(u.pathname==='/api/cart'&&req.method==='GET'){if(!me)return json({items:[],subtotal_irt:0});const c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(!c)return json({items:[],subtotal_irt:0});const r=await env.DB.prepare('SELECT ci.product_id,ci.quantity,p.name,p.slug,p.price_irt,pi.path image FROM cart_items ci JOIN products p ON p.id=ci.product_id LEFT JOIN product_images pi ON pi.product_id=p.id AND pi.is_primary=1 WHERE ci.cart_id=?').bind(c.id).all();const items=r.results||[];return json({items,subtotal_irt:items.reduce((s,x)=>s+x.price_irt*x.quantity,0)})}
 if(u.pathname==='/api/cart'&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const b=await body(req),pid=String(b.productId||''),qty=Math.max(1,Math.min(99,Number(b.quantity)||1));const p=await env.DB.prepare('SELECT id FROM products WHERE id=? AND active=1').bind(pid).first();if(!p)return json({error:'product_not_found'},404);let c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(!c){c={id:uid()};await env.DB.prepare('INSERT INTO carts(id,user_id) VALUES(?,?)').bind(c.id,me.id).run()}await env.DB.prepare('INSERT INTO cart_items(cart_id,product_id,quantity) VALUES(?,?,?) ON CONFLICT(cart_id,product_id) DO UPDATE SET quantity=excluded.quantity').bind(c.id,pid,qty).run();return json({ok:true})}
 if(u.pathname==='/api/cart'&&req.method==='DELETE'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const pid=u.searchParams.get('productId');const c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(c&&pid)await env.DB.prepare('DELETE FROM cart_items WHERE cart_id=? AND product_id=?').bind(c.id,pid).run();return json({ok:true})}
 if(u.pathname==='/api/orders'&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const b=await body(req),addressId=String(b.addressId||'');const a=await env.DB.prepare('SELECT * FROM addresses WHERE id=? AND user_id=?').bind(addressId,me.id).first();if(!a)return json({error:'address_required'},400);const c=await env.DB.prepare('SELECT id FROM carts WHERE user_id=?').bind(me.id).first();if(!c)return json({error:'empty_cart'},400);const rows=(await env.DB.prepare('SELECT ci.product_id,ci.quantity,p.sku,p.name,p.price_irt,i.quantity stock FROM cart_items ci JOIN products p ON p.id=ci.product_id JOIN inventory i ON i.product_id=p.id WHERE ci.cart_id=? AND p.active=1').bind(c.id).all()).results||[];if(!rows.length)return json({error:'empty_cart'},400);if(rows.some(x=>x.quantity>x.stock))return json({error:'insufficient_stock'},409);const subtotal=rows.reduce((s,x)=>s+x.price_irt*x.quantity,0),shipping=subtotal>=10000000?0:500000,total=subtotal+shipping,checkoutKey=String(b.idempotencyKey||'').trim();if(!/^[A-Za-z0-9_-]{16,128}$/.test(checkoutKey))return json({error:'idempotency_key_required'},400);const existing=await env.DB.prepare('SELECT id,total_irt FROM orders WHERE user_id=? AND checkout_key=?').bind(me.id,checkoutKey).first();if(existing)return json({ok:true,orderId:existing.id,total_irt:existing.total_irt,reused:true});const oid=uid(),pay=uid();await env.DB.batch([env.DB.prepare('INSERT INTO orders(id,user_id,address_id,status,subtotal_irt,shipping_irt,total_irt,checkout_key) VALUES(?,?,?,\'PENDING\',?,?,?,?)').bind(oid,me.id,addressId,subtotal,shipping,total,checkoutKey),...rows.map(x=>env.DB.prepare('INSERT INTO order_items(id,order_id,product_id,sku,name,unit_price_irt,quantity,line_total_irt) VALUES(?,?,?,?,?,?,?,?)').bind(uid(),oid,x.product_id,x.sku,x.name,x.price_irt,x.quantity,x.price_irt*x.quantity)),env.DB.prepare('INSERT INTO payments(id,order_id,status,amount_irt) VALUES(?,?,\'CREATED\',?)').bind(pay,oid,total),env.DB.prepare("DELETE FROM cart_items WHERE cart_id=?").bind(c.id)]);return json({ok:true,orderId:oid,total_irt:total})}
 if(u.pathname.startsWith('/api/orders/')&&req.method==='GET'){if(!me)return json({error:'unauthorized'},401);const oid=u.pathname.split('/')[3];const o=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND user_id=?').bind(oid,me.id).first();if(!o)return json({error:'not_found'},404);const items=(await env.DB.prepare('SELECT * FROM order_items WHERE order_id=?').bind(oid).all()).results||[];const pay=await env.DB.prepare('SELECT status,amount_irt,ref_id,authority FROM payments WHERE order_id=?').bind(oid).first();return json({order:o,items,payment:pay})}
 if(u.pathname.startsWith('/api/orders/')&&u.pathname.endsWith('/pay')&&req.method==='POST'){if(!me||!requireCsrf(req))return json({error:'unauthorized'},401);const oid=u.pathname.split('/')[3],o=await env.DB.prepare('SELECT * FROM orders WHERE id=? AND user_id=? AND status=\'PENDING\'').bind(oid,me.id).first();if(!o)return json({error:'order_not_payable'},400);const p=await env.DB.prepare('SELECT * FROM payments WHERE order_id=?').bind(oid).first();if(!p)return json({error:'payment_missing'},500);if(p.status==='PAID')return json({ok:true,url:frontend(env)+'/#/payment/success?order='+oid,reused:true});if(p.authority&&['REDIRECTED','CALLBACK','VERIFYING'].includes(p.status)){const host=env.PAYMENT_ENV==='production'?'https://www.zarinpal.com':'https://sandbox.zarinpal.com';return json({ok:true,url:host+'/pg/StartPay/'+p.authority,reused:true})}if(!env.ZARINPAL_MERCHANT_ID)return json({error:'payment_not_configured'},503);const reqz=await zarin(env,'request.json',{amount:o.total_irt,description:'GilasArt Order '+oid,callback_url:env.PAYMENT_CALLBACK_URL||origin(env)+'/api/payment/callback',metadata:{mobile:me.mobile}});const data=reqz.data||{},code=Number(data.code||reqz.code||0),authority=data.authority;if(code!==100||!authority)return json({error:'payment_request_failed',details:reqz.errors||[]},502);await env.DB.batch([env.DB.prepare("UPDATE payments SET status='REDIRECTED',authority=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID'").bind(authority,p.id),env.DB.prepare('INSERT INTO payment_attempts(id,payment_id,authority,request_code,raw_status) VALUES(?,?,?,?,?)').bind(uid(),p.id,authority,code,JSON.stringify({code,message:data.message||null}))]);const host=env.PAYMENT_ENV==='production'?'https://www.zarinpal.com':'https://sandbox.zarinpal.com';return json({ok:true,url:host+'/pg/StartPay/'+authority})}
 if(u.pathname==='/api/payment/callback'&&req.method==='GET'){const authority=u.searchParams.get('Authority'),status=u.searchParams.get('Status');if(!authority)return json({error:'missing_authority'},400);const p=await env.DB.prepare('SELECT p.*,o.status order_status FROM payments p JOIN orders o ON o.id=p.order_id WHERE p.authority=?').bind(authority).first();if(!p)return json({error:'payment_not_found'},404);if(status!=='OK'){await env.DB.prepare("UPDATE payments SET status='FAILED',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID'").bind(p.id).run();return Response.redirect(frontend(env)+'/#/payment/failed?order='+p.order_id,302)}if(p.status==='PAID')return Response.redirect(frontend(env)+'/#/payment/success?order='+p.order_id,302);if(!env.ZARINPAL_MERCHANT_ID)return json({error:'payment_not_configured'},503);const vr=await zarin(env,'verify.json',{amount:p.amount_irt,authority});const code=Number(vr.code||vr.data?.code||0),ref=vr.data?.ref_id,ok=code===100||code===101;await env.DB.prepare('INSERT INTO payment_attempts(id,payment_id,authority,verify_code,callback_status,raw_status) VALUES(?,?,?,?,?,?)').bind(uid(),p.id,authority,code||null,status,JSON.stringify({code,message:vr.message||vr.data?.message||null})).run();if(!ok){await env.DB.prepare("UPDATE payments SET status='FAILED',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID'").bind(p.id).run();return Response.redirect(frontend(env)+'/#/payment/failed?order='+p.order_id,302)}const items=(await env.DB.prepare('SELECT product_id,quantity FROM order_items WHERE order_id=?').bind(p.order_id).all()).results||[];if(!items.length)return json({error:'order_items_missing'},500);const statements=items.map(x=>env.DB.prepare("UPDATE inventory SET quantity=quantity-?,updated_at=CURRENT_TIMESTAMP WHERE product_id=? AND EXISTS (SELECT 1 FROM payments pp JOIN orders oo ON oo.id=pp.order_id WHERE pp.id=? AND pp.status!='PAID' AND oo.status='PENDING')").bind(x.quantity,x.product_id,p.id));statements.push(env.DB.prepare("UPDATE payments SET status='PAID',ref_id=COALESCE(?,ref_id),paid_at=COALESCE(paid_at,CURRENT_TIMESTAMP),updated_at=CURRENT_TIMESTAMP WHERE id=? AND status!='PAID' AND EXISTS (SELECT 1 FROM orders oo WHERE oo.id=payments.order_id AND oo.status='PENDING')").bind(ref,p.id));statements.push(env.DB.prepare("UPDATE orders SET status='PAID',updated_at=CURRENT_TIMESTAMP WHERE id=? AND status='PENDING' AND EXISTS (SELECT 1 FROM payments pp WHERE pp.order_id=orders.id AND pp.status='PAID')").bind(p.order_id));await env.DB.batch(statements);return Response.redirect(frontend(env)+'/#/payment/success?order='+p.order_id+'&ref='+encodeURIComponent(ref||''),302)}
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

 if(u.pathname==='/api/admin/products'&&req.method==='GET'){if(!(await requirePermission(me,env,'products.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT p.*,i.quantity stock FROM products p LEFT JOIN inventory i ON i.product_id=p.id ORDER BY p.created_at DESC').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/admin/products'&&req.method==='POST'){if(!(await requirePermission(me,env,'products.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req);const id=uid();await env.DB.batch([env.DB.prepare('INSERT INTO products(id,category_id,slug,sku,name,description,price_irt,active,seo_title,seo_description) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(id,b.categoryId||null,b.slug,b.sku,b.name,b.description||'',Number(b.priceIrt)||0,b.active===false?0:1,b.seoTitle||b.name,b.seoDescription||''),env.DB.prepare('INSERT INTO inventory(product_id,quantity) VALUES(?,?)').bind(id,Math.max(0,Number(b.stock)||0))]);await audit(env,me,'admin.product.create','product',id,{
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

  await env.DB.prepare(`
   UPDATE products
   SET
    name=?,
    description=?,
    price_irt=?,
    active=?,
    seo_title=?,
    seo_description=?,
    updated_at=CURRENT_TIMESTAMP
   WHERE id=?
  `).bind(
   b.name||before.name,
   b.description||before.description,
   Number(b.priceIrt ?? before.price_irt),
   b.active===false?0:1,
   b.seoTitle||before.seo_title,
   b.seoDescription||before.seo_description,
   id
  ).run();

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
 if(u.pathname==='/api/admin/settings'&&req.method==='GET'){if(!(await requirePermission(me,env,'settings.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare("SELECT key,value,updated_at FROM site_settings ORDER BY key").all();return json({items:r.results||[]})}
 if(u.pathname==='/api/admin/settings'&&req.method==='PUT'){if(!(await requirePermission(me,env,'settings.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req),allowed=['site_name','site_description','seo_title','seo_description','seo_keywords','og_image'];for(const key of allowed)if(Object.prototype.hasOwnProperty.call(b,key))await env.DB.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP").bind(key,String(b[key]??'').slice(0,2000)).run();await audit(env,me,'admin.settings.update','settings','site_settings',{updated:allowed.filter(k=>Object.prototype.hasOwnProperty.call(b,k))},req);return json({ok:true})}
 if(u.pathname==='/api/admin/coupons'&&req.method==='GET'){if(!(await requirePermission(me,env,'coupons.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT * FROM coupons ORDER BY expires_at DESC,code').all();return json({items:r.results||[]})}
 if(u.pathname==='/api/admin/coupons'&&req.method==='POST'){if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const b=await body(req),id=uid(),code=String(b.code||'').trim().toUpperCase(),kind=String(b.kind||'PERCENT').toUpperCase(),value=Math.max(0,Math.trunc(Number(b.value)||0));if(!code||!['PERCENT','FIXED'].includes(kind))return json({error:'invalid_coupon'},400);await env.DB.prepare('INSERT INTO coupons(id,code,kind,value,max_uses,active,expires_at) VALUES(?,?,?,?,?,?,?)').bind(id,code,kind,value,b.maxUses?Math.max(1,Math.trunc(Number(b.maxUses))):null,b.active===false?0:1,b.expiresAt||null).run();await audit(env,me,'admin.coupon.create','coupon',id,{after:{code,kind,value}},req);return json({ok:true,id})}
 if(u.pathname.startsWith('/api/admin/coupons/')&&req.method==='PUT'){if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM coupons WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);const b=await body(req);await env.DB.prepare('UPDATE coupons SET code=?,kind=?,value=?,max_uses=?,active=?,expires_at=? WHERE id=?').bind(String(b.code||before.code).trim().toUpperCase(),b.kind||before.kind,Math.max(0,Math.trunc(Number(b.value??before.value))),b.maxUses?Math.max(1,Math.trunc(Number(b.maxUses))):null,b.active===false?0:1,b.expiresAt||null,id).run();const after=await env.DB.prepare('SELECT * FROM coupons WHERE id=?').bind(id).first();await audit(env,me,'admin.coupon.update','coupon',id,{before,after},req);return json({ok:true})}
 if(u.pathname.startsWith('/api/admin/coupons/')&&req.method==='DELETE'){if(!(await requirePermission(me,env,'coupons.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM coupons WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);await env.DB.prepare('DELETE FROM coupons WHERE id=?').bind(id).run();await audit(env,me,'admin.coupon.delete','coupon',id,{before,after:null},req);return json({ok:true})}
 if(u.pathname==='/api/admin/reviews'&&req.method==='GET'){if(!(await requirePermission(me,env,'reviews.read')))return json({error:'forbidden'},403);const r=await env.DB.prepare('SELECT r.*,p.name product_name,u.mobile FROM reviews r JOIN products p ON p.id=r.product_id JOIN users u ON u.id=r.user_id ORDER BY r.created_at DESC LIMIT 500').all();return json({items:r.results||[]})}
 if(u.pathname.startsWith('/api/admin/reviews/')&&req.method==='PUT'){if(!(await requirePermission(me,env,'reviews.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM reviews WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);const b=await body(req);await env.DB.prepare('UPDATE reviews SET approved=? WHERE id=?').bind(b.approved?1:0,id).run();const after=await env.DB.prepare('SELECT * FROM reviews WHERE id=?').bind(id).first();await audit(env,me,'admin.review.moderate','review',id,{before,after},req);return json({ok:true})}
 if(u.pathname.startsWith('/api/admin/reviews/')&&req.method==='DELETE'){if(!(await requirePermission(me,env,'reviews.write'))||!requireCsrf(req))return json({error:'forbidden'},403);const id=u.pathname.split('/').pop(),before=await env.DB.prepare('SELECT * FROM reviews WHERE id=?').bind(id).first();if(!before)return json({error:'not_found'},404);await env.DB.prepare('DELETE FROM reviews WHERE id=?').bind(id).run();await audit(env,me,'admin.review.delete','review',id,{before,after:null},req);return json({ok:true})}
 if(u.pathname==='/api/admin/stats'&&req.method==='GET'){if(!(await requirePermission(me,env,'reports.read')))return json({error:'forbidden'},403);const [a,b,c]=await Promise.all([env.DB.prepare('SELECT COUNT(*) n FROM orders').first(),env.DB.prepare("SELECT COALESCE(SUM(total_irt),0) n FROM orders WHERE status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')").first(),env.DB.prepare('SELECT COUNT(*) n FROM users').first()]);return json({orders:a.n,revenue_irt:b.n,users:c.n})}


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
   WHERE status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
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
    COALESCE(SUM(oi.quantity),0) sold,
    COALESCE(SUM(oi.line_total_irt),0) revenue_irt
   FROM products p
   LEFT JOIN order_items oi ON oi.product_id=p.id
   GROUP BY p.id
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
   LEFT JOIN orders o ON o.user_id=u.id
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
export default {async fetch(req,env){const headers={...security,...cors(req,env)};try{const r=await route(req,env);for(const[k,v]of Object.entries(headers)){if(k==='set-cookie')continue;r.headers.set(k,v)}return r}catch(e){console.error('request_failed',{path:new URL(req.url).pathname,error:String(e)});return json({error:'internal_error'},500,headers)}}};
