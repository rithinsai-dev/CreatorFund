import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function ManageRights({ contentId, onBack }) {
  const [content, setContent] = useState(null);
  const [rights, setRights] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [toEmail, setToEmail] = useState('');
  const [percentage, setPercentage] = useState('');
  const [transferring, setTransferring] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const rightsData = await api.getContentRights(contentId);
      if (Array.isArray(rightsData)) setRights(rightsData);
      
      // Also get content info to show title
      const allContent = await api.getCreatorContent();
      const current = allContent.find(c => c.id.toString() === contentId.toString());
      if (current) setContent(current);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [contentId]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!toEmail || !percentage) return;
    
    setTransferring(true);
    try {
      const res = await api.transferRights(contentId, toEmail, percentage);
      if (res.success) {
        alert("Rights transferred successfully!");
        setToEmail('');
        setPercentage('');
        loadData();
      } else {
        alert(res.message || "Transfer failed");
      }
    } catch {
      alert("Error initiating transfer");
    } finally {
      setTransferring(false);
    }
  };

  if (loading && !content) return <div className="loading">Loading rights structure...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <button onClick={onBack} className="btn btn-sm" style={{marginBottom: '1rem', display: 'inline-block'}}>← Back to Content</button>
        <h1 className="page-title">Manage Rights: {content?.title}</h1>
        <div className="page-subtitle">View ownership split and transfer fractional rights to other owners</div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Current Ownership Split</h3>
          <div className="table-wrap" style={{marginTop: '1rem'}}>
            <table>
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Share (%)</th>
                </tr>
              </thead>
              <tbody>
                {rights.map((r, i) => (
                  <tr key={i}>
                    <td>{r.ownerName}</td>
                    <td style={{color: 'var(--text-muted)'}}>{r.ownerEmail}</td>
                    <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>{r.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3>Initiate Rights Transfer</h3>
          <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
            Transfer a portion of your current rights to another creator by entering their registered email address.
          </p>
          <form onSubmit={handleTransfer}>
            <div className="form-group">
              <label>Recipient Email</label>
              <input 
                type="email" 
                className="form-control" 
                placeholder="e.g. partner@creatorfund.com"
                value={toEmail}
                onChange={e => setToEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Percentage to Transfer</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="0 - 100"
                step="0.01"
                min="0.01"
                max="100"
                value={percentage}
                onChange={e => setPercentage(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{width: '100%'}}
              disabled={transferring}
            >
              {transferring ? "Processing Transfer..." : "Confirm Rights Transfer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
