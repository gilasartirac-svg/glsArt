import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const app=fs.readFileSync(path.join(root,'frontend/src/app.js'),'utf8');
const css=fs.readFileSync(path.join(root,'frontend/src/styles.css'),'utf8');
const langs=['fa','en','tr','ar'];
const dicts=Object.fromEntries(langs.map(l=>[l,JSON.parse(fs.readFileSync(path.join(root,'frontend/public/i18n',l+'.json'),'utf8'))]));

test('phase 9 special routes are registered',()=>{
  for(const route of ['privacy','enamad','aparat']) assert.match(app,new RegExp("['\\\"]"+route+"['\\\"]"));
  assert.match(app,/privacyPage\(\)/);
  assert.match(app,/enamadPage\(\)/);
  assert.match(app,/aparatPage\(\)/);
});

test('phase 9 public locale routing includes special pages',()=>{
  assert.match(app,/privacy.*enamad.*aparat.*support/);
});

test('privacy and Enamad pages use shared i18n dictionaries',()=>{
  for(const key of [
    'privacy.title','privacy.lead','privacy.collectionTitle','privacy.collectionBody',
    'privacy.useTitle','privacy.useBody','privacy.providersTitle','privacy.providersBody',
    'privacy.securityTitle','privacy.securityBody','privacy.rightsTitle','privacy.rightsBody',
    'privacy.contactTitle','privacy.contactBody','enamad.title','enamad.lead',
    'enamad.sealAlt','enamad.verifiedTitle','enamad.verifiedBody','enamad.openOfficial'
  ]) for(const l of langs) assert.ok(dicts[l].strings[key], l+' missing '+key);
});

test('Aparat page has RSS source, inline player conversion, and no D1 dependency',()=>{
  assert.match(app,/https:\/\/www\.aparat\.com\/rss\/gilasart/);
  assert.match(app,/www\.aparat\.com\/video\/video\/embed\/videohash/);
  assert.match(app,/<iframe/);
  assert.doesNotMatch(app,/aparatPage[\\s\\S]{0,12000}env\.DB/);
});

test('Aparat and legal page UI has responsive production styles',()=>{
  assert.match(css,/\.aparat-grid/);
  assert.match(css,/\.aparat-player iframe/);
  assert.match(css,/\.legal-content/);
  assert.match(css,/\.enamad-page/);
});

test('all four locale dictionaries keep identical keys after phase 9 additions',()=>{
  const base=Object.keys(dicts.fa.strings).sort();
  for(const l of langs.slice(1)) assert.deepEqual(Object.keys(dicts[l].strings).sort(),base,l+' key set mismatch');
});
