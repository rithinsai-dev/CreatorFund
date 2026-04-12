import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Sidebar from './components/Sidebar'


import AdminDashboard from './pages/admin/AdminDashboard'
import AdminRequests from './pages/admin/AdminRequests'
import AdminCreators from './pages/admin/AdminCreators'
import AdminCreatorRevenue from './pages/admin/AdminCreatorRevenue'
import AdminPlatformRevenue from './pages/admin/AdminPlatformRevenue'


import CreatorDashboard from './pages/creator/CreatorDashboard'
import MyContent from './pages/creator/MyContent'
import CreatorRevenue from './pages/creator/CreatorRevenue'
import SubmitContent from './pages/creator/SubmitContent'
import ManageRights from './pages/creator/ManageRights'


import DistDashboard from './pages/distributor/DistDashboard'
import Marketplace from './pages/distributor/Marketplace'
import MyOrders from './pages/distributor/MyOrders'

function NotFoundPage() {
  return <div style={{ padding: 40 }}>Page not found</div>
}

const PAGES = {
  admin: { dashboard: AdminDashboard, requests: AdminRequests, creators: AdminCreators, 'creator-revenue': AdminCreatorRevenue, 'platform-revenue': AdminPlatformRevenue },
  creator: { dashboard: CreatorDashboard, 'my-content': MyContent, revenue: CreatorRevenue, submit: SubmitContent, 'manage-rights': ManageRights },
  distributor: { dashboard: DistDashboard, marketplace: Marketplace, orders: MyOrders },
}

function Shell() {
  const { user } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [selectedContentId, setSelectedContentId] = useState(null)
  const [authView, setAuthView] = useState('login')
  if (!user) {
    return authView === 'login' 
      ? <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
      : <SignupPage onSwitchToLogin={() => setAuthView('login')} />
  }
  const role = user.role?.toLowerCase()
  
  const handleNavigate = (newPage, contentId = null) => {
    setPage(newPage)
    if (contentId) setSelectedContentId(contentId)
  }

  const PageComponent = PAGES[role]?.[page] || NotFoundPage
  
  return (
    <div className="app-shell">
      <Sidebar activePage={page} onNavigate={handleNavigate} />
      <main className="main-content">
        <PageComponent 
          contentId={selectedContentId} 
          onNavigate={handleNavigate} 
          onBack={() => setPage('my-content')} 
        />
      </main>
    </div>
  )
}

export default function App() {
  return <AuthProvider><Shell /></AuthProvider>
}
