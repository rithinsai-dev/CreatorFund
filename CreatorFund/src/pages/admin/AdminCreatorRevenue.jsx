import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function AdminCreatorRevenue() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    api.getCreators().then(setCreators);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Creator Revenue Analytics</h1>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Creator Name</th>
                <th>Total Earnings</th>
                <th>Pending Payout</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {creators.map(c => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>₹{c.totalRevenue.toLocaleString()}</td>
                  <td style={{color: 'var(--amber)'}}>₹{(c.totalRevenue * 0.1).toLocaleString()}</td>
                  <td><button className="btn btn-sm btn-primary">Process Payout</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
