import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function AdminCreatorRevenue() {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const loadStats = () => {
    setLoading(true);
    api.getAdminRevenueStats()
      .then(data => { if (Array.isArray(data)) setCreators(data); })
      .catch(err => console.error("Error loading revenue stats:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleProcessPayout = async (creatorId) => {
    if (!window.confirm("Are you sure you want to process all pending payouts for this creator?")) return;
    
    setProcessing(creatorId);
    try {
      const res = await api.processCreatorPayout(creatorId);
      if (res.success) {
        alert(`Successfully processed ${res.processedCount} royalty payments!`);
        loadStats(); // Refresh data
      } else {
        alert(res.message || "Failed to process payout");
      }
    } catch (err) {
      alert("Error processing payout");
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Creator Revenue Analytics</h1>
        <div className="page-subtitle">Track and finalize royalty payments for all registered creators</div>
      </div>
      
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Creator Name</th>
                <th>Cumulative Earnings</th>
                <th>Pending Payout Balance</th>
                <th style={{textAlign: 'right'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="4" style={{textAlign:'center', padding: '20px'}}>Loading analytics...</td></tr>}
              {!loading && creators.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.name}</strong></td>
                  <td>₹{parseFloat(c.totalEarnings || 0).toLocaleString()}</td>
                  <td style={{color: 'var(--amber)', fontWeight: 'bold'}}>
                    ₹{parseFloat(c.pendingPayout || 0).toLocaleString()}
                  </td>
                  <td style={{textAlign: 'right'}}>
                    <button 
                      className="btn btn-sm btn-primary"
                      disabled={processing === c.id || parseFloat(c.pendingPayout) <= 0}
                      onClick={() => handleProcessPayout(c.id)}
                    >
                      {processing === c.id ? "Processing..." : "Process Payout"}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && creators.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign:'center', padding: '40px', color: 'var(--text-muted)'}}>
                    No creators found in the system.
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
