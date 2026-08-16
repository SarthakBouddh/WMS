const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('wms_jwt_token', token);
  } else {
    localStorage.removeItem('wms_jwt_token');
  }
};

export const getAuthToken = () => localStorage.getItem('wms_jwt_token');

export const apiFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  
  if (response.status === 401) {
    localStorage.removeItem('wms_jwt_token');
    throw new Error('Unauthorized - Invalid credentials or session expired');
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP Error ${response.status}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || parsed.error || errorMessage;
    } catch {
      if (errorText) errorMessage = errorText;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) return true;
  const text = await response.text();
  return text ? JSON.parse(text) : true;
};

export const api = {
  login: (username, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getCurrentUser: () => apiFetch('/auth/me'),
  getOrders: (status) => apiFetch(status ? `/orders?status=${status}` : '/orders'),
  createOrder: (shopId, items, discount = 0) => apiFetch('/orders', { method: 'POST', body: JSON.stringify({ shopId, items, discount }) }),
  updateOrderStatus: (id, status) => apiFetch(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteOrder: (id) => apiFetch(`/orders/${id}`, { method: 'DELETE' }),
  getDispatches: () => apiFetch('/dispatches'),
  createDispatch: (orderId, vehicleNumber, transportProvider, driverId) => apiFetch('/dispatches', { method: 'POST', body: JSON.stringify({ orderId, vehicleNumber, transportProvider, driverId }) }),
  updateDispatchStatus: (id, status, notes) => apiFetch(`/dispatches/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  deleteDispatch: (id) => apiFetch(`/dispatches/${id}`, { method: 'DELETE' }),
  getShops: () => apiFetch('/shops'),
  createShop: (shop) => apiFetch('/shops', { method: 'POST', body: JSON.stringify(shop) }),
  deleteShop: (id) => apiFetch(`/shops/${id}`, { method: 'DELETE' }),
  getProducts: () => apiFetch('/products'),
  deleteProduct: (id) => apiFetch(`/products/${id}`, { method: 'DELETE' }),
  getManagers: () => apiFetch('/users?role=ROLE_MANAGER'),
  getUsers: (role) => apiFetch(role ? `/users?role=${role}` : '/users'),
  getSummary: () => apiFetch('/reports/summary'),
};
