// ============================================================
// OrphanageDetail.jsx
// ============================================================
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export function OrphanageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    API.get('/orphanages/' + id).then(res => setData(res.data)).catch(() => setError(true))
  }, [id])

  if (error) return <><Navbar /><div className="detail-wrapper"><div className="detail-header"><h1>Orphanage not found</h1></div></div></>
  if (!data) return <><Navbar /><div className="detail-wrapper"><div className="detail-header"><h1>Loading...</h1></div></div></>

  const encodedName = encodeURIComponent(data.name)
  return (
    <>
      <Navbar />
      <div className="detail-wrapper">
        <div className="detail-header">
          <h1>{data.name}</h1>
          <p>📍 {data.address}</p>
        </div>
        <div className="detail-section"><h2>About</h2><p>{data.about}</p></div>
        <div className="detail-section">
          <h2>Owner / Contact Details</h2>
          <table className="detail-table">
            <tbody>
              <tr><td>Owner Name</td><td>{data.ownerName||'—'}</td></tr>
              <tr><td>Phone</td><td>{data.ownerPhone||'—'}</td></tr>
              <tr><td>Email</td><td>{data.ownerEmail||'—'}</td></tr>
              <tr><td>Established</td><td>{data.established||'—'}</td></tr>
            </tbody>
          </table>
        </div>
        <div className="detail-section">
          <h2>Capacity & Vacancy</h2>
          <div className="capacity-row">
            <div className="capacity-box"><span className="capacity-num">{data.capacity}</span><span className="capacity-label">Total Capacity</span></div>
            <div className="capacity-box"><span className="capacity-num">{data.occupied}</span><span className="capacity-label">Currently Occupied</span></div>
            <div className="capacity-box"><span className="capacity-num">{data.vacant}</span><span className="capacity-label">Vacant</span></div>
          </div>
        </div>
        <div className="detail-section">
          <h2>Facilities</h2>
          <div className="facilities-grid">
            {data.facilities && data.facilities.length > 0
              ? data.facilities.map(f => <div key={f} className="facility-badge">{f}</div>)
              : '—'}
          </div>
        </div>
        <div className="detail-section">
          <h2>Location</h2>
          {data.mapLink
            ? <iframe src={data.mapLink} width="100%" height="200" style={{border:0,borderRadius:'8px'}} allowFullScreen loading="lazy" title="map"></iframe>
            : <div className="map-placeholder">🗺️ Location not set yet</div>}
        </div>
        <div className="detail-section donate-section">
          <button className="donate-btn" onClick={() => navigate(`/donate?orphanage=${id}&name=${encodedName}`)}>Donate</button>
          <button className="donate-btn" onClick={() => navigate(`/volunteer?orphanage=${id}&name=${encodedName}`)}>Volunteer</button>
          <button className="donate-btn" onClick={() => navigate(`/adopt?orphanage=${id}&name=${encodedName}`)}>Adopt</button>
        </div>
      </div>
      <footer className="footer"><p>© 2025 OrphanConnect &nbsp;|&nbsp; Hubli, Karnataka</p></footer>
    </>
  )
}
export default OrphanageDetail
