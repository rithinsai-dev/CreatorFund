import { useEffect, useState } from 'react';
import { api } from '../../data/api';

const TYPE_COLORS = { music: 'purple', video: 'red', article: 'amber', course: 'green', podcast: 'cyan' };

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequests()
      .then(data => { if (Array.isArray(data)) setRequests(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.approveContent(id);
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Failed to approve content");
      }
    } catch (err) {
      alert("Error approving content: " + err.message);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.rejectContent(id);
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== id));
      } else {
        alert("Failed to reject content");
      }
    } catch (err) {
      alert("Error rejecting content: " + err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Content Requests</h1>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Creator</th>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Loading...</td></tr>
              )}
              {!loading && requests.map(r => (
                <tr key={r.id}>
                  <td>{r.creatorName}</td>
                  <td><strong>{r.contentTitle}</strong></td>
                  <td><span className={`badge ${TYPE_COLORS[r.type] || 'green'}`}>{r.type}</span></td>
                  <td>{r.date}</td>
                  <td><span className="badge amber">{r.status}</span></td>
                  <td>
                    <div style={{display:'flex', gap: 5}}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApprove(r.id)}>Approve</button>
                      <button className="btn btn-sm" onClick={() => handleReject(r.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && requests.length === 0 && (
                <tr><td colSpan="6" style={{textAlign:'center', padding: '20px', color:'var(--text-muted)'}}>No pending requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
