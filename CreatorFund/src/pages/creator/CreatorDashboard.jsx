import { useEffect, useState } from 'react';
import { api } from '../../data/api';
import { useAuth } from '../../context/useAuth';

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalViews: 0, totalSales: 0, earnings: 0 });

  useEffect(() => {
    api.getCreatorDashboardStats()
      .then(data => { if (data && typeof data === 'object') setStats(data); })
      .catch(() => {});
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
          <div className="stat-value" style={{color: 'var(--cyan)'}}>{parseFloat(stats.totalViews || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Sales (Licenses)</div>
          <div className="stat-value">{stats.totalSales}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value" style={{color: 'var(--green)'}}>₹{parseFloat(stats.earnings || 0).toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}
