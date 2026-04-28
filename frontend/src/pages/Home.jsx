import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

const CARD_COLORS = ['card-top-1','card-top-2','card-top-3']
const CARD_EMOJIS = ['🏡','🏘️','🏠','🏛️','🏫']
const PLACEHOLDERS = [
  { name:'Orphanage 1', address:'Hubli, Karnataka', about:'A safe and caring home providing shelter, education and love to children in need.', capacity:'—', vacant:'—' },
  { name:'Orphanage 2', address:'Hubli, Karnataka', about:'Dedicated to the holistic development of every child through care and community.', capacity:'—', vacant:'—' },
  { name:'Orphanage 3', address:'Hubli, Karnataka', about:'Empowering children with education, healthcare and a nurturing environment.', capacity:'—', vacant:'—' }
]

export default function Home() {
  const navigate = useNavigate()
  const [orphanages, setOrphanages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    API.get('/orphanages').then(res => { setOrphanages(res.data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const total = Math.max(3, orphanages.length)
  const cards = Array.from({ length: total }, (_, i) => {
    const colorClass = CARD_COLORS[i % CARD_COLORS.length]
    const emoji = CARD_EMOJIS[i % CARD_EMOJIS.length]
    if (i < orphanages.length) {
      const o = orphanages[i]
      return { ...o, colorClass, emoji, link: `/orphanage/${o._id}` }
    }
    const p = PLACEHOLDERS[i] || PLACEHOLDERS[2]
    return { ...p, colorClass, emoji, link: null }
  })

  return (
    <>
      <Navbar />
      <div className="home-hero">
        <h1>Orphanages in <span>Hubli</span></h1>
        <p>Click on any orphanage to view details, facilities, location and more.</p>
      </div>
      <div className="cards-container">
        {loading && <p style={{color:'#9ca3af',fontSize:'14px'}}>Loading orphanages...</p>}
        {error && <p style={{color:'red',fontSize:'14px'}}>Could not connect to server. Make sure backend is running.</p>}
        {!loading && !error && cards.map((card, i) => (
          <div key={i} className="orphanage-card" onClick={() => card.link && navigate(card.link)} style={!card.link ? {cursor:'default',opacity:0.6} : {}}>
            <div className={`card-top ${card.colorClass}`}><div className="card-emoji">{card.emoji}</div></div>
            <div className="card-body">
              <h3>{card.name}</h3>
              <p className="card-location">📍 {card.address}</p>
              <p className="card-desc">{card.about}</p>
              <div className="card-stats">
                <div className="stat"><span className="stat-num">{card.capacity}</span><span className="stat-label">Capacity</span></div>
                <div className="stat-divider"></div>
                <div className="stat"><span className="stat-num">{card.vacant}</span><span className="stat-label">Vacant</span></div>
              </div>
              {card.link
                ? <button className="view-btn">View Details →</button>
                : <button className="view-btn" disabled style={{background:'#ccc',boxShadow:'none',cursor:'default'}}>Not listed yet</button>
              }
            </div>
          </div>
        ))}
      </div>
      <footer className="footer"><p>© 2025 OrphanConnect &nbsp;|&nbsp; Hubli, Karnataka</p></footer>
    </>
  )
}
