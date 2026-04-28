import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}')
  const orphanageId = currentUser.orphanageId

  const [orphanage, setOrphanage] = useState(null)
  const [allTickets, setAllTickets] = useState([])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    if (!localStorage.getItem('token') || (currentUser.role !== 'owner' && currentUser.role !== 'admin')) { navigate('/login'); return }
    loadData()
  }, [])

  async function loadData() {
    const oRes = await API.get('/orphanages/' + orphanageId)
    setOrphanage(oRes.data)
    setEditData(oRes.data)
    const tRes = await API.get('/tickets/orphanage/' + orphanageId)
    setAllTickets(tRes.data)
  }

  async function saveEdit(e) {
    e.preventDefault()
    const { name, about, address, capacity, occupied, established, mapLink } = editData
    if (!name) return alert('Name cannot be blank.')
    if (!about) return alert('Description cannot be blank.')
    if (!address) return alert('Address cannot be blank.')
    if (!capacity || capacity < 1) return alert('Enter a valid capacity.')
    if (isNaN(occupied) || occupied < 0) return alert('Enter a valid occupancy.')
    if (parseInt(occupied) > parseInt(capacity)) return alert('Occupied cannot exceed capacity.')
    const vacant = parseInt(capacity) - parseInt(occupied)
    try {
      const res = await API.patch('/orphanages/' + orphanageId, { name, about, address, capacity: parseInt(capacity), occupied: parseInt(occupied), vacant, established, mapLink })
      setOrphanage(res.data)
      setShowModal(false)
      alert('✅ Details updated successfully!')
    } catch { alert('Failed to update. Please try again.') }
  }

  async function updateStatus(ticketId, status) {
    await API.patch('/tickets/' + ticketId + '/status', { status })
    setAllTickets(prev => prev.map(t => t._id === ticketId ? { ...t, status } : t))
  }

  const filtered = filter === 'all' ? allTickets : allTickets.filter(t => t.type === filter || t.type === filter + '-final')

  return (
    <>
      <Navbar />
      {showModal && (
        <div className="modal-overlay active">
          <div className="modal-box">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h2>✏️ Edit Orphanage Details</h2>
            <p>Changes will reflect immediately on the public page.</p>
            <form onSubmit={saveEdit}>
              <div className="field"><label>Orphanage Name</label><input type="text" value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})} /></div>
              <div className="field"><label>About</label><textarea style={{width:'100%',padding:'12px 14px',background:'#f4f7fb',border:'1.5px solid #dde3ef',borderRadius:'10px',fontSize:'14px',minHeight:'80px',fontFamily:'inherit'}} value={editData.about || ''} onChange={e => setEditData({...editData, about: e.target.value})} /></div>
              <div className="field"><label>Address</label><input type="text" value={editData.address || ''} onChange={e => setEditData({...editData, address: e.target.value})} /></div>
              <div className="field"><label>Total Capacity</label><input type="number" value={editData.capacity || ''} onChange={e => setEditData({...editData, capacity: e.target.value})} /></div>
              <div className="field"><label>Currently Occupied</label><input type="number" value={editData.occupied || ''} onChange={e => setEditData({...editData, occupied: e.target.value})} /></div>
              <p style={{fontSize:'12px',color:'#9ca3af',marginTop:'-10px',marginBottom:'14px'}}>💡 Vacant = Capacity − Occupied (auto-calculated)</p>
              <div className="field"><label>Established Year</label><input type="text" value={editData.established || ''} onChange={e => setEditData({...editData, established: e.target.value})} /></div>
              <div className="field"><label>Google Maps Embed Link</label><input type="text" value={editData.mapLink || ''} onChange={e => setEditData({...editData, mapLink: e.target.value})} /></div>
              <button type="submit" style={{width:'100%',background:'linear-gradient(135deg,#4a72c4,#3b5998)',color:'#fff',border:'none',padding:'13px',borderRadius:'11px',fontSize:'15px',fontWeight:'700',cursor:'pointer',marginTop:'8px'}}>Save Changes</button>
            </form>
          </div>
        </div>
      )}

      <div className="owner-wrapper">
        <div className="owner-header">
          <h1>{orphanage?.name || 'My Orphanage'}</h1>
          <p>{orphanage ? '📍 ' + orphanage.address : 'Manage your orphanage and incoming requests'}</p>
        </div>
        {orphanage && (
          <div className="orphanage-profile">
            <h2>{orphanage.name}</h2>
            <p>{orphanage.about}</p>
            <div className="profile-grid">
              {[['Owner', orphanage.ownerName], ['Phone', orphanage.ownerPhone], ['Capacity', orphanage.capacity], ['Occupied', orphanage.occupied], ['Vacant', orphanage.vacant], ['Established', orphanage.established || '—']].map(([k, v]) => (
                <div key={k} className="profile-item"><span>{k}</span><span>{v}</span></div>
              ))}
            </div>
            <button className="edit-btn" onClick={() => setShowModal(true)}>✏️ Edit Details</button>
          </div>
        )}
        <div className="stats-row">
          <div className="stat-card"><span className="s-num">{allTickets.length}</span><span className="s-label">Total Requests</span></div>
          <div className="stat-card"><span className="s-num">{allTickets.filter(t => t.status === 'pending').length}</span><span className="s-label">Pending</span></div>
          <div className="stat-card"><span className="s-num">{allTickets.filter(t => t.status === 'approved').length}</span><span className="s-label">Approved</span></div>
          <div className="stat-card"><span className="s-num">{allTickets.filter(t => t.status === 'rejected').length}</span><span className="s-label">Rejected</span></div>
        </div>
        <div className="section-title">📋 Incoming Requests</div>
        <div className="tabs">
          {['all','donate','volunteer','adopt'].map(tab => (
            <button key={tab} className={`tab-btn ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
              {tab === 'all' ? 'All' : tab === 'donate' ? 'Donations' : tab === 'volunteer' ? 'Volunteer' : 'Adoption'}
            </button>
          ))}
        </div>
        <div>
          {filtered.length === 0
            ? <div className="empty-state">No requests found in this category.</div>
            : filtered.map(ticket => {
              const icon = ticket.type.startsWith('donate') ? '💰' : ticket.type.startsWith('volunteer') ? '🤝' : '👶'
              const typeName = ticket.type.startsWith('donate') ? 'Donation' : ticket.type.startsWith('volunteer') ? 'Volunteer' : 'Adoption'
              const date = new Date(ticket.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
              let detail = ''
              if (ticket.type === 'donate') detail = ticket.donationType === 'Money' ? 'Amount: ₹' + ticket.amount : 'Type: ' + ticket.donationType
              if (ticket.type === 'volunteer') detail = ticket.helpType + ' · ' + ticket.availability
              if (ticket.type === 'adopt') detail = 'Age pref: ' + ticket.agePref + ' · Marital: ' + ticket.marital
              if (ticket.type === 'adopt-final') detail = 'Final request for: ' + ticket.childName

              return (
                <div key={ticket._id} className="ticket-row">
                  <div className="ticket-row-icon">{icon}</div>
                  <div className="ticket-row-info">
                    <h3>{typeName} from {ticket.userName}</h3>
                    <p>{detail}</p>
                    <span className="row-meta">📧 {ticket.userEmail} · 📞 {ticket.userPhone} · {date}</span>
                  </div>
                  <div className="ticket-row-actions">
                    {ticket.status === 'pending'
                      ? <div className="action-btns">
                          <button className="btn-approve" onClick={() => updateStatus(ticket._id, 'approved')}>✓ Approve</button>
                          <button className="btn-reject" onClick={() => updateStatus(ticket._id, 'rejected')}>✗ Reject</button>
                        </div>
                      : <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}
