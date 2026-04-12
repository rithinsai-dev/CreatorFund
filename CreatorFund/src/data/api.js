const BASE_URL = 'http://localhost:8080/api';

// Helper to get logged-in user's ID from localStorage
const getUserId = () => {
  const saved = localStorage.getItem('creatorfund-user');
  if (!saved) return null;
  return JSON.parse(saved)?.id;
};

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  login: async (email, password, role) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) throw new Error('Login failed');
    return await res.json();
  },

  register: async (name, email, password, role, organizationName) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, organizationName })
    });
    if (!res.ok) throw new Error('Registration failed');
    return await res.json();
  },

  // ── Admin ─────────────────────────────────────────────────────────────────
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
  approveContent: async (contentId) => {
    const res = await fetch(`${BASE_URL}/admin/approve-content?contentId=${contentId}`, {
      method: 'POST'
    });
    return await res.json();
  },
  getAdminRevenueStats: async () => {
    const res = await fetch(`${BASE_URL}/admin/revenue`);
    return await res.json();
  },
  processCreatorPayout: async (creatorId) => {
    const res = await fetch(`${BASE_URL}/admin/payout?creatorId=${creatorId}`, {
      method: 'POST'
    });
    return await res.json();
  },
  getRecentTransactions: async () => {
    const res = await fetch(`${BASE_URL}/admin/recent-transactions`);
    return await res.json();
  },

  // ── Creator (scoped to logged-in creator) ─────────────────────────────────
  getCreatorDashboardStats: async () => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/creator/stats?creatorId=${userId}`);
    return await res.json();
  },
  getCreatorContent: async () => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/creator/content?creatorId=${userId}`);
    return await res.json();
  },
  getContentRights: async (contentId) => {
    const res = await fetch(`${BASE_URL}/rights/content/${contentId}`);
    return await res.json();
  },
  getTransferHistory: async (contentId) => {
    const res = await fetch(`${BASE_URL}/rights/content/${contentId}/history`);
    return await res.json();
  },
  transferRights: async (contentId, toEmail, percentage) => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/rights/transfer?contentId=${contentId}&fromUserId=${userId}&toEmail=${toEmail}&percentage=${percentage}`, {
      method: 'POST'
    });
    return await res.json();
  },
  submitContent: async (data) => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/creator/content?creatorId=${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },
  getRoyaltyHistory: async () => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/creator/royalties?creatorId=${userId}`);
    return await res.json();
  },

  // ── Distributor (scoped to logged-in distributor) ─────────────────────────
  getDistDashboardStats: async () => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/distributor/dashboard-stats?distributorId=${userId}`);
    return await res.json();
  },
  getPurchases: async () => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/distributor/purchases?distributorId=${userId}`);
    return await res.json();
  },
  getMarketplace: async () => {
    const res = await fetch(`${BASE_URL}/distributor/marketplace`);
    return await res.json();
  },
  purchaseContent: async (contentId, paymentDetails, usageType) => {
    const userId = getUserId();
    const res = await fetch(`${BASE_URL}/distributor/purchase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentId, paymentDetails, usageType, distributorId: userId })
    });
    return await res.json();
  }
};
