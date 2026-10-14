import { readFile } from 'node:fs/promises';

const routes = [
  { path: '/', file: 'dist/index.html', indexable: true, canonical: 'https://gilasart.ir/' },
  { path: '/shop', file: 'dist/shop/index.html', indexable: true, canonical: 'https://gilasart.ir/shop/' },
  { path: '/cart', file: 'dist/cart/index.html', indexable: false, canonical: 'https://gilasart.ir/cart/' },
  { path: '/account', file: 'dist/account/index.html', indexable: false, canonical: 'https://gilasart.ir/account/' },
  { path: '/rewards', file: 'dist/rewards/index.html', indexable: false, canonical: 'https://gilasart.ir/rewards/' },
  { path: '/about', file: 'dist/about/index.html', indexable: true, canonical: 'https://gilasart.ir/about/' },
  { path: '/contact', file: 'dist/contact/index.html', indexable: true, canonical: 'https://gilasart.ir/contact/' },
  { path: '/news', file: 'dist/news/index.html', indexable: true, canonical: 'https://gilasart.ir/news/' }
];

function metaContent(html, key, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find(item => new RegExp('\\b' + key + '=["\\x27]' + value + '["\\x27]', 'i').test(item));
  return tag?.match(/\bcontent=["\x27]([^"\x27]*)["\x27]/i)?.[1] || '';
}
function linkHref(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) || [];
  const tag = tags.find(item => new RegExp('\\brel=["\\x27]' + rel + '["\\x27]', 'i').test(item));
  return tag?.match(/\bhref=["\x27]([^"\x27]*)["\x27]/i)?.[1] || '';
}
const results = [];
for (const route of routes) {
  const html = await readFile(route.file, 'utf8');
  const checks = [
    ['title', html.includes('<title>') && html.includes('</title>')],
    ['meta description', Boolean(metaContent(html, 'name', 'description'))],
    ['robots policy', route.indexable ? /index,follow/.test(metaContent(html, 'name', 'robots')) : /noindex,follow/.test(metaContent(html, 'name', 'robots'))],
    ['canonical', linkHref(html, 'canonical') === route.canonical],
    ['Open Graph title', Boolean(metaContent(html, 'property', 'og:title'))],
    ['Open Graph description', Boolean(metaContent(html, 'property', 'og:description'))],
    ['Open Graph URL', metaContent(html, 'property', 'og:url') === route.canonical],
    ['Twitter title', Boolean(metaContent(html, 'name', 'twitter:title'))],
    ['Twitter description', Boolean(metaContent(html, 'name', 'twitter:description'))],
    ['social image', Boolean(metaContent(html, 'property', 'og:image') || metaContent(html, 'name', 'twitter:image'))],
    ['initial H1', /<h1\b/i.test(html)]
  ];
  if (route.indexable) checks.push(['JSON-LD structured data', html.includes('<script type="application/ld+json">')]);
  const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
  const score = Math.round(100 * (checks.length - failed.length) / checks.length);
  results.push({ path: route.path, score: score + '/100', checks: (checks.length - failed.length) + '/' + checks.length, failed });
}
console.log('SEO static HTML checklist (not Lighthouse/PageSpeed):');
for (const result of results) console.log(result.path + ': ' + result.score + ' (' + result.checks + ')' + (result.failed.length ? ' — failed: ' + result.failed.join(', ') : ''));
const failures = results.filter(item => item.failed.length);
if (failures.length) throw new Error('SEO HTML audit failed for ' + failures.map(item => item.path).join(', '));
