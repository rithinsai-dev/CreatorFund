import { myOrders, allContent } from '../../data/mockData'
const active = allContent.filter(c => c.status === 'active')
const completed = myOrders.filter(o => o.status === 'completed')
const spent = completed.reduce((s, o) => s + o.amount, 0)

export default function DistDashboard() {
  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Distributor Dashboard</div>
        <div className="page-subtitle">Welcome back, Rohan. Here's your activity.</div>
      </div>
      <div className="page-body">
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-label">Total Spent</div><div className="stat-value" style={{color:'var(--cyan)'}}>₹{spent.toLocaleString()}</div></div>
          <div className="stat-card"><div className="stat-label">Purchases</div><div className="stat-value">{completed.length}</div></div>
          <div className="stat-card"><div className="stat-label">Available Content</div><div className="stat-value">{active.length}</div></div>
          <div className="stat-card"><div className="stat-label">Owned Licenses</div><div className="stat-value">{myOrders.filter(o => o.licenseKey).length}</div></div>
        </div>
        <div className="card">
          <div className="card-title">Recent Purchases</div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Content</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {myOrders.map(o => (
                  <tr key={o.id}>
                    <td style={{fontWeight:600}}>{o.contentTitle}</td>
                    <td><span className={`badge ${o.type === 'music' ? 'purple' : o.type === 'video' ? 'red' : o.type === 'article' ? 'amber' : 'green'}`}>{o.type}</span></td>
                    <td>₹{o.amount}</td>
                    <td><span className={`badge ${o.status === 'completed' ? 'green' : 'red'}`}>{o.status}</span></td>
                    <td style={{color:'var(--muted)'}}>{o.date}</td>
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