import { useAuth } from '../context/useAuth';

const NAV_ITEMS = {
  admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'creators', label: 'Manage Creators' },
    { id: 'requests', label: 'Content Requests' },
    { id: 'creator-revenue', label: 'Creator Revenue' },
    { id: 'platform-revenue', label: 'Platform Revenue' }
  ],
  creator: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'my-content', label: 'My Content' },
    { id: 'submit', label: 'Submit Content' },
    { id: 'revenue', label: 'Revenue' }
  ],
  distributor: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'marketplace', label: 'Marketplace' },
    { id: 'orders', label: 'My Orders' }
  ]
};

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const role = user.role?.toLowerCase();
  const items = NAV_ITEMS[role] || [];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>CreatorFund</h3>
        <span className="badge">{user.role}</span>
      </div>
      <nav className="sidebar-nav">
        {items.map(item => (
          <button 
            key={item.id} 
            className={`nav-btn ${activePage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info">{user.email || user.name}</div>
        <button className="btn btn-sm" onClick={logout}>Logout</button>
      </div>
    </aside>
  );
}
