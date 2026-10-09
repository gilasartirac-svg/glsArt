const DEFAULT_PRODUCTS_API_URL = '';

function asText(value, max = 800) {
  return String(value ?? '').trim().slice(0, max);
}

function asPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

/**
 * Normalize the static storefront export and future API responses into one
 * stable gallery product contract. No cart or checkout request is made here.
 */
export function normalizeGalleryProduct(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const image = asText(raw.image ?? raw.image_url ?? raw.images?.[0]?.url, 1200);
  const active = raw.active ?? raw.is_active ?? raw.status;
  if (active === false || active === 0 || active === 'inactive') return null;

  const priceObject = raw.price && typeof raw.price === 'object' ? raw.price : {};
  const amount = asPrice(priceObject.amount ?? raw.price_irt ?? raw.price);
  const slug = asText(raw.slug ?? raw.url_slug, 180);
  const id = asText(raw.id ?? raw.product_id, 120);
  const sku = asText(raw.sku ?? raw.code, 120);

  return {
    id,
    slug,
    sku,
    name: asText(raw.name ?? raw.title, 90) || 'اثر هنری',
    description: asText(raw.description ?? raw.short_description, 800),
    price: {
      amount,
      currency: asText(priceObject.currency ?? raw.currency, 8) || 'IRR'
    },
    image,
    url: asText(raw.url ?? raw.product_url, 500) || (slug ? '/product/' + encodeURIComponent(slug) : '/shop'),
    availability: asText(raw.availability ?? raw.stock_status, 40) || 'unknown'
  };
}

export async function loadGalleryProducts({
  fallbackUrl,
  apiUrl = window.GILASART_GALLERY_CONFIG?.productsApiUrl || DEFAULT_PRODUCTS_API_URL,
  limit = 5000
} = {}) {
  const sources = [];
  if (apiUrl) sources.push({ url: apiUrl, cache: 'no-store' });
  if (fallbackUrl && fallbackUrl !== apiUrl) sources.push({ url: fallbackUrl, cache: 'force-cache' });

  for (const source of sources) {
    try {
      const response = await fetch(source.url, {
        cache: source.cache,
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) continue;
      const payload = await response.json();
      const items = Array.isArray(payload) ? payload : payload.products;
      if (!Array.isArray(items)) continue;
      const products = items.map(normalizeGalleryProduct).filter(Boolean).slice(0, limit);
      if (products.length) return products;
    } catch {
      // Keep the gallery usable if an optional API is unavailable.
    }
  }
  return [];
}
