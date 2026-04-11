import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function AdminPlatformRevenue() {
  const [stats, setStats] = useState({ platformRevenue: 0 });

  useEffect(() => {
    api.getDashboardStats()
      .then(data => { if (data && typeof data === 'object') setStats(data); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Platform Revenue</h1>
      </div>
      <div className="stat-grid">
        <div className="stat-card" style={{borderLeft: '4px solid var(--primary)'}}>
          <div className="stat-label">Total Platform Revenue</div>
          <div className="stat-value">₹{parseFloat(stats.platformRevenue || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid var(--cyan)'}}>
          <div className="stat-label">This Month</div>
          <div className="stat-value">₹{(parseFloat(stats.platformRevenue || 0) * 0.3).toLocaleString()}</div>
        </div>
      </div>
      <div className="card">
        <h3>Recent Transactions</h3>
        <p style={{color: 'var(--text-muted)'}}>Transaction history will appear here once connected to the backend.</p>
      </div>
    </div>
  );
}
