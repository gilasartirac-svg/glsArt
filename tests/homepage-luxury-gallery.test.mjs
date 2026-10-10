import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('homepage brand and navigation expose copper marquetry and the virtual gallery without hero buttons',()=>{
 const locale=JSON.parse(read('frontend/public/i18n/fa.json'));
 assert.equal(locale.strings['home.copperTitle'],'هنر معرق مس، باوقار و ماندگار');
 const app=read('frontend/src/app.js');
 assert.ok(app.includes(`data-menu-icon="gallery"`));
 assert.ok(app.indexOf(`data-menu-icon="shop"`)<app.indexOf(`data-menu-icon="gallery"`));
 assert.ok(app.indexOf(`data-menu-icon="gallery"`)<app.indexOf(`data-menu-icon="about"`));
 assert.ok(!app.includes('home-primary-actions'));
 assert.ok(app.includes('routeUrl(\'/virtual-gallery/\')'));
 assert.ok(app.includes('vg3-scene'));
 assert.ok(app.includes('vg3-human'));
 assert.ok(app.includes('partner-logo-strip'));
});

test('sun moon theme switch remains connected to the persisted theme controller',()=>{
 const app=read('frontend/src/app.js');
 const css=read('frontend/src/styles.css');
 assert.ok(app.includes('ga-theme-switch__sun'));
 assert.ok(app.includes('ga-theme-switch__moon'));
 assert.ok(app.includes('window.GilasArtTheme&&window.GilasArtTheme.toggle()'));
 assert.ok(css.includes(':root[data-theme="dark"] .ga-theme-switch__knob'));
 assert.ok(css.includes(':root[data-theme="light"] .ga-theme-switch__knob')===false || css.includes('.ga-theme-switch__knob'));
});

test('admin can select, reorder, activate and persist partner logos from uploaded thumb assets',()=>{
 const settings=read('frontend/src/admin/pages/Settings.js');
 const worker=read('worker/src/index.js');
 assert.ok(settings.includes('partner-library-load'));
 assert.ok(settings.includes('frontend/public/uploaded/thumb'));
 assert.ok(settings.includes('partner-logos-save'));
 assert.ok(settings.includes("partner_logos:value"));
 assert.ok(worker.includes("'partner_logos'"));
 assert.ok(worker.includes('invalid_partner_logos'));
 assert.ok(worker.includes("'footer_social_links','partner_logos','footer_enamad_code'"));
});

test('long public text, horizontal categories and footer dividers have shared design rules',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('#main-content p:not(.eyebrow):not(.vg3-kicker):not(.product-card-kicker)'));
 assert.ok(css.includes('.home-categories .category-grid{display:flex'));
 assert.ok(!css.includes('.home-primary-actions'));
 assert.ok(!css.includes('.home-hero-gallery-link'));
 assert.ok(css.includes('.partner-logo-track{display:flex'));
 assert.ok(css.includes('.footer-grid-refined>:is(nav,section)'));
});
