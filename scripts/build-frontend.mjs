import {cp, mkdir, readFile, readdir, writeFile} from 'node:fs/promises';
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
const locales=['fa','en','tr','ar'];
for(const locale of locales){
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
// Torob XML sitemap: list product URLs only; product details belong in each product page HTML.
let snapshot=null,productDetails={};
try{snapshot=JSON.parse(await readFile('frontend/public/data/storefront-index.json','utf8'))}catch{}
try{
 const detailSnapshot=JSON.parse(await readFile('frontend/public/data/storefront-attributes.json','utf8'));
 if(Number(detailSnapshot?.schemaVersion)===1&&detailSnapshot.byProductId&&typeof detailSnapshot.byProductId==='object')productDetails=detailSnapshot.byProductId;
}catch{}
if(!snapshot||!Array.isArray(snapshot.products))throw new Error('Cannot generate sitemap: offline storefront snapshot is missing or invalid.');
const xmlEscape=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const htmlEscape=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const sitemapUrls=new Map();
const productPages=(snapshot.products||[]).filter(p=>p&&Number(p.active)===1&&p.slug&&p.name&&Number.isFinite(Number(p.price_irt))&&Number(p.price_irt)>=0&&p.image&&/^[A-Za-z0-9_-]+$/.test(String(p.slug)));
for(const p of productPages){
  const slug=String(p.slug);
  const loc=siteOrigin+'/'+encodeURIComponent(slug)+'/';
  sitemapUrls.set(loc,{loc,lastmod:p.updated_at||p.created_at});
  const title=String(p.name).slice(0,500);
  const detail=productDetails[String(p.id)]||{};
  const seoTitle=String(detail.seo_title||title+' | گیلاس آرت').slice(0,500);
  const image=String(p.image).startsWith('http')?String(p.image):siteOrigin+(String(p.image).startsWith('/')?'':'/')+String(p.image);
  const description=String(detail.seo_description||detail.description||('خرید '+title+' از گیلاس آرت؛ تابلوهای معرق مس برجسته و آثار هنری دست‌ساز.')).slice(0,500);
  const basePrice=Number(p.price_irt);
  const saleEnd=Date.parse(String(p.flash_sale_ends_at||''));
  const salePrice=Number(p.flash_sale_price_irt);
  const saleActive=Number(p.flash_sale_active)===1&&Number.isFinite(saleEnd)&&saleEnd>Date.now()&&Number.isFinite(salePrice)&&salePrice>0&&Number.isFinite(basePrice)&&basePrice>0&&salePrice<basePrice;
  const currentPrice=saleActive?salePrice:basePrice;
  const oldPrice=Number.isFinite(basePrice)&&basePrice>=currentPrice?basePrice:currentPrice;
  const availability=Number.isFinite(Number(p.stock))&&Number(p.stock)>0?'instock':'outofstock';
  const productId=String(p.sku||p.id);
  const torobMeta='<meta name="product_id" content="'+htmlEscape(productId)+'"><meta name="product_name" content="'+htmlEscape(title)+'"><meta property="og:image" content="'+htmlEscape(image)+'"><meta name="product_price" content="'+htmlEscape(currentPrice)+'"><meta name="product_old_price" content="'+htmlEscape(oldPrice)+'"><meta name="availability" content="'+availability+'">';
  const lastmod=String(p.updated_at||p.created_at||'');
  const validLastmod=/^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2})?$/.test(lastmod);
  const isoLastmod=validLastmod?(lastmod.includes('T')?lastmod.replace(' ','T')+'+03:30':lastmod+'T00:00:00+03:30'):'';
  const canonical=loc;
  const imageHtml='<img src="'+htmlEscape(image)+'" alt="'+htmlEscape(title)+'" loading="eager" fetchpriority="high">';
  let productHtml=localeEntry
    .replace('<head>','<head><base href="/">')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="'+htmlEscape(description)+'">')
    .replace(/<meta property="og:type" content="[^"]*">/, '<meta property="og:type" content="product">')
     .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="'+htmlEscape(seoTitle)+'">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="'+htmlEscape(description)+'">')
    .replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="'+canonical+'">')
    .replace(/<meta property="og:site_name" content="[^"]*">/, '<meta property="og:site_name" content="گیلاس آرت">'+torobMeta)
    .replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="'+canonical+'">')
    .replace(/<title>[^<]*<\/title>/, '<title>'+htmlEscape(seoTitle)+'</title>')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'Product',name:title,image:[image],url:canonical,description,sku:productId,offers:{'@type':'Offer',price:currentPrice,priceCurrency:'IRR',availability:availability==='instock'?'https://schema.org/InStock':'https://schema.org/OutOfStock'}}).replace(/</g,'\\u003c')+'</script>');
  productHtml=productHtml.replace('</head>','<meta name="twitter:title" content="'+htmlEscape(seoTitle)+'"><meta name="twitter:description" content="'+htmlEscape(description)+'"><meta name="twitter:image" content="'+htmlEscape(image)+'"></head>');
  const appStart=productHtml.indexOf('<div id="app">');
  const scriptsStart=productHtml.indexOf('<script src="config.js',appStart);
  if(appStart<0||scriptsStart<0)throw new Error('Could not prepare crawlable product HTML for '+slug);
  const crawlableApp='<div id="app"><main class="wrap page" id="crawlable-product"><article><h1>'+htmlEscape(title)+'</h1>'+imageHtml+'<p class="product-price"><strong>قیمت: '+new Intl.NumberFormat('fa-IR').format(currentPrice)+' ریال</strong></p><p>'+htmlEscape(description)+'</p><p><a href="'+canonical+'">مشاهده جزئیات و خرید محصول</a></p></article></main></div>';
  const finalProductHtml=productHtml.slice(0,appStart)+crawlableApp+productHtml.slice(scriptsStart);
  const productDir='dist/'+slug;
  await mkdir(productDir,{recursive:true});
  await writeFile(productDir+'/index.html',finalProductHtml);
}
// Give the homepage useful initial HTML before the SPA hydrates, with metadata and internal product links.
const homeTitle='گیلاس آرت | خرید تابلو و آثار هنری';
const homeDescription='گیلاس آرت؛ فروشگاه تخصصی تابلوهای معرق مس برجسته و آثار هنری دکوراتیو.';
const homeProductImage=productPages[0]?(String(productPages[0].image).startsWith('http')?String(productPages[0].image):siteOrigin+(String(productPages[0].image).startsWith('/')?'':'/')+String(productPages[0].image)):'';
let homeHtml=await readFile('dist/index.html','utf8');
homeHtml=homeHtml.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+htmlEscape(homeDescription)+'">');
homeHtml=homeHtml.replace(/<meta name="robots" content="[^"]*">/,'<meta name="robots" content="index,follow,max-image-preview:large">');
homeHtml=homeHtml.replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+htmlEscape(homeTitle)+'">');
homeHtml=homeHtml.replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+htmlEscape(homeDescription)+'">');
homeHtml=homeHtml.replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+siteOrigin+'/">');
homeHtml=homeHtml.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+siteOrigin+'/">');
homeHtml=homeHtml.replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(homeTitle)+'</title>');
homeHtml=homeHtml.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'گیلاس آرت',url:siteOrigin+'/',description:homeDescription,inLanguage:'fa-IR'}).replace(/</g,'\\u003c')+'</script>');
homeHtml=homeHtml.replace('</head>','<meta name="twitter:title" content="'+htmlEscape(homeTitle)+'"><meta name="twitter:description" content="'+htmlEscape(homeDescription)+'">'+(homeProductImage?'<meta property="og:image" content="'+htmlEscape(homeProductImage)+'"><meta name="twitter:image" content="'+htmlEscape(homeProductImage)+'">':'')+'</head>');
const homeAppStart=homeHtml.indexOf('<div id="app">'),homeScriptsStart=homeHtml.indexOf('<script src="config.js',homeAppStart);
if(homeAppStart<0||homeScriptsStart<0)throw new Error('Could not prepare crawlable homepage HTML.');
const homePreview=productPages.slice(0,6).map(p=>'<li><a href="'+siteOrigin+'/'+encodeURIComponent(String(p.slug))+'/">'+htmlEscape(p.name)+'</a></li>').join('');
const homeCrawlable='<div id="app"><main class="wrap page seo-prerender" dir="rtl"><h1>تابلوهای معرق مس برجسته و آثار هنری گیلاس آرت</h1><p>مجموعه‌ای از تابلوهای معرق مس برجسته و آثار هنری دکوراتیو دست‌ساز را در فروشگاه گیلاس آرت ببینید.</p><p><a href="'+siteOrigin+'/shop/">مشاهده همه تابلوها</a></p><ul aria-label="نمونه آثار">'+homePreview+'</ul><nav aria-label="صفحات اصلی"><a href="'+siteOrigin+'/about/">درباره ما</a> · <a href="'+siteOrigin+'/contact/">تماس با ما</a> · <a href="'+siteOrigin+'/news/">اخبار</a></nav></main></div>';
homeHtml=homeHtml.slice(0,homeAppStart)+homeCrawlable+homeHtml.slice(homeScriptsStart);
await writeFile('dist/index.html',homeHtml);
// Generate page-specific crawlable HTML for public landing pages and noindex shells for private flows.
const routeSeoPages=[
 {path:'/shop/',folder:'shop',title:'خرید تابلو معرق مس و آثار هنری | فروشگاه گیلاس آرت',description:'خرید آنلاین تابلوهای معرق مس برجسته و آثار هنری دست‌ساز از گیلاس آرت؛ مشاهده مجموعه آثار، بررسی قیمت‌ها و انتخاب تابلو برای دکوراسیون.',heading:'فروشگاه تابلوهای معرق مس و آثار هنری',intro:'مجموعه تابلوهای معرق مس برجسته و آثار هنری دست‌ساز گیلاس آرت را ببینید، قیمت‌ها را مقایسه کنید و اثر مناسب فضای خود را انتخاب کنید.',type:'CollectionPage'},
 {path:'/about/',folder:'about',title:'درباره گیلاس آرت | هنر معرق مس ایرانی',description:'با گیلاس آرت، هنر معرق مس برجسته، رویکرد هنری و مجموعه آثار دست‌ساز ما آشنا شوید؛ هنری اصیل برای فضاهای ماندگار.',heading:'درباره گیلاس آرت',intro:'روایت گیلاس آرت، از هنر ایرانی تا انتخابی برای ماندن؛ آشنایی با مجموعه‌ای از تابلوهای معرق مس برجسته و آثار هنری دکوراتیو.',type:'AboutPage'},
 {path:'/contact/',folder:'contact',title:'تماس با گیلاس آرت | مشاوره و راه‌های ارتباطی',description:'برای مشاوره خرید تابلوهای معرق مس، پیگیری سفارش و دریافت اطلاعات با گیلاس آرت در ارتباط باشید.',heading:'تماس با گیلاس آرت',intro:'راه‌های ارتباط با گیلاس آرت را ببینید و برای مشاوره انتخاب اثر، خرید و پیگیری سفارش با ما در تماس باشید.',type:'ContactPage'},
 {path:'/news/',folder:'news',title:'اخبار و تازه‌های گیلاس آرت | مقالات و رویدادها',description:'آخرین خبرها، نوشته‌ها و مطالب مرتبط با گیلاس آرت، هنر معرق مس و انتخاب آثار هنری برای دکوراسیون را دنبال کنید.',heading:'اخبار و تازه‌های گیلاس آرت',intro:'در این بخش تازه‌ترین خبرها و نوشته‌های گیلاس آرت را درباره آثار هنری، معرق مس و دکوراسیون دنبال کنید.',type:'CollectionPage'},
 {path:'/articles/',folder:'articles',title:'مقالات هنر و دکوراسیون | گیلاس آرت',description:'مقاله‌ها و راهنماهای گیلاس آرت درباره هنر معرق مس، نگهداری تابلوها و انتخاب آثار هنری برای دکوراسیون را بخوانید.',heading:'مقالات هنر و دکوراسیون',intro:'راهنماها و مقاله‌های مرتبط با هنر معرق مس، نگهداری تابلوها و انتخاب آثار هنری برای فضاهای مختلف.',type:'CollectionPage'},
 {path:'/terms/',folder:'terms',title:'قوانین و شرایط خرید | گیلاس آرت',description:'قوانین و شرایط استفاده از وب‌سایت، ثبت سفارش، پرداخت و خرید آثار هنری از فروشگاه گیلاس آرت را مطالعه کنید.',heading:'قوانین و شرایط خرید',intro:'پیش از ثبت سفارش، شرایط خرید، پرداخت و استفاده از خدمات فروشگاه گیلاس آرت را مطالعه کنید.',type:'WebPage'}
];
for(const page of routeSeoPages){
 const canonical=siteOrigin+page.path;
 const socialImage=homeProductImage;
 let html=localeEntry.replace('<head>','<head><base href="/">');
 html=html.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+htmlEscape(page.description)+'">');
 html=html.replace(/<meta name="robots" content="[^"]*">/,'<meta name="robots" content="index,follow,max-image-preview:large">');
 html=html.replace(/<meta property="og:type" content="[^"]*">/,'<meta property="og:type" content="website">');
 html=html.replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+htmlEscape(page.title)+'">');
 html=html.replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+htmlEscape(page.description)+'">');
 html=html.replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+canonical+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+canonical+'">');
 html=html.replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(page.title)+'</title>');
 html=html.replace('</head>','<meta name="twitter:title" content="'+htmlEscape(page.title)+'"><meta name="twitter:description" content="'+htmlEscape(page.description)+'">'+(socialImage?'<meta property="og:image" content="'+htmlEscape(socialImage)+'"><meta name="twitter:image" content="'+htmlEscape(socialImage)+'">':'')+'</head>');
 const jsonLd={'@context':'https://schema.org','@type':page.type,name:page.title,description:page.description,url:canonical,inLanguage:'fa-IR',isPartOf:{'@type':'WebSite',name:'گیلاس آرت',url:siteOrigin+'/' }};
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,'<script type="application/ld+json">'+JSON.stringify(jsonLd).replace(/</g,'\\u003c')+'</script>');
 const appStart=html.indexOf('<div id="app">'),scriptsStart=html.indexOf('<script src="config.js',appStart);
 if(appStart<0||scriptsStart<0)throw new Error('Could not prepare static SEO shell for '+page.path);
 let crawlable='<div id="app"><main class="wrap page seo-prerender" dir="rtl"><article><h1>'+htmlEscape(page.heading)+'</h1><p>'+htmlEscape(page.intro)+'</p>';
 if(page.folder==='shop'){
  const preview=productPages.slice(0,12).map(p=>'<article class="seo-product-preview"><a href="'+siteOrigin+'/'+encodeURIComponent(String(p.slug))+'/"><img src="'+htmlEscape(String(p.image).startsWith('http')?String(p.image):siteOrigin+(String(p.image).startsWith('/')?'':'/')+String(p.image))+'" alt="'+htmlEscape(p.name)+'" loading="lazy"><h2>'+htmlEscape(p.name)+'</h2></a><p>قیمت: '+new Intl.NumberFormat('fa-IR').format(Number(p.price_irt))+' ریال</p></article>').join('');
  crawlable+='<section aria-label="نمونه آثار موجود">'+preview+'</section>';
 }
 crawlable+='<nav aria-label="صفحات اصلی"><a href="'+siteOrigin+'/shop/">فروشگاه</a> · <a href="'+siteOrigin+'/about/">درباره ما</a> · <a href="'+siteOrigin+'/contact/">تماس با ما</a> · <a href="'+siteOrigin+'/news/">اخبار</a></nav></article></main></div>';
 html=html.slice(0,appStart)+crawlable+html.slice(scriptsStart);
 await mkdir('dist/'+page.folder,{recursive:true});
 await writeFile('dist/'+page.folder+'/index.html',html);
}
const privateSeoPages=[
 {path:'/cart/',folder:'cart',title:'سبد خرید | گیلاس آرت',description:'سبد خرید حساب کاربری گیلاس آرت.',heading:'سبد خرید'},
 {path:'/account/',folder:'account',title:'حساب کاربری | گیلاس آرت',description:'ورود و مدیریت حساب کاربری در گیلاس آرت.',heading:'حساب کاربری'},
 {path:'/rewards/',folder:'rewards',title:'باشگاه امتیاز | گیلاس آرت',description:'باشگاه امتیاز ویژه اعضای واردشده گیلاس آرت.',heading:'باشگاه امتیاز'},
 {path:'/checkout/',folder:'checkout',title:'تکمیل سفارش | گیلاس آرت',description:'تکمیل سفارش در فروشگاه گیلاس آرت.',heading:'تکمیل سفارش'},
 {path:'/payment/',folder:'payment',title:'پرداخت سفارش | گیلاس آرت',description:'پرداخت سفارش در فروشگاه گیلاس آرت.',heading:'پرداخت سفارش'}
];
for(const page of privateSeoPages){
 let html=localeEntry.replace('<head>','<head><base href="/">');
 html=html.replace(/<meta name="description" content="[^"]*">/,'<meta name="description" content="'+htmlEscape(page.description)+'">');
 html=html.replace(/<meta name="robots" content="[^"]*">/,'<meta name="robots" content="noindex,follow">');
 html=html.replace(/<meta property="og:url" content="[^"]*">/,'<meta property="og:url" content="'+siteOrigin+page.path+'">');
 html=html.replace(/<link rel="canonical" href="[^"]*">/,'<link rel="canonical" href="'+siteOrigin+page.path+'">');
 html=html.replace(/<title>[^<]*<\/title>/,'<title>'+htmlEscape(page.title)+'</title>');
 html=html.replace(/<meta property="og:title" content="[^"]*">/,'<meta property="og:title" content="'+htmlEscape(page.title)+'">');
 html=html.replace(/<meta property="og:description" content="[^"]*">/,'<meta property="og:description" content="'+htmlEscape(page.description)+'">');
 html=html.replace('</head>','<meta name="twitter:title" content="'+htmlEscape(page.title)+'"><meta name="twitter:description" content="'+htmlEscape(page.description)+'">'+(homeProductImage?'<meta property="og:image" content="'+htmlEscape(homeProductImage)+'"><meta name="twitter:image" content="'+htmlEscape(homeProductImage)+'">':'')+'</head>');
 const appStart=html.indexOf('<div id="app">'),scriptsStart=html.indexOf('<script src="config.js',html.indexOf('<div id="app">'));
 if(appStart<0||scriptsStart<0)throw new Error('Could not prepare noindex shell for '+page.path);
 const shell='<div id="app"><main class="wrap page"><section class="panel"><h1>'+htmlEscape(page.heading)+'</h1><p>'+htmlEscape(page.description)+'</p><a href="'+siteOrigin+'/account/">ورود به حساب کاربری</a></section></main></div>';
 html=html.slice(0,appStart)+shell+html.slice(scriptsStart);
 await mkdir('dist/'+page.folder,{recursive:true});
 await writeFile('dist/'+page.folder+'/index.html',html);
}
const sitemapBody=Array.from(sitemapUrls.values()).map(x=>'<url><loc>'+xmlEscape(x.loc)+'</loc>'+(x.lastmod&&/^\d{4}-\d{2}-\d{2}/.test(String(x.lastmod))?'<lastmod>'+xmlEscape(String(x.lastmod).slice(0,10))+'</lastmod>':'')+'</url>').join('');
await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+sitemapBody+'</urlset>');
 // Keep /sitemap.xml product-only for the existing Torob feed contract, and publish
 // a separate Google sitemap for crawlable public landing pages. A sitemap index
 // advertises both without changing the established product-feed URL.
 const publicPagePaths=['/','/shop/','/about/','/contact/','/news/','/articles/','/terms/'];
 const publicPageXml=publicPagePaths.map(path=>'<url><loc>'+xmlEscape(siteOrigin+path)+'</loc></url>').join('');
 await writeFile('dist/sitemap-pages.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+publicPageXml+'</urlset>');
 const sitemapIndex='<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>'+siteOrigin+'/sitemap-pages.xml</loc></sitemap><sitemap><loc>'+siteOrigin+'/sitemap.xml</loc></sitemap></sitemapindex>';
 await writeFile('dist/sitemap-index.xml',sitemapIndex);
const release=JSON.parse(await readFile('frontend/public/mobile-release.json','utf8'));const releaseVersion=String(release.web?.version||'dev').replace(/[^A-Za-z0-9._-]/g,'-');const buildVersion=String(process.env.GITHUB_SHA||releaseVersion).slice(0,12).replace(/[^A-Za-z0-9._-]/g,'-');const swSource=await readFile('dist/sw.js','utf8');await writeFile('dist/sw.js',swSource.replaceAll('__GILASART_VERSION__',buildVersion));await writeFile('dist/config.js',`window.GILASART_API=${JSON.stringify(process.env.GILASART_API||'https://api.gilasart.ir')};window.GILASART_APP_VERSION=${JSON.stringify(release.web?.version||'dev')};\n`);// Rejoin the normalized keyed detail file at runtime without duplicating it in the lightweight product index.
const builtAppPath='dist/app.js';
let builtAppSource=await readFile(builtAppPath,'utf8');
const snapshotLoadOld=`const d=await r.json();
   if(Number(d?.schemaVersion)!==2||!Array.isArray(d.products)||!Array.isArray(d.categories)||d.products.length<1)return null;
   return d;`;
const snapshotLoadNew=`const d=await r.json();
   if(Number(d?.schemaVersion)!==2||!Array.isArray(d.products)||!Array.isArray(d.categories)||d.products.length<1)return null;
   const detailResponse=await fetch(dataRoot()+'storefront-attributes.json?v='+version,{cache:'no-store',credentials:'same-origin'});
   if(!detailResponse.ok)return null;
   const detailPayload=await detailResponse.json();
   if(Number(detailPayload?.schemaVersion)!==1||!detailPayload?.byProductId||typeof detailPayload.byProductId!=='object')return null;
   for(const product of d.products){
    const detail=detailPayload.byProductId[String(product.id)];
    if(!detail||!Array.isArray(detail.attributes)||!Array.isArray(detail.images)||!Array.isArray(detail.categories)||!Array.isArray(detail.reviews))return null;
    Object.assign(product,{attributes:detail.attributes,images:detail.images,categories:detail.categories,reviews:detail.reviews,description:detail.description||'',seo_title:detail.seo_title||'',seo_description:detail.seo_description||'',video_url:detail.video_url||''});
   }
   return d;`;
if(!builtAppSource.includes(snapshotLoadOld))throw new Error('Could not apply keyed offline product-detail loader; refusing production build.');
builtAppSource=builtAppSource.replace(snapshotLoadOld,snapshotLoadNew);
await writeFile(builtAppPath,builtAppSource);
// Production asset optimization: minify JS/CSS only in dist so source files stay readable.
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
await writeFile('dist/admin/index.html',`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><title>کنترل پنل گیلاس آرت</title><link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"><link rel="stylesheet" href="../styles.css?v=20261005.1"><link rel="stylesheet" href="../admin/admin-ui.css?v=20261016-admin-responsive-v1"></head><body><div id="app"></div><script src="../config.js?v=20260928.9"></script><script src="../app.js?v=20261005.1" defer></script></body></html>`);

 // Cache-bust assets in every generated HTML entry, including nested routes such as
 // /shop/ and /payment/manual/ plus crawlable static product pages and admin shell.
 async function refreshHtmlAssetVersions(dir){
  for(const entry of await readdir(dir,{withFileTypes:true})){
   const file=dir+'/'+entry.name;
   if(entry.isDirectory()){await refreshHtmlAssetVersions(file);continue;}
   if(!entry.isFile()||!entry.name.endsWith('.html'))continue;
   let html=await readFile(file,'utf8');
   html=html.replace(/(styles\.css|responsive-production\.css|config\.js|app\.js)(?:\?v=[^"'\s>]*)?/g,(_,asset)=>asset+'?v='+buildVersion);
   await writeFile(file,html);
  }
 }
 await refreshHtmlAssetVersions('dist');
