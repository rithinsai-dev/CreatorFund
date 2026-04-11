import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function MyOrders() {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    api.getPurchases().then(setMyOrders);
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">My Orders</div>
        <div className="page-subtitle">Your purchase history and license keys</div>
      </div>
      <div className="page-body">
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead><tr><th>Content</th><th>Type</th><th>Amount</th><th>License Key</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {myOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{fontWeight:600}}>{o.contentTitle}</td>
                    <td><span className={`badge ${o.type==='music'?'purple':o.type==='video'?'red':o.type==='article'?'amber':'green'}`}>{o.type}</span></td>
                    <td>₹{o.amount}</td>
                    <td style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--cyan)'}}>{o.licenseKey || '—'}</td>
                    <td><span className={`badge ${o.status==='completed'?'green':'red'}`}>{o.status}</span></td>
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