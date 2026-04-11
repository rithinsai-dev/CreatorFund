import { useEffect, useState } from 'react';
import { api } from '../../data/api';

const TYPE_COLORS = { music: 'purple', video: 'red', article: 'amber', course: 'green' };

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    api.getRequests().then(setRequests);
  }, []);

  const handleApprove = (id) => {
    setRequests(requests.filter(r => r.id !== id));
    // In future, call api.approveRequest(id)
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
              {requests.map(r => (
                <tr key={r.id}>
                  <td>{r.creatorName}</td>
                  <td><strong>{r.contentTitle}</strong></td>
                  <td><span className={`badge ${TYPE_COLORS[r.type]}`}>{r.type}</span></td>
                  <td>{r.date}</td>
                  <td><span className="badge amber">{r.status}</span></td>
                  <td>
                    <div style={{display:'flex', gap: 5}}>
                      <button className="btn btn-primary btn-sm" onClick={() => handleApprove(r.id)}>Approve</button>
                      <button className="btn btn-sm">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && <tr><td colSpan="6" style={{textAlign:'center', padding: '20px'}}>No pending requests</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
