import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';

const locales=['fa','en','tr','ar'];
const dicts={};
for(const l of locales)dicts[l]=JSON.parse(await readFile('frontend/public/i18n/'+l+'.json','utf8'));

test('phase 12: locale dictionaries are aligned',()=>{
 const base=Object.keys(dicts.fa.strings).sort();
 for(const l of locales){
  assert.equal(dicts[l].version,1,l+': invalid version');
  assert.equal(dicts[l].locale,l,l+': invalid locale');
  assert.deepEqual(Object.keys(dicts[l].strings).sort(),base,l+': locale key drift');
  assert.ok(['rtl','ltr'].includes(dicts[l].direction),l+': invalid direction');
 }
});

function staticPersianStrings(source){
 const out=new Set();
 for(const m of source.matchAll(/>([^<>{}\r\n]{2,180})</g)){
  const s=m[1].trim();
  if(/[\u0600-\u06FF]/.test(s)&&!s.includes('$'+'{'))out.add(s);
 }
 for(const m of source.matchAll(/(?:placeholder|title|aria-label|alt)=["']([^"']{2,180})["']/g)){
  const s=m[1].trim();
  if(/[\u0600-\u06FF]/.test(s)&&!s.includes('$'+'{'))out.add(s);
 }
 return out;
}

const app=await readFile('frontend/src/app.js','utf8');
const adminFiles=(await readdir('frontend/src/admin/pages',{withFileTypes:true})).filter(x=>x.isFile()&&x.name.endsWith('.js')).map(x=>x.name);
const sources=[['frontend/src/app.js',app]];
for(const name of adminFiles)sources.push(['frontend/src/admin/pages/'+name,await readFile(join('frontend/src/admin/pages',name),'utf8')]);
const faValues=new Set(Object.values(dicts.fa.strings).map(v=>String(v).trim()));
const gaps=[];
for(const [file,source] of sources)for(const value of staticPersianStrings(source))if(!faValues.has(value))gaps.push({file,value});

test('phase 12: no user-facing Persian text is outside i18n',()=>{
 assert.equal(gaps.length,0,'Found '+gaps.length+' user-facing Persian strings outside i18n.\n'+gaps.slice(0,80).map(x=>x.file+': '+x.value).join('\n'));
});
