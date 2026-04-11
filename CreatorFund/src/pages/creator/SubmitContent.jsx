import { useState } from 'react';
import { api } from '../../data/api';

export default function SubmitContent() {
  const [formData, setFormData] = useState({ title: '', type: 'music', price: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await api.submitContent(formData);
      setStatus('success');
      setFormData({ title: '', type: 'music', price: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Submit Content</h1>
        <div className="page-subtitle">Upload new content for approval</div>
      </div>
      <div className="card" style={{maxWidth: 600}}>
        {status === 'success' && <div style={{padding: 15, background: 'var(--green)', color: 'white', marginBottom: 20, borderRadius: 4}}>Content submitted successfully!</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Content Title</label>
            <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Content Type</label>
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="music">Music</option>
              <option value="video">Video</option>
              <option value="article">Article</option>
              <option value="course">Course</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit Content'}
          </button>
        </form>
      </div>
    </div>
  );
}
