// storage.js — chrome.storage.local wrapper
// Keys: psint_jwt, psint_api_url

const DEFAULT_API_URL = 'http://localhost:5144';

export async function getToken() {
  const result = await chrome.storage.local.get('psint_jwt');
  return result.psint_jwt ?? null;
}

export async function setToken(token) {
  await chrome.storage.local.set({ psint_jwt: token });
}

export async function clearToken() {
  await chrome.storage.local.remove('psint_jwt');
}

export async function getApiUrl() {
  const result = await chrome.storage.local.get('psint_api_url');
  return result.psint_api_url ?? DEFAULT_API_URL;
}

export async function setApiUrl(url) {
  await chrome.storage.local.set({ psint_api_url: url.replace(/\/$/, '') });
}
