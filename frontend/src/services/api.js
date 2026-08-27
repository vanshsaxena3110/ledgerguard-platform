const API_URL = 'http://localhost:5000/api';

export async function getAuthToken() {
  let token = localStorage.getItem('token');
  if (token) return token;

  const defaultUser = {
    name: 'admin',
    password: 'password',
    companyName: 'Acme Corp',
  };

  // 1. Attempt signup in case database is fresh
  try {
    const signupRes = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaultUser),
    });
    if (signupRes.ok) {
      console.log('Background signup successful');
    } else {
      const data = await signupRes.json().catch(() => ({}));
      console.log('Background signup info:', data.message);
    }
  } catch (e) {
    console.warn('Background signup error (safe if already signed up):', e);
  }

  // 2. Attempt login to get the JWT token
  try {
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: defaultUser.name,
        password: defaultUser.password,
      }),
    });
    if (loginRes.ok) {
      const data = await loginRes.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Background login successful, token saved');
        return data.token;
      }
    }
  } catch (e) {
    console.error('Background login error:', e);
  }

  return null;
}

async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || `HTTP error ${response.status}`);
  }

  return response.json();
}

export async function fetchTransactions() {
  const data = await apiRequest('/transactions');
  return data.transactions || [];
}

export async function createTransaction(transactionData) {
  const data = await apiRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
  return data.transaction;
}
