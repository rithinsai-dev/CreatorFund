import { useEffect, useState } from 'react'
import { api } from '../../data/api'

export default function PurchaseContent() {
  const [active, setActive] = useState([])
  const [selected, setSelected] = useState(null)
  const [paid, setPaid] = useState(false)
  const [license, setLicense] = useState('')

  useEffect(() => {
    api.getMarketplace().then(data => setActive(data.filter(c => c.status === 'active')))
  }, [])

  const handlePurchase = async () => {
    try {
      const res = await api.purchaseContent(selected.id, "CARD_XYZ");
      if (res.success) {
        setLicense(res.licenseKey);
        setPaid(true);
      }
    } catch {
      alert("Purchase failed");
    }
  }

  if (paid) return (
    <div className="fade-in">
      <div className="page-header"><div className="page-title">Purchase Content</div></div>
      <div className="page-body">
        <div className="card" style={{maxWidth:480,textAlign:'center'}}>
          <div style={{fontSize:56,marginBottom:16}}>🎉</div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>Payment Successful!</div>
          <div style={{color:'var(--text-muted)',fontSize:13,marginBottom:8}}>You now own the license for <strong style={{color:'var(--text)'}}>{selected?.title}</strong>.</div>
          <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:6,padding:'12px 16px',fontSize:12,marginBottom:24}}>
            License Key: <strong style={{color:'var(--cyan)',fontFamily:'var(--mono)'}}>{license}</strong>
          </div>
          <button className="btn btn-primary" onClick={() => { setPaid(false); setSelected(null) }}>Purchase Another</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="page-header">
        <div className="page-title">Purchase Content</div>
        <div className="page-subtitle">Select a content item and complete payment to receive your license</div>
      </div>
      <div className="page-body">
        <div style={{display:'flex',gap:24}}>
          <div style={{flex:1}}>
            <div className="card">
              <div className="card-title" style={{fontWeight:600, marginBottom:10}}>Select Content</div>
              {active.map((c,i) => (
                <div key={c.id} onClick={() => setSelected(c)} style={{
                  padding:'14px 0', borderBottom: i<active.length-1 ? '1px solid var(--border)' : 'none',
                  cursor:'pointer', display:'flex', alignItems:'center', gap:16,
                  background: selected?.id===c.id ? '#f0f4f8' : 'transparent',
                }}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,marginBottom:4}}>{c.title}</div>
                    <div style={{fontSize:11,color:'var(--text-muted)'}}>by {c.creatorName} · {c.type}</div>
                  </div>
                  <div style={{fontWeight:800,color:'var(--cyan)'}}>₹{c.price}</div>
                  {selected?.id === c.id && <span style={{color:'var(--green)'}}>✓</span>}
                </div>
              ))}
            </div>
          </div>
          <div style={{width:300}}>
            {selected ? (
               <div className="card fade-in">
                <div style={{fontSize:18,fontWeight:800,marginBottom:4}}>{selected.title}</div>
                <div style={{color:'var(--text-muted)',fontSize:12,marginBottom:20}}>by {selected.creatorName}</div>
                <div style={{borderTop:'1px solid var(--border)',paddingTop:16,marginBottom:16}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
                    <span style={{color:'var(--text-muted)'}}>Content price</span><span>₹{selected.price}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
                    <span style={{color:'var(--text-muted)'}}>Platform fee</span><span>₹0</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontWeight:800,fontSize:18,color:'var(--cyan)',paddingTop:12,borderTop:'1px solid var(--border)'}}>
                    <span>Total</span><span>₹{selected.price}</span>
                  </div>
                </div>
                <div className="form-group"><label>Payment Method</label>
                  <select><option>UPI</option><option>Card</option><option>Net Banking</option></select>
                </div>
                <button className="btn btn-primary" style={{width:'100%'}} onClick={handlePurchase}>
                  Pay ₹{selected.price}
                </button>
              </div>
            ) : (
               <div className="card" style={{textAlign:'center',padding:'48px 24px',color:'var(--text-muted)'}}>
                <div style={{fontSize:36,marginBottom:12}}>←</div>
                <div style={{fontSize:13}}>Select content to see payment details.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}