const API_URL = 'http://localhost:5000/api';

export function getAuthToken() {
  return localStorage.getItem('token');
}

async function authRequest(endpoint, body) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `HTTP error ${response.status}`);
  return data;
}

export function signup(credentials) { return authRequest('/auth/signup', credentials); }
export function login(credentials) { return authRequest('/auth/login', credentials); }

export function fetchCurrentUser() { return apiRequest('/auth/me'); }
export function updateProfile(name) { return apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify({ name }) }); }
export function updateCompany(name) { return apiRequest('/auth/company', { method: 'PUT', body: JSON.stringify({ name }) }); }

async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
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

export async function fetchTransactionById(transactionId) {
  const transactions = await fetchTransactions();
  return transactions.find((transaction) => transaction?._id === transactionId || transaction?.transactionId === transactionId) || null;
}

export async function createTransaction(transactionData) {
  const data = await apiRequest('/transactions', { method: 'POST', body: JSON.stringify(transactionData) });
  return data.transaction;
}
