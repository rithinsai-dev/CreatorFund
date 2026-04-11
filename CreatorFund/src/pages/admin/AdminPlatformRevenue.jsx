import { useEffect, useState } from 'react';
import { api } from '../../data/api';

const STATUS_COLORS = {
  recorded: 'amber',
  verified: 'cyan',
  settled: 'green'
};

export default function AdminPlatformRevenue() {
  const [stats, setStats] = useState({ platformRevenue: 0, totalTransactionRevenue: 0 });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.getDashboardStats()
      .then(data => { if (data && typeof data === 'object') setStats(data); })
      .catch(() => {});

    api.getRecentTransactions()
      .then(data => { if (Array.isArray(data)) setTransactions(data); })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Platform Revenue</h1>
        <div className="page-subtitle">3% platform fee on all transactions</div>
      </div>
      <div className="stat-grid">
        <div className="stat-card" style={{borderLeft: '4px solid var(--green)'}}>
          <div className="stat-label">Total Transaction Volume</div>
          <div className="stat-value">₹{parseFloat(stats.totalTransactionRevenue || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid var(--primary)'}}>
          <div className="stat-label">Platform Revenue (3%)</div>
          <div className="stat-value" style={{color: 'var(--primary)'}}>₹{parseFloat(stats.platformRevenue || 0).toLocaleString()}</div>
        </div>
        <div className="stat-card" style={{borderLeft: '4px solid var(--cyan)'}}>
          <div className="stat-label">Creator Payouts (97%)</div>
          <div className="stat-value">₹{(parseFloat(stats.totalTransactionRevenue || 0) - parseFloat(stats.platformRevenue || 0)).toLocaleString()}</div>
        </div>
      </div>
      <div className="card">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p style={{color: 'var(--text-muted)'}}>No transactions yet.</p>
        ) : (
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
            <thead>
              <tr style={{borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', textAlign: 'left'}}>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Content</th>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Distributor</th>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Total</th>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Platform Fee (3%)</th>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Creator Share (97%)</th>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Status</th>
                <th style={{padding: '10px 12px', fontWeight: 600}}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => {
                const total = parseFloat(t.amount || 0);
                const platformFee = (total * 0.03).toFixed(2);
                const creatorShare = (total * 0.97).toFixed(2);
                return (
                  <tr key={t.id} style={{borderBottom: '1px solid var(--border)'}}>
                    <td style={{padding: '10px 12px', fontWeight: 600}}>{t.contentTitle}</td>
                    <td style={{padding: '10px 12px', color: 'var(--text-muted)'}}>{t.distributorName}</td>
                    <td style={{padding: '10px 12px'}}>₹{total.toLocaleString()}</td>
                    <td style={{padding: '10px 12px', color: 'var(--primary)', fontWeight: 600}}>₹{parseFloat(platformFee).toLocaleString()}</td>
                    <td style={{padding: '10px 12px', color: 'var(--green)'}}>₹{parseFloat(creatorShare).toLocaleString()}</td>
                    <td style={{padding: '10px 12px'}}>
                      <span className={`badge ${STATUS_COLORS[t.status] || ''}`}>{t.status}</span>
                    </td>
                    <td style={{padding: '10px 12px', color: 'var(--text-muted)'}}>{t.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
