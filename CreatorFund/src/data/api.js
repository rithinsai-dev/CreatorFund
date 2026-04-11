const BASE_URL = 'http://localhost:8080/api';

export const api = {
  // Common - Auth
  login: async (email, password, role) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) throw new Error('Login failed');
    return { user: await res.json() };
  },

  register: async (name, email, password, role) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    if (!res.ok) throw new Error('Registration failed');
    return { user: await res.json() };
  },

  // Admin
  getDashboardStats: async () => {
    const res = await fetch(`${BASE_URL}/admin/dashboard-stats`);
    return await res.json();
  },
  getCreators: async () => {
    const res = await fetch(`${BASE_URL}/admin/creators`);
    return await res.json();
  },
  getRequests: async () => {
    const res = await fetch(`${BASE_URL}/admin/requests`);
    return await res.json();
  },

  // Creator
  getCreatorDashboardStats: async () => {
    const res = await fetch(`${BASE_URL}/creator/stats`);
    return await res.json();
  },
  getCreatorContent: async () => {
    const res = await fetch(`${BASE_URL}/creator/content`);
    return await res.json();
  },
  submitContent: async (data) => {
    const res = await fetch(`${BASE_URL}/creator/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Distributor
  getDistDashboardStats: async () => {
    const res = await fetch(`${BASE_URL}/distributor/dashboard-stats`);
    return await res.json();
  },
  getPurchases: async () => {
    const res = await fetch(`${BASE_URL}/distributor/purchases`);
    return await res.json();
  },
  getMarketplace: async () => {
    const res = await fetch(`${BASE_URL}/distributor/marketplace`);
    return await res.json();
  },
  purchaseContent: async (contentId, paymentDetails) => {
    const res = await fetch(`${BASE_URL}/distributor/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, paymentDetails })
    });
    return await res.json();
  }
};
