import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../frontend/src/styles.css',import.meta.url),'utf8');
const migration=readFileSync(new URL('../database/migrations/0024_content_translations.sql',import.meta.url),'utf8');

test('storefront language mode is Persian-only',()=>{
 assert.match(app,/const SUPPORTED_LOCALES=\['fa'\]/);
 assert.match(app,/currentLocale='fa'/);
 assert.doesNotMatch(app,/language-switcher-toggle/);
 assert.doesNotMatch(app,/api\/locale/);
 assert.doesNotMatch(app,/function browserLocale/);
});

test('translation storage is additive, four-locale, indexed and fallback-safe',()=>{
 assert.match(migration,/CREATE TABLE IF NOT EXISTS content_translations/);
 assert.match(migration,/locale TEXT NOT NULL CHECK\(locale IN \('fa','en','tr','ar'\)\)/);
 assert.match(migration,/UNIQUE\(entity_type,entity_id,field,locale\)/);
 assert.match(migration,/idx_content_translations_lookup/);
 assert.match(worker,/function requestLocale\(req\)/);
 assert.match(worker,/function applyTranslations\(env,rows,entityType,fields,locale\)/);
 assert.match(worker,/if\(locale==='fa'/);
});

test('frontend API and routing remain Persian-only',()=>{
 assert.doesNotMatch(app,/searchParams\.set\('locale'/);
 assert.match(app,/currentLocale==='fa'/);
 assert.match(worker,/applyTranslations\(env,r\.results\|\|\[\],'product'/);
 assert.match(worker,/applyTranslations\(env,r\.results\|\|\[\],'category'/);
});
