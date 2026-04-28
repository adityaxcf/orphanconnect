import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function Children() {
  const navigate = useNavigate()
  const params = new URLSearchParams(useLocation().search)
  const orphanageId = params.get('orphanage')
  const [orphanageName, setOrphanageName] = useState('')
  const [children, setChildren] = useState([])
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return }
    API.get('/orphanages/' + orphanageId).then(res => setOrphanageName(res.data.name + ', Hubli, Karnataka'))
    API.get('/children/' + orphanageId).then(res => setChildren(res.data))
    API.get('/tickets/mine').then(res => {
      const hasApproved = res.data.some(t => t.type === 'adopt' && t.status === 'approved' && t.orphanageId === orphanageId)
      setShowBanner(hasApproved)
    })
  }, [])

  async function adoptChild(childId, childName) {
    if (!window.confirm('Submit an adoption request for ' + childName + '?')) return
    try {
      await API.post('/tickets', {
        orphanageId, orphanageName, type: 'adopt-final',
        childId, childName,
        userName: JSON.parse(localStorage.getItem('currentUser') || '{}').name || '',
        userEmail: JSON.parse(localStorage.getItem('currentUser') || '{}').email || '',
        userPhone: ''
      })
      alert('Your request to adopt ' + childName + ' has been submitted!')
      navigate('/tickets')
    } catch { alert('Something went wrong. Please try again.') }
  }

  return (
    <>
      <Navbar />
      <div className="children-wrapper">
        <div className="children-header">
          <h1>Children Available for Adoption</h1>
          <p>{orphanageName || 'Loading...'}</p>
        </div>
        {showBanner && <div className="info-banner">✅ Your adoption request was approved. Please select a child to submit your final adoption request.</div>}
        <div className="children-grid">
          {children.length === 0
            ? <p className="no-children-msg">No children listed yet. Please check back later.</p>
            : children.map(child => (
              <div key={child._id} className="child-card">
                <div className={`child-avatar ${child.gender || 'boy'}`}>{child.gender === 'girl' ? '👧' : '👦'}</div>
                <div className="child-body">
                  <h3>{child.name}</h3>
                  <p className="child-age">{child.age} years old</p>
                  <p className="child-about">{child.about}</p>
                  <div className="child-tags">{(child.tags || []).map(t => <span key={t} className="child-tag">{t}</span>)}</div>
                  <button className="adopt-child-btn" onClick={() => adoptChild(child._id, child.name)}>Request to Adopt</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}
