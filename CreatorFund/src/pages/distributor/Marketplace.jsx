import { useState } from 'react'
import { allContent } from '../../data/mockData'
const active = allContent.filter(c => c.status === 'active')
const TYPE_COLORS = { music: 'purple', video: 'red', article: 'amber', course: 'green' }

export default function Marketplace() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const filtered = active.filter(c =>
    (filter === 'all' || c.type === filter) &&
    c.title.toLowerCase().includes(search.toLowerCase())
  )
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
              <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-ghost'}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <div className="search-bar" style={{width:240}}>
            <span style={{color:'var(--muted)'}}>⌕</span>
            <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="content-grid">
          {filtered.map(c => (
            <div className="content-card" key={c.id}>
              <div className={`content-type badge ${TYPE_COLORS[c.type]}`}>{c.type}</div>
              <div className="content-title">{c.title}</div>
              <div className="content-meta">by {c.creatorName}</div>
              <div className="content-price" style={{color:'var(--accent2)'}}>₹{c.price}</div>
              <div className="content-footer">
                <span style={{fontSize:11,color:'var(--muted)'}}>{c.salesCount}/{c.targetQty} sold</span>
                <button className="btn btn-primary btn-sm">Buy License</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}