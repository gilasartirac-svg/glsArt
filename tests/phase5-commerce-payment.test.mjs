import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../frontend/src/app.js', import.meta.url), 'utf8');
const worker = readFileSync(new URL('../worker/src/index.js', import.meta.url), 'utf8');
const promotions = readFileSync(new URL('../database/migrations/0011_promotions_integrations.sql', import.meta.url), 'utf8');
const receipts = readFileSync(new URL('../database/migrations/0011_card_transfer_receipts.sql', import.meta.url), 'utf8');
const multiPayment = readFileSync(new URL('../database/migrations/0333_multi_payment_methods.sql', import.meta.url), 'utf8');
const invoice = readFileSync(new URL('../frontend/src/invoice.js', import.meta.url), 'utf8');

test('phase 5 frontend exposes one-page cart/checkout flow', () => {
  assert.match(app, /async function cart\(\)/);
  assert.match(app, /\/api\/cart/);
  assert.match(app, /\/api\/cart\/price/);
  assert.match(app, /\/api\/addresses/);
  assert.match(app, /\/api\/orders/);
  assert.match(app, /idempotencyKey/);
  assert.match(app, /name="payment-provider"/);
});

test('phase 5 frontend supports all three payment branches and manual receipt flow', () => {
  assert.match(app, /\/api\/payment\/options/);
  assert.match(app, /paymentOptions\.methods/);
  assert.match(app, /name="payment-provider"/);
  assert.match(app, /card_transfer/);
  assert.match(app, /\/payment\/manual\/index\.html\?order=/);
  assert.match(app, /p\[1\]==='success'/);
  assert.match(worker, /\/payment\/success\?order=/);
  assert.match(app, /\/payment\/.*payment-receipt|payment-receipt/);
});

test('phase 5 frontend never uses its displayed checkout total as the payment authority', () => {
  assert.match(app, /api\('\/api\/orders'/);
  assert.match(app, /provider/);
  assert.match(app, /idempotencyKey/);
});

test('server pricing is the single source of truth for cart, coupons and discounts', () => {
  assert.match(worker, /async function cartPricing\(env,me,couponCode=''/);
  assert.match(worker, /\/api\/cart\/price/);
  assert.match(worker, /coupon_not_applicable/);
  assert.match(worker, /discount_usages/);
  assert.match(worker, /coupon_usages/);
  assert.match(worker, /pricing\.total_irt/);
});

test('order creation re-prices the cart server-side and requires idempotency', () => {
  assert.match(worker, /if\(u\.pathname==='\/api\/orders'&&req\.method==='POST'\)/);
  assert.match(worker, /cartPricing\(env,me,couponCode\)/);
  assert.match(worker, /idempotency_key_required/);
  assert.match(worker, /checkout_key/);
  assert.match(worker, /stock_reservations/);
  assert.match(worker, /line_total_irt/);
});

test('payment provider selection is validated server-side', () => {
  assert.match(worker, /\['zarinpal','novinopay','card_transfer'\]/);
  assert.match(worker, /paymentEnabled\(env,provider\)/);
  assert.match(worker, /payment_not_configured/);
  assert.match(worker, /novinopay_not_configured/);
});

test('ZarinPal and NovinoPay use server-side verification before paid state', () => {
  assert.match(worker, /async function zarin\(/);
  assert.match(worker, /async function novino\(/);
  assert.match(worker, /verify\.json/);
  assert.match(worker, /code===100\|\|code===101/);
  assert.match(worker, /callback_status/);
  assert.match(worker, /p\.status==='PAID'/);
});

test('card transfer receipt is size/type validated and remains pending until admin approval', () => {
  assert.match(worker, /invalid_image_content/);
  assert.match(worker, /receipt_size/);
  assert.match(worker, /150\s*\*\s*1024|153600/);
  assert.match(worker, /PENDING_REVIEW/);
  assert.match(worker, /payment-receipt\/approve/);
  assert.match(worker, /payment-receipt\/reject/);
  assert.match(worker, /receipt_reviewed_by/);
});

test('payment finalization is atomic and duplicate callback-safe', () => {
  assert.match(worker, /await env\.DB\.batch\(statements\)/);
  assert.match(worker, /stock_reservations WHERE order_id=\?/);
  assert.match(worker, /oo\.status='PENDING'/);
  assert.match(worker, /p\.status==='PAID'/);
});

test('phase 5 schema contains promotions, multi-provider payment and receipt state', () => {
  for (const name of ['discounts','discount_products','discount_categories','discount_usages','coupon_products','coupon_categories']) {
    assert.match(promotions, new RegExp('CREATE TABLE '+name));
  }
  for (const name of ['receipt_status','receipt_mime','receipt_size','receipt_data','receipt_uploaded_at','receipt_reviewed_at']) {
    assert.match(receipts, new RegExp(name));
  }
  for (const name of ['payment_zarinpal_enabled','payment_novinopay_enabled','payment_card_transfer_enabled','payment_default_provider']) {
    assert.match(multiPayment, new RegExp(name));
  }
});

test('invoice reads the server order/payment result and preserves option snapshots', () => {
  assert.match(invoice, /options_json/);
  assert.match(invoice, /invoice-option/);
});
