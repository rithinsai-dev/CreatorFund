import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ platformRevenue: 0, activeCreators: 0, pendingRequests: 0 });

  useEffect(() => {
    // using async call to be ready for Java Backend
    api.getDashboardStats().then(setStats);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <div className="page-subtitle">Overview of platform health</div>
      </div>
      <div className="page-body">
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-label">Platform Revenue</div>
            <div className="stat-value" style={{color: 'var(--green)'}}>₹{stats.platformRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Creators</div>
            <div className="stat-value">{stats.activeCreators}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Pending Requests</div>
            <div className="stat-value" style={{color: 'var(--amber)'}}>{stats.pendingRequests}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
