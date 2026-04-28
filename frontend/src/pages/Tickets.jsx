import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function Tickets() {
  const navigate = useNavigate()
  const [allTickets, setAllTickets] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    API.get('/tickets/mine').then(res => setAllTickets(res.data))
  }, [])

  const filtered = filter === 'all' ? allTickets : allTickets.filter(t => t.type === filter || t.type === filter + '-final')

  return (
    <>
      <Navbar />
      <div className="tickets-wrapper">
        <div className="tickets-header"><h1>My Tickets</h1><p>Track your donation, volunteer and adoption requests.</p></div>
        <div className="tabs">
          {['all','donate','volunteer','adopt'].map(tab => (
            <button key={tab} className={`tab-btn ${filter === tab ? 'active' : ''}`} onClick={() => setFilter(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}{tab === 'all' ? '' : tab === 'donate' ? 'ions' : tab === 'volunteer' ? '' : 'ion'}
            </button>
          ))}
        </div>
        <div id="tickets-list">
          {filtered.length === 0
            ? <div className="tickets-empty-state"><div className="empty-icon">🎫</div><p>No tickets found.<br /><a href="/home">Browse orphanages</a> to donate, volunteer or adopt.</p></div>
            : filtered.map(ticket => {
              const icon = ticket.type.startsWith('donate') ? '💰' : ticket.type.startsWith('volunteer') ? '🤝' : '👶'
              const typeName = ticket.type.startsWith('donate') ? 'Donation' : ticket.type.startsWith('volunteer') ? 'Volunteer' : 'Adoption'
              const date = new Date(ticket.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })
              let detail = ''
              if (ticket.type === 'donate') detail = ticket.donationType === 'Money' ? '₹' + ticket.amount : ticket.donationType
              if (ticket.type === 'volunteer') detail = ticket.helpType + ' · ' + ticket.availability
              if (ticket.type === 'adopt') detail = 'Adoption request · Age pref: ' + ticket.agePref
              if (ticket.type === 'adopt-final') detail = 'Final adoption request for ' + ticket.childName

              return (
                <div key={ticket._id} className="ticket-card">
                  <div className="ticket-icon">{icon}</div>
                  <div className="ticket-info">
                    <h3>{typeName} — {ticket.orphanageName}</h3>
                    <p>{detail}</p>
                    <span className="ticket-meta">Submitted on {date}</span>
                  </div>
                  <div className="ticket-status">
                    <span className={`status-badge ${ticket.status}`}>{ticket.status}</span>
                    {ticket.type === 'adopt' && ticket.status === 'approved' && (
                      <button className="view-children-btn" onClick={() => navigate('/children?orphanage=' + ticket.orphanageId)}>View Children →</button>
                    )}
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
