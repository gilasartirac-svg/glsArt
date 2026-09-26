// GilasArt API wrapper foundation
const API_BASE = '/api';

export async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`API_ERROR_${response.status}`);
  }

  return response.json();
}
