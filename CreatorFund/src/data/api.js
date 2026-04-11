import { allContent, myOrders, creators, requests } from './mockData';

// To connect to a Java Backend later, replace these mock delays with standard fetch calls
// Ex: export const getCreators = async () => (await fetch('http://localhost:8080/api/creators/')).json();

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Common
  login: async (email, password, role) => {
    await delay(300);
    // Simulating token return. Later replace with real backend call.
    return { token: 'mock-jwt-token', user: { name: 'Test User', role, email } };
  },
  register: async (name, email, password, role) => {
    await delay(300);
    // Simulate successful registration and auto-login
    return { token: 'mock-jwt-token', user: { name, role, email } };
  },

  // Admin
  getDashboardStats: async () => {
    await delay(300);
    const platformRevenue = 15000; // Mock 
    const activeCreators = creators.filter(c => c.status === 'active').length;
    const pendingRequests = requests.length;
    return { platformRevenue, activeCreators, pendingRequests };
  },
  getCreators: async () => {
    await delay(300);
    return creators;
  },
  getRequests: async () => {
    await delay(300);
    return requests;
  },

  // Creator
  getCreatorDashboardStats: async () => {
    await delay(300);
    return { totalViews: 12500, totalSales: 350, earnings: 45000 };
  },
  getCreatorContent: async () => {
    await delay(300);
    return allContent.filter(c => c.creatorName === 'Alice'); // Mocking specific user
  },
  submitContent: async (data) => {
    await delay(500);
    return { success: true };
  }
};
