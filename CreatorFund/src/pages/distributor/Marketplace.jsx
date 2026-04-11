import { useEffect, useState } from 'react';
import { api } from '../../data/api';

const TYPE_COLORS = { music: 'purple', video: 'red', article: 'amber', course: 'green', podcast: 'cyan' };

export default function Marketplace() {
  const [active, setActive] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Checkout states
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [paid, setPaid] = useState(false);
  const [license, setLicense] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [usageType, setUsageType] = useState('DOWNLOAD');

  useEffect(() => {
    api.getMarketplace()
      .then(data => { if (Array.isArray(data)) setActive(data.filter(c => c.status === 'active')); })
      .catch(() => {});
  }, []);

  const filtered = active.filter(c =>
    (filter === 'all' || c.type === filter) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handlePurchase = async () => {
    try {
      const res = await api.purchaseContent(checkoutItem.id, paymentMethod, usageType);
      if (res.success) {
        setLicense(res.licenseKey);
        setPaid(true);
        // Update the sold count on the marketplace card locally
        setActive(prev => prev.map(item =>
          item.id === checkoutItem.id
            ? { ...item, salesCount: (item.salesCount || 0) + 1 }
            : item
        ));
      }
    } catch {
      alert("Purchase failed");
    }
  };

  const beginCheckout = (content) => {
    setCheckoutItem(content);
    setPaid(false);
    setLicense('');
    setPaymentMethod('UPI');
    setUsageType('DOWNLOAD');
  };

  if (paid) {
    return (
      <div className="fade-in">
        <div className="page-header"><div className="page-title">Checkout</div></div>
        <div className="page-body">
          <div className="card" style={{maxWidth:480,textAlign:'center'}}>
            <div style={{fontSize:56,marginBottom:16}}>🎉</div>
            <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>Payment Successful!</div>
            <div style={{color:'var(--text-muted)',fontSize:13,marginBottom:8}}>You now own the license for <strong style={{color:'var(--text)'}}>{checkoutItem?.title}</strong>.</div>
            <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:6,padding:'12px 16px',fontSize:12,marginBottom:24}}>
              License Key: <strong style={{color:'var(--cyan)',fontFamily:'var(--mono)'}}>{license}</strong>
            </div>
            <button className="btn btn-primary" onClick={() => { setPaid(false); setCheckoutItem(null) }}>Return to Marketplace</button>
          </div>
        </div>
      </div>
    )
  }

  if (checkoutItem) {
    return (
      <div className="fade-in">
        <div className="page-header">
          <div style={{display: 'flex', alignItems: 'center', gap: 15}}>
            <button className="btn btn-sm" onClick={() => setCheckoutItem(null)}>← Back</button>
            <div className="page-title">Checkout</div>
          </div>
        </div>
        <div className="page-body">
          <div className="card fade-in" style={{maxWidth: 400}}>
            <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{checkoutItem.title}</div>
            <div style={{color:'var(--text-muted)',fontSize:12,marginBottom:20}}>by {checkoutItem.creatorName}</div>
            <div style={{borderTop:'1px solid var(--border)',paddingTop:16,marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
                <span style={{color:'var(--text-muted)'}}>Content price</span><span>₹{checkoutItem.price}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
                <span style={{color:'var(--text-muted)'}}>Platform fee</span><span>₹0</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:18,color:'var(--cyan)',paddingTop:12,borderTop:'1px solid var(--border)'}}>
                <span>Total</span><span>₹{checkoutItem.price}</span>
              </div>
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
                <option value="UPI">UPI</option>
                <option value="CARD">Card</option>
                <option value="NET_BANKING">Net Banking</option>
              </select>
            </div>
            <div className="form-group">
              <label>Purchase Purpose</label>
              <select value={usageType} onChange={e => setUsageType(e.target.value)}>
                <option value="STREAM">Stream</option>
                <option value="DOWNLOAD">Download</option>
                <option value="VIEW">View</option>
                <option value="SUBSCRIPTION_ACCESS">Subscription Access</option>
              </select>
            </div>
            <button className="btn btn-primary" style={{width:'100%'}} onClick={handlePurchase}>
              Pay ₹{checkoutItem.price}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Marketplace</div>
        <div className="page-subtitle">Browse available content and purchase licenses</div>
      </div>
      <div className="page-body">
        <div className="section-header">
          <div style={{display:'flex', gap:8}}>
            {['all','music','video','article','course'].map(f => (
              <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':''}`} style={{border:'1px solid var(--border)'}} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <div className="search-bar" style={{width:240}}>
            <span style={{color:'var(--text-muted)'}}>Search</span>
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="content-grid">
          {filtered.map(c => (
            <div className="content-card" key={c.id}>
              <div className={`content-type badge ${TYPE_COLORS[c.type]}`}>{c.type}</div>
              <div className="content-title">{c.title}</div>
              <div className="content-meta">by {c.creatorName}</div>
              <div className="content-price" style={{color:'var(--cyan)'}}>₹{parseFloat(c.price || 0).toLocaleString()}</div>
              <div className="content-footer">
                <span style={{fontSize:11,color:'var(--text-muted)'}}>{c.salesCount}/{c.targetQty} sold</span>
                <button className="btn btn-primary btn-sm" onClick={() => beginCheckout(c)}>Buy License</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
