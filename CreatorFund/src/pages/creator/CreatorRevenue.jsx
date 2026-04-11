import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function CreatorRevenue() {
  const [stats, setStats] = useState({ earnings: 0 });

  useEffect(() => {
    api.getCreatorDashboardStats().then(setStats);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Revenue</h1>
      </div>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Earnings</div>
          <div className="stat-value" style={{color: 'var(--green)'}}>₹{stats.earnings.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Next Payout</div>
          <div className="stat-value">₹{(stats.earnings * 0.1).toLocaleString()}</div>
        </div>
      </div>
      <div className="card">
        <h3>Payout History</h3>
        <p style={{color: 'var(--text-muted)'}}>No past payouts available yet.</p>
      </div>
    </div>
  );
}
