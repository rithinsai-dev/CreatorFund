import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function DistDashboard() {
  const [stats, setStats] = useState({ totalSpent: 0, purchaseCount: 0, availableContentCount: 0, ownedLicensesCount: 0 });
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getDistDashboardStats()
      .then(data => { if (data && typeof data === 'object' && !data.status) setStats(data); })
      .catch(err => setError(err.message));

    api.getPurchases()
      .then(data => { if (Array.isArray(data)) setPurchases(data); })
      .catch(() => {});
  }, []);

  const formatCurrency = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? '0' : num.toLocaleString();
  };

  if (error) return (
    <div className="page-body">
      <div className="card" style={{textAlign:'center', padding: 40, color: 'var(--red)'}}>
        Could not load dashboard: {error}
      </div>
    </div>
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Distributor Dashboard</div>
        <div className="page-subtitle">Welcome back. Here's your activity.</div>
      </div>
      <div className="page-body">
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-label">Total Spent</div><div className="stat-value" style={{color:'var(--cyan)'}}>₹{formatCurrency(stats.totalSpent)}</div></div>
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
                    <td>₹{formatCurrency(o.amount)}</td>
                    <td><span className={`badge ${o.status === 'settled' || o.status === 'completed' ? 'green' : o.status === 'recorded' ? 'amber' : 'red'}`}>{o.status}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{o.date}</td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign:'center', padding:'20px', color:'var(--text-muted)'}}>No purchases yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}