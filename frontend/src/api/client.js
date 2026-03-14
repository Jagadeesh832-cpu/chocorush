/**
 * API Client - Centralized fetch with JWT auth
 * All admin endpoints require valid token; role enforced by backend
 */
const API_BASE = '/api'

function getToken() {
  return localStorage.getItem('chocorush-token')
}

export async function api(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  const data = res.ok ? await res.json().catch(() => ({})) : await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const productsApi = {
  list: () => api('/products'),
  get: (id) => api(`/products/${id}`),
}

export const ordersApi = {
  create: (body) => api('/orders', { method: 'POST', body: JSON.stringify(body) }),
}

export const bookingsApi = {
  create: (body) => api('/bookings', { method: 'POST', body: JSON.stringify(body) }),
}

export const authApi = {
  signup: (body) => api('/users/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => api('/users/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => api('/users/me'),
  orders: () => api('/users/orders'),
}

export const adminApi = {
  stats: () => api('/admin/stats'),
  orders: () => api('/admin/orders'),
  bookings: () => api('/admin/bookings'),
  products: () => api('/admin/products'),
  sections: () => api('/admin/sections'),
  updateSection: (key, data) => api(`/admin/sections/${key}`, { method: 'PUT', body: JSON.stringify(data) }),
  createSection: (data) => api('/admin/sections', { method: 'POST', body: JSON.stringify(data) }),
  deleteSection: (key) => api(`/admin/sections/${key}`, { method: 'DELETE' }),
  users: () => api('/admin/users'),
  updateUserRole: (id, role) => api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
}

export const paymentsApi = {
  createOrder: (body) => api('/payments/create-order', { method: 'POST', body: JSON.stringify(body) }),
  verify: (body) => api('/payments/verify', { method: 'POST', body: JSON.stringify(body) }),
}
