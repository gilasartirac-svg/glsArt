import {cp, mkdir, readFile, writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});await cp('frontend/src','dist',{recursive:true});await cp('frontend/public','dist',{recursive:true});const release=JSON.parse(await readFile('frontend/public/mobile-release.json','utf8'));await writeFile('dist/config.js',`window.GILASART_API=${JSON.stringify(process.env.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev')};window.GILASART_APP_VERSION=${JSON.stringify(release.web?.version||'dev')};\n`);console.log('frontend built');
await cp('404.html','dist/404.html');

await mkdir('dist/admin',{recursive:true});
await writeFile('dist/admin/index.html',`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"><title>کنترل پنل گیلاس آرت</title><link rel="stylesheet" href="../styles.css?v=20260929.16"></head><body><div id="app"></div><script src="../config.js?v=20260928.9"></script><script src="../app.js?v=20260929.16" defer></script></body></html>`);
