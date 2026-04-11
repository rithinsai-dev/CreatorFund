import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Sidebar from './components/Sidebar'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRequests from './pages/admin/AdminRequests'
import AdminCreators from './pages/admin/AdminCreators'
import AdminCreatorRevenue from './pages/admin/AdminCreatorRevenue'
import AdminPlatformRevenue from './pages/admin/AdminPlatformRevenue'

// Creator pages
import CreatorDashboard from './pages/creator/CreatorDashboard'
import MyContent from './pages/creator/MyContent'
import CreatorRevenue from './pages/creator/CreatorRevenue'
import SubmitContent from './pages/creator/SubmitContent'

// Distributor pages
import DistDashboard from './pages/distributor/DistDashboard'
import Marketplace from './pages/distributor/Marketplace'
import MyOrders from './pages/distributor/MyOrders'

const PAGES = {
  admin: { dashboard: AdminDashboard, requests: AdminRequests, creators: AdminCreators, 'creator-revenue': AdminCreatorRevenue, 'platform-revenue': AdminPlatformRevenue },
  creator: { dashboard: CreatorDashboard, 'my-content': MyContent, revenue: CreatorRevenue, submit: SubmitContent },
  distributor: { dashboard: DistDashboard, marketplace: Marketplace, orders: MyOrders },
}

function Shell() {
  const { user } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [authView, setAuthView] = useState('login')
  if (!user) {
    return authView === 'login' 
      ? <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
      : <SignupPage onSwitchToLogin={() => setAuthView('login')} />
  }
  const PageComponent = PAGES[user.role]?.[page] || (() => <div style={{ padding: 40 }}>Page not found</div>)
  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="main-content"><PageComponent /></main>
    </div>
  )
}

export default function App() {
  return <AuthProvider><Shell /></AuthProvider>
}