import { useEffect, useState } from 'react';
import { api } from '../../data/api';

const TYPE_COLORS = { music: 'purple', video: 'red', article: 'amber', course: 'green' };

export default function MyContent() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    api.getCreatorContent().then(setContent);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Content</h1>
      </div>
      <div className="content-grid">
        {content.map(c => (
          <div className="content-card" key={c.id}>
            <div className={`content-type badge ${TYPE_COLORS[c.type]}`}>{c.type}</div>
            <div className="content-title">{c.title}</div>
            <div className="content-meta">Status: <strong style={{color: c.status === 'active' ? 'var(--green)' : 'var(--amber)'}}>{c.status.toUpperCase()}</strong></div>
            <div className="content-price">₹{c.price}</div>
            <div className="content-footer">
              <span style={{fontSize: 12, color: 'var(--text-muted)'}}>{c.salesCount} Sales</span>
            </div>
          </div>
        ))}
        {content.length === 0 && <p>No content found.</p>}
      </div>
    </div>
  );
}
