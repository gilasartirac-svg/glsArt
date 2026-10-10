import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Pages deployment gate uses real file-path regex escapes', () => {
  const workflow = read('../.github/workflows/pages.yml');
  const slash = String.fromCharCode(92);
  assert.ok(workflow.includes('service-status' + slash + '.json'));
  assert.ok(workflow.includes('cloudflare-usage-guard' + slash + '.yml'));
  assert.ok(!workflow.includes('service-status' + slash + slash + '.json'));
});


test('thumbnail workflow includes every supported image extension and tolerates no-op runs', () => {
  const workflow = read('../.github/workflows/create-thumbs.yml');
  assert.ok(workflow.includes('expected = files'));
  assert.ok(workflow.includes('".jpg"'));
  assert.ok(!workflow.includes('len(expected) != 233'));
  assert.ok(workflow.includes('if git diff --cached --quiet; then echo "No thumbnail changes."'));
  assert.ok(workflow.includes('on:\\n  workflow_dispatch:'));
  assert.ok(!workflow.includes("'.github/workflows/create-thumbs.yml'"));
});

test('Pages workflow is not accidentally duplicated or truncated', () => {
  const workflow = read('../.github/workflows/pages.yml');
  assert.equal(workflow.split('blocked=$(printf').length - 1, 1);
  assert.equal(workflow.split('\n').length, 262);
});

test('image crop workflow stages outputs without extension-specific globs', () => {
  const workflow = read('../.github/workflows/crop-uploaded-images.yml');
  assert.ok(workflow.includes('git add -A -- frontend/public/uploaded'));
  assert.ok(!workflow.includes('git add frontend/public/uploaded/*.jpg'));
});

test('admin receipt preview renders the actual order id', () => {
  const source = read('../frontend/src/admin/pages/Orders.js');
  assert.ok(source.includes("data-admin-receipt-preview=\"'+esc(o.id)+'\""));
  assert.ok(!source.includes('data-admin-receipt-preview="${esc(o.id)}"'));
});

test('admin receipt endpoint is restricted to card-transfer receipts and includes rejection reason', () => {
  const worker = read('../worker/src/index.js');
  assert.ok(worker.includes('receipt_reviewed_at,receipt_reviewed_by,receipt_rejection_reason FROM payments WHERE order_id=?'));
  assert.ok(worker.includes('SELECT provider,receipt_status,receipt_mime,receipt_size,receipt_data FROM payments WHERE order_id=?'));
  assert.ok(worker.includes("p.provider!=='card_transfer'||p.receipt_status==='NONE'"));
});
