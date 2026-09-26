// GilasArt frontend router foundation
const routes = {
  '/': 'home',
  '/products': 'products',
  '/cart': 'cart',
  '/checkout': 'checkout',
  '/login': 'login',
  '/account': 'account',
  '/orders': 'orders',
  '/favorites': 'favorites',
  '/admin': 'admin'
};

export function resolveRoute(path = location.hash.replace('#','') || '/') {
  return routes[path] || '404';
}

export function navigate(path) {
  location.hash = path;
}
