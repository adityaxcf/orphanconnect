import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')

  function logout() {
    localStorage.clear()
    navigate('/login')
  }

  const isHome = location.pathname === '/home'
  const isOwner = currentUser.role === 'owner'
  const isAdmin = currentUser.role === 'admin'

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/home')} style={{cursor:'pointer'}}>
        <span>🏠</span>
        <span>OrphanConnect{isAdmin ? ' — Admin' : ''}</span>
      </div>
      <div className="nav-right">
        {isAdmin && <span className="nav-user">👤 Admin</span>}
        {isOwner && <span className="nav-user">{currentUser.name}</span>}
        {!isHome && !isOwner && !isAdmin && <a className="nav-back" onClick={() => navigate(-1)} style={{cursor:'pointer'}}>← Back</a>}
        {isHome && <a className="nav-tickets" onClick={() => navigate('/tickets')} style={{cursor:'pointer'}}>🎫 My Tickets</a>}
        <a className="nav-logout" onClick={logout} style={{cursor:'pointer'}}>Logout</a>
      </div>
    </nav>
  )
}
