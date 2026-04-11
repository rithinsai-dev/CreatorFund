import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function AdminCreators() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    api.getCreators().then(setCreators);
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
              {creators.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td><strong>{c.name}</strong></td>
                  <td>{c.email}</td>
                  <td>{c.joined}</td>
                  <td>₹{c.totalRevenue.toLocaleString()}</td>
                  <td><span className={`badge ${c.status === 'active' ? 'green' : 'red'}`}>{c.status}</span></td>
                  <td>
                    {c.status === 'active' ? 
                      <button className="btn btn-sm" style={{color: 'var(--red)'}}>Suspend</button> :
                      <button className="btn btn-sm" style={{color: 'var(--green)'}}>Activate</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
