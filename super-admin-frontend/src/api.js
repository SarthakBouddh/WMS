const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('superadmin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  // Super Admin Login
  async loginSuperAdmin(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }
    
    if (data.role !== 'ROLE_SUPER_ADMIN') {
      throw new Error('Access denied: Super Admin credentials required');
    }
    
    if (data.token) {
      localStorage.setItem('superadmin_token', data.token);
      localStorage.setItem('superadmin_user', JSON.stringify(data));
    }
    return data;
  },

  // Fetch Platform Analytics
  async getStats() {
    const res = await fetch(`${API_BASE}/superadmin/stats`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch platform stats');
    return res.json();
  },

  // Fetch All Client Companies
  async getClients() {
    const res = await fetch(`${API_BASE}/superadmin/clients`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch clients');
    return res.json();
  },

  // Create New Client Company
  async createClient(clientData) {
    const res = await fetch(`${API_BASE}/superadmin/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(clientData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create client company');
    return data;
  },

  // Update Client Status (ACTIVE / SUSPENDED)
  async updateClientStatus(id, status) {
    const res = await fetch(`${API_BASE}/superadmin/clients/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update client status');
    return data;
  },

  // Fetch Users
  async getUsers(companyId = '') {
    const url = companyId 
      ? `${API_BASE}/superadmin/users?companyId=${encodeURIComponent(companyId)}`
      : `${API_BASE}/superadmin/users`;
    const res = await fetch(url, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  // Create User for Specific Client Company
  async createClientUser(userData) {
    const res = await fetch(`${API_BASE}/superadmin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create employee user');
    return data;
  },

  // Toggle User Active Status
  async toggleUserStatus(id, active) {
    const res = await fetch(`${API_BASE}/superadmin/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ active })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update user status');
    return data;
  }
};
