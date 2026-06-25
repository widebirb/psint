
import { getToken, getApiUrl } from './storage.js';

// Save a job to the tracker.
// Backend API client for the extension All calls attach Authorization: Bearer <jwt>
// returns {{ success: boolean, data?: Object, error?: string, status?: number }}
export async function saveJob(payload) {
  const token = await getToken();
  const apiUrl = await getApiUrl();

  if (!token) {
    return {
      success: false,
      error: 'No token found. Please paste your JWT in the Settings tab.',
    };
  }

  try {
    const response = await fetch(`${apiUrl}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 401) {
      return {
        success: false,
        status: 401,
        error: 'Token expired or invalid. Please update your JWT in Settings.',
      };
    }

    if (response.status === 400) {
      const body = await response.json().catch(() => ({}));
      const messages = body.errors
        ? Object.values(body.errors).join(' ')
        : 'Validation error: check title and company fields.';
      return { success: false, status: 400, error: messages };
    }

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error: `Server error (${response.status}). Try again later.`,
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    // Network error (offline, wrong API URL, CORS, etc.)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return {
        success: false,
        error: 'Cannot reach the API. Check your API URL in Settings and make sure the server is running.',
      };
    }
    return { success: false, error: err.message ?? 'Unknown error.' };
  }
}

// Test connectivity by hitting GET /me.
export async function testConnection() {
  const token = await getToken();
  const apiUrl = await getApiUrl();

  if (!token) {
    return { success: false, error: 'No token configured.' };
  }

  try {
    const response = await fetch(`${apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 401) {
      return { success: false, error: 'Token is expired or invalid.' };
    }

    if (!response.ok) {
      return { success: false, error: `Server error (${response.status}).` };
    }

    const user = await response.json();
    return { success: true, user };
  } catch {
    return { success: false, error: 'Cannot reach the API. Check URL and server status.' };
  }
}
