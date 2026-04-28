import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function Admin() {
  const navigate = useNavigate()
  const [orphanages, setOrphanages] = useState([])
  const [users, setUsers] = useState([])
  const [tickets, setTickets] = useState([])
  const [mainTab, setMainTab] = useState('orphanages')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}')
    if (!localStorage.getItem('token') || user.role !== 'admin') { navigate('/login'); return }
    loadAll()
  }, [])

  async function loadAll() {
    const [oRes, uRes, tRes] = await Promise.all([
      API.get('/orphanages/admin/all'),
      API.get('/auth/all-users'),
      API.get('/tickets/all')
    ])
    setOrphanages(oRes.data)
    setUsers(uRes.data)
    setTickets(tRes.data)
  }

  async function updateOrphanageStatus(id, status) {
    await API.patch('/orphanages/' + id + '/status', { status })
    loadAll()
  }

  const filteredOrphanages = filter === 'all' ? orphanages : orphanages.filter(o => o.status === filter)

  return (
    <>
      <Navbar />
      <div className="owner-wrapper">
        <div className="owner-header"><h1>Admin Dashboard</h1><p>Manage orphanages, users and all tickets</p></div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card"><span className="s-num">{orphanages.length}</span><span className="s-label">Orphanages</span></div>
          <div className="stat-card"><span className="s-num">{orphanages.filter(o => o.status === 'pending').length}</span><span className="s-label">Pending</span></div>
          <div className="stat-card"><span className="s-num">{users.length}</span><span className="s-label">Users</span></div>
          <div className="stat-card"><span className="s-num">{tickets.length}</span><span className="s-label">Total Tickets</span></div>
        </div>

        {/* Main Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${mainTab === 'orphanages' ? 'active' : ''}`} onClick={() => setMainTab('orphanages')}>🏠 Orphanages</button>
          <button className={`tab-btn ${mainTab === 'users' ? 'active' : ''}`} onClick={() => setMainTab('users')}>👤 Users</button>
          <button className={`tab-btn ${mainTab === 'tickets' ? 'active' : ''}`} onClick={() => setMainTab('tickets')}>🎫 All Tickets</button>
        </div>

        {/* Orphanages Tab */}
        {mainTab === 'orphanages' && (
          <>
            <div className="tabs" style={{marginTop:'12px'}}>
              {['all','pending','approved','rejected'].map(tab => (
                <button key={tab} className={`tab-btn ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div>
              {filteredOrphanages.length === 0
                ? <div className="empty-state">No orphanage requests found.</div>
                : [...filteredOrphanages].reverse().map(o => {
                  const date = new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                  return (
                    <div key={o._id} className="ticket-row">
                      <div className="ticket-row-icon donate">🏠</div>
                      <div className="ticket-row-info">
                        <h3>{o.name}</h3>
                        <p>📍 {o.address}</p>
                        <p>👤 {o.ownerName} · 📧 {o.ownerEmail} · 📞 {o.ownerPhone}</p>
                        <p>🛏️ Capacity: {o.capacity} · Occupied: {o.occupied} · Vacant: {o.vacant}</p>
                        <span className="row-meta">Submitted on {date}</span>
                      </div>
                      <div className="ticket-row-actions">
                        {o.status === 'pending'
                          ? <div className="action-btns">
                              <button className="btn-approve" onClick={() => updateOrphanageStatus(o._id, 'approved')}>✓ Approve</button>
                              <button className="btn-reject" onClick={() => updateOrphanageStatus(o._id, 'rejected')}>✗ Reject</button>
                            </div>
                          : <span className={`status-badge ${o.status}`}>{o.status}</span>
                        }
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </>
        )}

        {/* Users Tab */}
        {mainTab === 'users' && (
          <div>
            {users.length === 0
              ? <div className="empty-state">No users found.</div>
              : users.map(u => (
                <div key={u._id} className="ticket-row">
                  <div className="ticket-row-icon">👤</div>
                  <div className="ticket-row-info">
                    <h3>{u.name}</h3>
                    <p>📧 {u.email} {u.phone ? '· 📞 ' + u.phone : ''}</p>
                    <span className="row-meta">Role: {u.role} · Status: {u.status} · Joined: {new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                  </div>
                  <div className="ticket-row-actions">
                    <span className={`status-badge ${u.status}`}>{u.role}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* All Tickets Tab */}
        {mainTab === 'tickets' && (
          <div>
            {tickets.length === 0
              ? <div className="empty-state">No tickets found.</div>
              : tickets.map(ticket => {
                const icon = ticket.type.startsWith('donate') ? '💰' : ticket.type.startsWith('volunteer') ? '🤝' : '👶'
                const typeName = ticket.type.startsWith('donate') ? 'Donation' : ticket.type.startsWith('volunteer') ? 'Volunteer' : 'Adoption'
                const date = new Date(ticket.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
                return (
                  <div key={ticket._id} className="ticket-row">
                    <div className="ticket-row-icon">{icon}</div>
                    <div className="ticket-row-info">
                      <h3>{typeName} — {ticket.orphanageName}</h3>
                      <p>👤 {ticket.userName} · 📧 {ticket.userEmail}</p>
                      <span className="row-meta">{date}</span>
                    </div>
                    <div className="ticket-row-actions">
                      <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )}
      </div>
    </>
  )
}