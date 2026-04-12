import { useEffect, useState } from 'react';
import { api } from '../../data/api';

export default function ManageRights({ contentId, onBack }) {
  const [content, setContent] = useState(null);
  const [rights, setRights] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [toEmail, setToEmail] = useState('');
  const [percentage, setPercentage] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [result, setResult] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rightsData, historyData, allContent] = await Promise.all([
        api.getContentRights(contentId),
        api.getTransferHistory(contentId),
        api.getCreatorContent()
      ]);
      if (Array.isArray(rightsData)) setRights(rightsData);
      if (Array.isArray(historyData)) setTransfers(historyData);
      
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

  const savedUser = localStorage.getItem('creatorfund-user');
  const loggedEmail = savedUser ? JSON.parse(savedUser)?.email : '';
  const myRights = rights.find(r => r.ownerEmail === loggedEmail);
  const myPercentage = myRights ? parseFloat(myRights.percentage) : 0;

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!toEmail || !percentage) return;

    const pctVal = parseFloat(percentage);
    if (pctVal > myPercentage) {
      alert(`You only own ${myPercentage}% — cannot transfer ${pctVal}%`);
      return;
    }
    
    setTransferring(true);
    setResult(null);
    try {
      const res = await api.transferRights(contentId, toEmail, percentage);
      if (res.success) {
        setResult({
          success: true,
          message: `Successfully transferred ${res.percentage}% to ${res.toName}. Your remaining share: ${res.remainingPercentage}%`
        });
        setToEmail('');
        setPercentage('');
        loadData();
      } else {
        setResult({ success: false, message: res.message || "Transfer failed" });
      }
    } catch {
      setResult({ success: false, message: "Error initiating transfer" });
    } finally {
      setTransferring(false);
    }
  };

  if (loading && !content) return <div className="loading">Loading rights structure...</div>;

  // Color palette for the ownership bar
  const BAR_COLORS = ['var(--primary)', 'var(--cyan)', 'var(--green)', 'var(--amber)', 'var(--red)', '#a78bfa'];

  return (
    <div className="fade-in">
      <div className="page-header">
        <button onClick={onBack} className="btn btn-sm" style={{marginBottom: '1rem', display: 'inline-block'}}>← Back to Content</button>
        <h1 className="page-title">Manage Rights: {content?.title}</h1>
        <div className="page-subtitle">View ownership split, transfer fractional rights, and audit transfer history</div>
      </div>

      {}
      {rights.length > 0 && (
        <div className="card" style={{marginBottom: '1.5rem'}}>
          <h3 style={{marginBottom: 12}}>Ownership Distribution</h3>
          <div style={{
            display: 'flex', borderRadius: 8, overflow: 'hidden', height: 32, marginBottom: 12,
            border: '1px solid var(--border)'
          }}>
            {rights.map((r, i) => (
              <div key={i} style={{
                width: `${r.percentage}%`, background: BAR_COLORS[i % BAR_COLORS.length],
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#fff',
                minWidth: r.percentage >= 5 ? 'auto' : 0,
                transition: 'width 0.4s ease'
              }}>
                {r.percentage >= 8 ? `${r.percentage}%` : ''}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', gap: 16, flexWrap: 'wrap'}}>
            {rights.map((r, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12}}>
                <span style={{width: 10, height: 10, borderRadius: '50%', background: BAR_COLORS[i % BAR_COLORS.length], display: 'inline-block'}} />
                <span>{r.ownerName}</span>
                <span style={{color: 'var(--text-muted)'}}>({r.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid">
        {}
        <div className="card">
          <h3>Current Ownership Split</h3>
          <div className="table-wrap" style={{marginTop: '1rem'}}>
            <table>
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>Share (%)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rights.map((r, i) => (
                  <tr key={i} style={r.ownerEmail === loggedEmail ? {background: 'rgba(99,102,241,0.08)'} : {}}>
                    <td>
                      <strong>{r.ownerName}</strong>
                      {r.ownerEmail === loggedEmail && (
                        <span style={{fontSize: 10, color: 'var(--primary)', marginLeft: 6, fontWeight: 600}}>YOU</span>
                      )}
                    </td>
                    <td style={{color: 'var(--text-muted)'}}>{r.ownerEmail}</td>
                    <td style={{fontWeight: 'bold', color: 'var(--primary)'}}>{r.percentage}%</td>
                    <td><span className="badge green">{r.status}</span></td>
                  </tr>
                ))}
                {rights.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', padding: 20}}>
                      No active rights found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {}
        <div className="card">
          <h3>Initiate Rights Transfer</h3>
          {myPercentage > 0 ? (
            <>
              <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>
                Transfer a portion of your rights to another creator by entering their registered email.
              </p>
              <p style={{fontSize: '0.8rem', marginBottom: '1.5rem'}}>
                Your current ownership: <strong style={{color: 'var(--primary)'}}>{myPercentage}%</strong>
              </p>

              {result && (
                <div style={{
                  padding: '12px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13,
                  background: result.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${result.success ? 'var(--green)' : 'var(--red)'}`,
                  color: result.success ? 'var(--green)' : 'var(--red)'
                }}>
                  {result.success ? '✓ ' : '✗ '}{result.message}
                </div>
              )}

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
                  <label>Percentage to Transfer (max: {myPercentage}%)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    placeholder={`0.01 - ${myPercentage}`}
                    step="0.01"
                    min="0.01"
                    max={myPercentage}
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
            </>
          ) : (
            <p style={{color: 'var(--text-muted)', fontSize: 13, marginTop: 12}}>
              You do not currently own any rights for this content. Only rights holders can initiate transfers.
            </p>
          )}
        </div>
      </div>

      {}
      <div className="card" style={{marginTop: '1.5rem'}}>
        <h3>Transfer History</h3>
        <div className="table-wrap" style={{marginTop: '1rem'}}>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Transferred %</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(t => (
                <tr key={t.id}>
                  <td style={{color: 'var(--text-muted)'}}>{t.date}</td>
                  <td>
                    <div>{t.fromName}</div>
                    <div style={{fontSize: 11, color: 'var(--text-muted)'}}>{t.fromEmail}</div>
                  </td>
                  <td>
                    <div>{t.toName}</div>
                    <div style={{fontSize: 11, color: 'var(--text-muted)'}}>{t.toEmail}</div>
                  </td>
                  <td style={{fontWeight: 700, color: 'var(--cyan)'}}>{t.percentage}%</td>
                </tr>
              ))}
              {transfers.length === 0 && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', color: 'var(--text-muted)', padding: 20}}>
                    No transfers have been made for this content yet.
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
