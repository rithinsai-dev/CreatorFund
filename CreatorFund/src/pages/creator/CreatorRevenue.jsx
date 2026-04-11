import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function CreatorRevenue() {
  const [stats, setStats] = useState({ earnings: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getCreatorDashboardStats(),
      api.getRoyaltyHistory()
    ]).then(([statsData, historyData]) => {
      if (statsData) setStats(statsData);
      if (Array.isArray(historyData)) setHistory(historyData);
    })
    .catch(err => console.error("Error fetching revenue data:", err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Revenue & Royalties</h1>
        <div className="page-subtitle">Track your earnings and pending payouts across all your content</div>
      </div>
      
      <div className="stat-grid">
        <div className="stat-card" style={{borderLeft: '4px solid var(--green)'}}>
          <div className="stat-label">Total Cumulative Earnings</div>
          <div className="stat-value" style={{color: 'var(--green)'}}>
            ₹{parseFloat(stats.earnings || 0).toLocaleString()}
          </div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid var(--amber)'}}>
          <div className="stat-label">Pending Payouts</div>
          <div className="stat-value">
            ₹{(parseFloat(stats.earnings || 0) * 0.9).toLocaleString()}
          </div>
          <p style={{fontSize: 12, color: 'var(--text-muted)', marginTop: 8}}>After platform service fees</p>
        </div>
      </div>

      <div className="card">
        <h3>Royalty History</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Content</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="4" style={{textAlign:'center', padding: '20px'}}>Loading history...</td></tr>}
              {!loading && history.map(item => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td><strong>{item.contentTitle}</strong></td>
                  <td style={{color: 'var(--green)'}}>+₹{parseFloat(item.calculatedAmount || 0).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${item.status === 'calculated' || item.status === 'approved' ? 'green' : 'amber'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && history.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign:'center', padding: '20px', color: 'var(--text-muted)'}}>
                    No royalty transactions found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
