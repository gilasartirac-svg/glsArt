function asText(value, max = 800) {
  return String(value ?? '').trim().slice(0, max);
}

function asPrice(value) {
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

async function readJson(url) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    cache: 'no-cache',
    headers: { Accept: 'application/json' }
  });
  if (!response.ok) throw new Error('offline_snapshot_http_' + response.status);
  return response.json();
}

/**
 * Normalize an offline product-index row and its separately stored details
 * into the contract used by the virtual gallery. Product catalog/details are
 * loaded only from the public offline snapshot; cart/session operations remain
 * live and server-validated in gallery.js.
 */
export function normalizeGalleryProduct(raw, details = {}) {
  if (!raw || typeof raw !== 'object') return null;
  const imageDetails = Array.isArray(details.images) ? details.images : [];
  const primaryImage = imageDetails.find(item => Number(item?.is_primary) === 1) || imageDetails[0];
  const image = asText(raw.image ?? raw.image_url ?? primaryImage?.path, 1200);
  const active = raw.active ?? raw.is_active ?? raw.status;
  if (active === false || active === 0 || active === '0' || active === 'false' || active === 'inactive' || active === 'archived' || active === 'deleted') return null;

  const priceObject = raw.price && typeof raw.price === 'object' ? raw.price : {};
  const amount = asPrice(priceObject.amount ?? raw.price_irt ?? raw.price);
  const slug = asText(raw.slug ?? raw.url_slug, 180);
  const id = asText(raw.id ?? raw.product_id, 120);
  const sku = asText(raw.sku ?? raw.code, 120);

  return {
    id,
    slug,
    sku,
    categoryIds: Array.isArray(raw.category_ids) ? raw.category_ids.map(value => asText(value, 100)).filter(Boolean) : (raw.category_id ? [asText(raw.category_id, 100)] : []),
    name: asText(raw.name ?? raw.title, 160) || 'اثر هنری',
    description: asText(details.description ?? raw.description ?? raw.short_description, 1600),
    price: {
      amount,
      currency: asText(priceObject.currency ?? raw.currency, 8) || 'IRR'
    },
    image,
    images: imageDetails,
    attributes: Array.isArray(details.attributes) ? details.attributes : (Array.isArray(raw.attributes) ? raw.attributes : []),
    categories: Array.isArray(details.categories) ? details.categories : [],
    reviews: Array.isArray(details.reviews) ? details.reviews : [],
    seo_title: asText(details.seo_title, 240),
    seo_description: asText(details.seo_description, 500),
    video_url: asText(details.video_url, 1200),
    url: asText(raw.url ?? raw.product_url, 500) || (slug ? '/product/' + encodeURIComponent(slug) : '/shop'),
    availability: asText(raw.availability ?? raw.stock_status, 40) || (Number(raw.stock) > 0 ? 'in_stock' : 'unknown')
  };
}

export async function loadGalleryProducts({
  fallbackUrl = (location.pathname.startsWith('/glsArt') ? '/glsArt/' : '/') + 'data/storefront-index.json'
} = {}) {
  const indexUrl = new URL(fallbackUrl, location.origin);
  const directoryUrl = new URL('.', indexUrl);
  const manifestUrl = new URL('storefront-manifest.json', directoryUrl);
  let manifest = null;
  try { manifest = await readJson(manifestUrl.href); } catch {
    // Older cached deployments may not have a readable manifest; use known filenames.
  }

  const version = asText(manifest?.version, 80);
  const versionedUrl = name => {
    const url = new URL(name, directoryUrl);
    if (version) url.searchParams.set('v', version);
    return url.href;
  };
  const actualIndexUrl = versionedUrl('storefront-index.json');
  const attributesFile = asText(manifest?.attributesFile, 160) || 'storefront-attributes.json';
  const actualAttributesUrl = versionedUrl(attributesFile);

  const [index, detailSnapshot] = await Promise.all([
    readJson(actualIndexUrl),
    readJson(actualAttributesUrl)
  ]);
  if (Number(index?.schemaVersion) !== 2 || !Array.isArray(index.products)) {
    throw new Error('ساختار فهرست آفلاین محصولات معتبر نیست.');
  }
  if (Number(detailSnapshot?.schemaVersion) !== 1 || detailSnapshot?.keyField !== 'productId' || !detailSnapshot.byProductId || typeof detailSnapshot.byProductId !== 'object') {
    throw new Error('ساختار فایل آفلاین ویژگی‌های محصولات معتبر نیست.');
  }

  const products = index.products.map(raw => {
    const key = String(raw?.id ?? '');
    const details = detailSnapshot.byProductId[key];
    if (!details) throw new Error('اطلاعات آفلاین محصول ' + (raw?.sku || key) + ' در فایل ویژگی‌ها پیدا نشد.');
    return normalizeGalleryProduct(raw, details);
  }).filter(Boolean);

  if (manifest?.productCount != null && products.length !== Number(manifest.productCount)) {
    throw new Error('تعداد محصولات فایل آفلاین با manifest مطابقت ندارد.');
  }
  if (!products.length) throw new Error('فهرست آفلاین آثار خالی است.');
  return products;
}
