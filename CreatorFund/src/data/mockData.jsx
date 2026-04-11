export const allContent = [
  { id: 1, title: 'Learn React Hooks', type: 'course', price: 999, status: 'active', creatorName: 'Alice', salesCount: 50, targetQty: 100 },
  { id: 2, title: 'Tech Review Video', type: 'video', price: 499, status: 'active', creatorName: 'Bob', salesCount: 120, targetQty: 200 },
  { id: 3, title: 'Lo-Fi Beats', type: 'music', price: 199, status: 'active', creatorName: 'Charlie', salesCount: 300, targetQty: 500 },
  { id: 4, title: 'Frontend Basics', type: 'article', price: 99, status: 'pending', creatorName: 'Alice', salesCount: 0, targetQty: 50 }
];

export const myOrders = [
  { id: 101, contentTitle: 'Learn React Hooks', type: 'course', amount: 999, status: 'completed', date: '2023-10-01', licenseKey: 'LIC-1234' },
  { id: 102, contentTitle: 'Tech Review Video', type: 'video', amount: 499, status: 'completed', date: '2023-10-05', licenseKey: 'LIC-5678' }
];

export const creators = [
  { id: 1, name: 'Alice', email: 'alice@example.com', status: 'active', totalRevenue: 50000, joined: '2023-01-10' },
  { id: 2, name: 'Bob', email: 'bob@example.com', status: 'active', totalRevenue: 30000, joined: '2023-03-22' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', status: 'suspended', totalRevenue: 15000, joined: '2023-06-05' }
];

export const requests = [
  { id: 4, contentTitle: 'Frontend Basics', creatorName: 'Alice', type: 'article', date: '2023-10-10', status: 'pending' },
  { id: 5, contentTitle: 'Advanced Hooks', creatorName: 'Alice', type: 'course', date: '2023-10-11', status: 'pending' }
];
