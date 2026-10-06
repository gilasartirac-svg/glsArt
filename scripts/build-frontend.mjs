import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
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
  html=html.replace(/"url":"https:\/\/gilasart\.ir\/"|\\"url\\":\\"https:\/\/gilasart\.ir\\/\\"/, `"url":"${canonical}"`);
  html=html.replace(/"inLanguage":"fa-IR"/, `"inLanguage":"${meta.lang}"`);
  await mkdir(`dist/${locale}`,{recursive:true});
  await writeFile(`dist/${locale}/index.html`,html);
}
const release=JSON.parse(await readFile('frontend/public/mobile-release.json','utf8'));await writeFile('dist/config.js',`window.GILASART_API=${JSON.stringify(process.env.GILASART_API||'https://api.gilasart.ir')};window.GILASART_APP_VERSION=${JSON.stringify(release.web?.version||'dev')};\n`);console.log('frontend built');
await cp('404.html','dist/404.html');
await cp('CNAME','dist/CNAME');

await mkdir('dist/admin',{recursive:true});
await writeFile('dist/admin/index.html',`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><title>کنترل پنل گیلاس آرت</title><link rel="stylesheet" href="../styles.css?v=20261005.1"></head><body><div id="app"></div><script src="../config.js?v=20260928.9"></script><script src="../app.js?v=20261005.1" defer></script></body></html>`);
