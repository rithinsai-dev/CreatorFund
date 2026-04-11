import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function DistDashboard() {
  const [stats, setStats] = useState({ totalSpent: 0, purchaseCount: 0, availableContentCount: 0, ownedLicensesCount: 0 });
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    api.getDistDashboardStats().then(setStats);
    api.getPurchases().then(setPurchases);
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Distributor Dashboard</div>
        <div className="page-subtitle">Welcome back. Here's your activity.</div>
      </div>
      <div className="page-body">
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-label">Total Spent</div><div className="stat-value" style={{color:'var(--cyan)'}}>₹{stats.totalSpent.toLocaleString()}</div></div>
          <div className="stat-card"><div className="stat-label">Purchases</div><div className="stat-value">{stats.purchaseCount}</div></div>
          <div className="stat-card"><div className="stat-label">Available Content</div><div className="stat-value">{stats.availableContentCount}</div></div>
          <div className="stat-card"><div className="stat-label">Owned Licenses</div><div className="stat-value">{stats.ownedLicensesCount}</div></div>
        </div>
        <div className="card">
          <div className="card-title" style={{marginBottom: 15, fontWeight:'bold'}}>Recent Purchases</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Content</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {purchases.map(o => (
                  <tr key={o.id}>
                    <td style={{fontWeight:600}}>{o.contentTitle}</td>
                    <td><span className={`badge ${o.type === 'music' ? 'purple' : o.type === 'video' ? 'red' : o.type === 'article' ? 'amber' : 'green'}`}>{o.type}</span></td>
                    <td>₹{o.amount}</td>
                    <td><span className={`badge ${o.status === 'completed' ? 'green' : 'red'}`}>{o.status}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}