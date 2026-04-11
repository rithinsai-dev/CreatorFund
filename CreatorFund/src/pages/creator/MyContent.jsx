import { useEffect, useState } from 'react';
import { api } from '../../data/api';

const TYPE_COLORS = { music: 'purple', video: 'red', article: 'amber', course: 'green', podcast: 'cyan' };

export default function MyContent({ onNavigate }) {
  const [content, setContent] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCreatorContent()
      .then((data) => {
        setContent(Array.isArray(data) ? data : []);
        setError(Array.isArray(data) ? '' : 'Unable to load content right now.');
      })
      .catch(() => {
        setContent([]);
        setError('Unable to load content right now.');
      });
  }, []);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">My Content Repository</h1>
        <div className="page-subtitle">Manage your published assets and fractional ownership rights</div>
      </div>
      {error && (
        <div className="card" style={{ marginBottom: 16, color: 'var(--red)' }}>
          {error}
        </div>
      )}
      <div className="content-grid">
        {content.map(c => (
          <div className="content-card" key={c.id}>
            <div className={`content-type badge ${TYPE_COLORS[c.type]}`}>{c.type}</div>
            <div className="content-title">{c.title}</div>
            <div className="content-meta">
              Status: <strong style={{color: c.status === 'active' ? 'var(--green)' : 'var(--amber)'}}>{c.status.toUpperCase()}</strong>
            </div>
            <div className="content-meta" style={{marginTop: 6}}>
              Owner Share: <strong style={{color: 'var(--primary)'}}>{c.ownershipPercentage}%</strong>
            </div>
            <div className="content-meta" style={{marginTop: 4}}>
              {c.isOriginalCreator ? 'Original creator' : `Created by ${c.creatorName}`}
            </div>
            <div className="content-price">₹{c.price}</div>
            <div className="content-footer" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: 12, color: 'var(--text-muted)'}}>{c.salesCount} Sales</span>
              <button 
                className="btn btn-sm" 
                onClick={() => onNavigate('manage-rights', c.id)}
              >
                Manage Rights
              </button>
            </div>
          </div>
        ))}
        {content.length === 0 && (
          <div className="card" style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px'}}>
             <p>No content found. Start by submitting your first asset!</p>
          </div>
        )}
      </div>
    </div>
  );
}
