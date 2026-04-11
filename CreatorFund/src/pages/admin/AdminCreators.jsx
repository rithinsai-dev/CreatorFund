import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function AdminCreators() {
  const [creators, setCreators] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getCreators()
      .then(data => { if (Array.isArray(data)) setCreators(data); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Manage Creators</h1>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7" style={{textAlign:'center', padding: '20px'}}>Loading...</td></tr>}
              {!loading && creators.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.joined}</td>
                  <td>₹{parseFloat(c.totalRevenue || 0).toLocaleString()}</td>
                  <td><span className={`badge ${c.status === 'active' ? 'green' : 'red'}`}>{c.status}</span></td>
                  <td>
                    {c.status === 'active' ? 
                      <button className="btn btn-sm" style={{color: 'var(--red)'}}>Suspend</button> :
                      <button className="btn btn-sm" style={{color: 'var(--green)'}}>Activate</button>
                    }
                  </td>
                </tr>
              ))}
              {!loading && creators.length === 0 && !error && <tr><td colSpan="7" style={{textAlign:'center', padding: '20px'}}>No creators found</td></tr>}
              {error && <tr><td colSpan="7" style={{textAlign:'center', padding: '20px', color: 'var(--red)'}}>Error: {error}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
