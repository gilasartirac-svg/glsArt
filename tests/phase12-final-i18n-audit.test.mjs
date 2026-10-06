import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const locales=['fa','en','tr','ar'];
const dicts={};
for(const l of locales)dicts[l]=JSON.parse(await readFile('frontend/public/i18n/'+l+'.json','utf8'));
test('phase 12: locale dictionaries are aligned',()=>{
 const base=Object.keys(dicts.fa.strings).sort();
 for(const l of locales){
  assert.equal(dicts[l].version,1,l+': invalid version');
  assert.equal(dicts[l].locale,l,l+': invalid locale');
  assert.deepEqual(Object.keys(dicts[l].strings).sort(),base,l+': locale key drift');
 }
});
const sources=[['frontend/src/app.js',await readFile('frontend/src/app.js','utf8')]];
const adminEntries=await readdir('frontend/src/admin',{recursive:true});
for(const rel of adminEntries){if(String(rel).endsWith('.js'))sources.push(['frontend/src/admin/'+rel,await readFile('frontend/src/admin/'+rel,'utf8')]);}
const faValues=new Set(Object.values(dicts.fa.strings).map(v=>String(v).trim()).filter(Boolean));
const gaps=new Set();
function add(s){
 s=String(s||'').trim();
 if(!s||s.length>180||!/[\u0600-\u06FF]/.test(s)||s.includes('$'+'{'))return;
 if(/^(?:[۰-۹]+|[+−×·٪\s]+)$/.test(s))return;
 if(!faValues.has(s))gaps.add(s);
}
for(const [file,source] of sources){\nfor(const tm of source.split('`').filter((_,i)=>i%2===1)){
 const tpl=tm.replace(/\$\{[\s\S]*?\}/g,' ');
 for(const m of tpl.matchAll(/>([^<>\r\n]{2,180})</g))add(m[1]);
 for(const m of tpl.matchAll(/(?:placeholder|title|aria-label|alt)=(['"])(.*?)\1/g))add(m[2]);
}
for(const m of source.matchAll(/\b(?:alert|confirm)\s*\(\s*['"]([^'"]+)['"]/g))add(m[1]);\n}\n}
test('phase 12: every detected static user-facing Persian string is registered in i18n',()=>{
 assert.equal(gaps.size,0,'Unregistered user-facing Persian strings: '+gaps.size+'\\n'+[...gaps].slice(0,120).join('\\n'));
});