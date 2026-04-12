import { useState } from 'react';
import { api } from '../../data/api';

export default function SubmitContent() {
  const [formData, setFormData] = useState({ 
    title: '', 
    type: 'music', 
    price: '', 
    description: '', 
    targetQty: '' 
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const payload = {
        ...formData,
        targetQty: parseInt(formData.targetQty, 10) || 0
      };
      await api.submitContent(payload);
      setStatus('success');
      setFormData({ title: '', type: 'music', price: '', description: '', targetQty: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Submit Content</h1>
        <div className="page-subtitle">Upload new content for approval and define sale limits</div>
      </div>
      <div className="card" style={{maxWidth: 600}}>
        {status === 'success' && (
          <div style={{padding: 15, background: 'var(--green)', color: 'white', marginBottom: 20, borderRadius: 4}}>
            Content submitted successfully for approval!
          </div>
        )}
        {status === 'error' && (
          <div style={{padding: 15, background: 'var(--red)', color: 'white', marginBottom: 20, borderRadius: 4}}>
            Failed to submit content. Please try again.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Content Title</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              placeholder="Enter a catchy title"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea 
              required 
              rows="4"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              placeholder="Describe your content in detail..."
              style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)'}}
            />
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20}}>
            <div className="form-group">
              <label>Content Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="music">Music</option>
                <option value="video">Video</option>
                <option value="article">Article</option>
                <option value="course">Course</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Price (₹)</label>
              <input 
                type="number" 
                required 
                min="0" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                placeholder="999"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Target Quantity (License Limit)</label>
            <input 
              type="number" 
              required 
              min="1" 
              value={formData.targetQty} 
              onChange={e => setFormData({...formData, targetQty: e.target.value})} 
              placeholder="e.g. 100"
            />
            <small style={{color: 'var(--text-muted)', marginTop: 5, display: 'block'}}>
              Content will be automatically archived once this many licenses are sold.
            </small>
          </div>

          <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: 10}} disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Submitting...' : 'Submit Content'}
          </button>
        </form>
      </div>
    </div>
  );
}
