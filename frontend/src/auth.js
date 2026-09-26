// GilasArt authentication foundation
import { api } from './api.js';

export async function getCurrentUser() {
  return api('/me');
}

export async function requestOTP(mobile) {
  return api('/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ mobile })
  });
}

export async function verifyOTP(challengeId, code) {
  return api('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ challengeId, code })
  });
}

export async function logout() {
  return api('/auth/logout', {
    method: 'POST'
  });
}
