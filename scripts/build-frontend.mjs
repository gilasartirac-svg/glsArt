import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
import {transform} from 'esbuild';
await mkdir('dist',{recursive:true});await cp('frontend/src','dist',{recursive:true});await cp('frontend/public','dist',{recursive:true});
// GitHub Pages does not automatically return HTTP 200 for clean locale routes such as /fa/.
// Generate real entry documents for every supported locale so the production homepage is
// a normal 200 document instead of depending on the 404 fallback. The <base> keeps all
// existing relative assets rooted at the deployed site while app.js still sees /fa/ etc.
const localeEntry=await readFile('frontend/src/index.html','utf8');
const localeSeo={
  fa:{lang:'fa',dir:'rtl',title:'گیلاس آرت | خرید تابلو و آثار هنری',description:'گیلاس آرت؛ فروشگاه آنلاین آثار هنری و تابلوهای دکوراتیو.'},
  ar:{lang:'ar',dir:'rtl',title:'GilasArt | متجر الأعمال الفنية واللوحات',description:'GilasArt؛ متجر إلكتروني للأعمال الفنية واللوحات الزخرفية.'},
  en:{lang:'en',dir:'ltr',title:'GilasArt | Artworks & Decorative Wall Art',description:'GilasArt online gallery and store for artworks and decorative wall art.'},
  tr:{lang:'tr',dir:'ltr',title:'GilasArt | Sanat Eserleri ve Dekoratif Tablolar',description:'GilasArt; sanat eserleri ve dekoratif tablolar için çevrim içi galeri ve mağaza.'}
};
for(const locale of ['fa','en','tr','ar']){
  const meta=localeSeo[locale];
  const canonical=`https://gilasart.ir/${locale}/`;
  const alternates=['fa','ar','en','tr'].map(l=>`<link rel="alternate" hreflang="${l}" href="https://gilasart.ir/${l}/">`).join('');
  const seo=`<link rel="canonical" href="${canonical}">${alternates}<link rel="alternate" hreflang="x-default" href="https://gilasart.ir/">`;
  let html=localeEntry.replace('<head>','<head><base href="../">');
  html=html.replace(/<html lang="[^"]+" dir="[^"]+">/, `<html lang="${meta.lang}" dir="${meta.dir}">`);
  html=html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${meta.description}">`);
  html=html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${meta.title}">`);
  html=html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${meta.description}">`);
  html=html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`);
  html=html.replace(/<link rel="canonical" href="[^"]*">/, seo);
  html=html.replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`);
  html=html.replace('"url":"https://gilasart.ir/"', `"url":"${canonical}"`);
  html=html.replace(/"inLanguage":"fa-IR"/, `"inLanguage":"${meta.lang}"`);
  await mkdir(`dist/${locale}`,{recursive:true});
  await writeFile(`dist/${locale}/index.html`,html);
}
// Generate a product-aware sitemap and static HTML product entries from the already-offline storefront snapshot.
// Product pages contain crawlable title, price and original image in the initial HTML; no runtime API/JavaScript is required to read these basics.
const siteOrigin='https://gilasart.ir';
const publicRoutes=['/','/shop','/about','/contact','/news','/articles','/terms','/privacy','/enamad','/aparat','/rewards','/support'];
let snapshot=null;
try{snapshot=JSON.parse(await readFile('frontend/public/data/storefront-index.json','utf8'))}catch{}
if(!snapshot||!Array.isArray(snapshot.products))throw new Error('Cannot generate sitemap: offline storefront snapshot is missing or invalid.');
const xmlEscape=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const htmlEscape=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const sitemapUrls=new Map();
for(const route of publicRoutes)sitemapUrls.set(siteOrigin+route,{loc:siteOrigin+route});
const productPages=(snapshot.products||[]).filter(p=>p&&p.active!==0&&p.slug&&p.name&&Number.isFinite(Number(p.price_irt))&&Number(p.price_irt)>=0&&p.image);
for(const p of productPages){
  const slug=String(p.slug);
  const loc=siteOrigin+'/'+encodeURIComponent(slug)+'/';
  sitemapUrls.set(loc,{loc,lastmod:p.updated_at||p.created_at});
  const title=String(p.name).slice(0,500);
  const image=String(p.image).startsWith('http')?String(p.image):siteOrigin+(String(p.image).startsWith('/')?'':'/')+String(p.image);
  const description=('خرید '+title+' از گیلاس آرت؛ تابلوهای معرق مس برجسته و آثار هنری دست‌ساز.').slice(0,300);
  const lastmod=String(p.updated_at||p.created_at||'');
  const validLastmod=/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(lastmod);
  const isoLastmod=validLastmod?(lastmod.includes('T')?lastmod.replace(' ','T')+'+03:30':lastmod+'T00:00:00+03:30'):'';
  const canonical=loc;
  const imageHtml='<img src="'+htmlEscape(image)+'" alt="'+htmlEscape(title)+'" loading="eager" fetchpriority="high">';
  let productHtml=localeEntry
    .replace('<head>','<head><base href="/">')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="'+htmlEscape(description)+'">')
    .replace(/<meta property="og:type" content="[^"]*">/, '<meta property="og:type" content="product">')
    .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="'+htmlEscape(title)+' | گیلاس آرت">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="'+htmlEscape(description)+'">')
    .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="'+canonical+'">')
    .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="'+canonical+'">')
    .replace(/<title>[^<]*<\/title>/, '<title>'+htmlEscape(title)+' | گیلاس آرت</title>')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'Product',name:title,image:[image],url:canonical,description}).replace(/</g,'\\u003c')+'</script>');
  const appStart=productHtml.indexOf('<div id="app">');
  const appEnd=productHtml.indexOf('</div><script src="config.js',appStart);
  if(appStart<0||appEnd<0)throw new Error('Could not prepare crawlable product HTML for '+slug);
  const crawlableApp='<div id="app"><main class="wrap page" id="crawlable-product"><article><h1>'+htmlEscape(title)+'</h1>'+imageHtml+'<p class="product-price"><strong>قیمت: '+new Intl.NumberFormat('fa-IR').format(Number(p.price_irt))+' تومان</strong></p><p>'+htmlEscape(description)+'</p><p><a href="'+canonical+'">مشاهده جزئیات و خرید محصول</a></p></article></main></div>';
  const finalProductHtml=productHtml.slice(0,appStart)+crawlableApp+productHtml.slice(appEnd+'</div>'.length);
  const productDir='dist/'+slug;
  await mkdir(productDir,{recursive:true});
  await writeFile(productDir+'/index.html',finalProductHtml);
}
const sitemapBody=Array.from(sitemapUrls.values()).map(x=>'<url><loc>'+xmlEscape(x.loc)+'</loc>'+(x.lastmod&&/^\d{4}-\d{2}-\d{2}/.test(String(x.lastmod))?'<lastmod>'+xmlEscape(String(x.lastmod).slice(0,10))+'</lastmod>':'')+'</url>').join('');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+sitemapBody+'</urlset>');
const release=JSON.parse(await readFile('frontend/public/mobile-release.json','utf8'));const releaseVersion=String(release.web?.version||'dev').replace(/[^A-Za-z0-9._-]/g,'-');const buildVersion=String(process.env.GITHUB_SHA||releaseVersion).slice(0,12).replace(/[^A-Za-z0-9._-]/g,'-');const swSource=await readFile('dist/sw.js','utf8');await writeFile('dist/sw.js',swSource.replaceAll('__GILASART_VERSION__',buildVersion));await writeFile('dist/config.js',`window.GILASART_API=${JSON.stringify(process.env.GILASART_API||'https://api.gilasart.ir')};window.GILASART_APP_VERSION=${JSON.stringify(release.web?.version||'dev')};\n`);// Production asset optimization: minify JS/CSS only in dist so source files stay readable.
for(const [file,loader] of [['dist/app.js','js'],['dist/styles.css','css']]){
  const source=await readFile(file,'utf8');
  const result=await transform(source,{loader,minify:true,sourcemap:false,target:['es2020']});
  await writeFile(file,result.code);
}
console.log('frontend built');
await cp('404.html','dist/404.html');
await cp('CNAME','dist/CNAME');
// Cache-bust the SPA shell assets on every Pages deployment. Clean client-side routes
// are served through 404.html, so a fixed app.js query can otherwise leave an older
// router cached at production even after a successful Pages deployment.
for(const file of ['dist/index.html','dist/404.html','dist/admin/index.html',...['fa','en','tr','ar'].map(l=>'dist/'+l+'/index.html')]){
  try{
    let html=await readFile(file,'utf8');
    html=html.replace(/(styles\.css|responsive-production\.css|config\.js|app\.js)(?:\?v=[^"'\\s>]*)?/g,(_,asset)=>asset+'?v='+buildVersion);
    await writeFile(file,html);
  }catch{}
}

await mkdir('dist/admin',{recursive:true});
await writeFile('dist/admin/index.html',`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><title>کنترل پنل گیلاس آرت</title><link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"><link rel="stylesheet" href="../styles.css?v=20261005.1"><link rel="stylesheet" href="../admin/admin-ui.css?v=20261008-admin-ui"></head><body><div id="app"></div><script src="../config.js?v=20260928.9"></script><script src="../app.js?v=20261005.1" defer></script></body></html>`);
