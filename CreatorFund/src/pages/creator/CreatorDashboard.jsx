import { useEffect, useState } from 'react';
import { api } from '../../data/api';
import { useAuth } from '../../context/AuthContext';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalViews: 0, totalSales: 0, earnings: 0 });

  useEffect(() => {
    api.getCreatorDashboardStats().then(setStats);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Creator Dashboard</h1>
        <div className="page-subtitle">Welcome back, {user?.name || 'Creator'}!</div>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value" style={{color: 'var(--cyan)'}}>{stats.totalViews.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sales (Licenses)</div>
          <div className="stat-value">{stats.totalSales}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value" style={{color: 'var(--green)'}}>₹{stats.earnings.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
