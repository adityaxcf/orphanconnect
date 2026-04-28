import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function OrphanageSetup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [orphanageName, setOrphanageName] = useState('')
  const [about, setAbout] = useState('')
  const [address, setAddress] = useState('')
  const [established, setEstablished] = useState('')
  const [capacity, setCapacity] = useState('')
  const [occupied, setOccupied] = useState('')
  const [facilities, setFacilities] = useState([])
  const [mapLink, setMapLink] = useState('')

  const facilityOptions = ['🍽️ Meals','📚 Library','🏥 Medical','🛏️ Dormitory','⚽ Sports','🧹 Hygiene','💻 Computer Lab','🎨 Arts & Crafts']

  function toggleFacility(f) {
    setFacilities(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  function goStep2(e) {
    e.preventDefault()
    if (!orphanageName) return alert('Orphanage name cannot be blank.')
    if (!about) return alert('Please write a short description.')
    if (!address) return alert('Address cannot be blank.')
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!capacity) return alert('Please enter total capacity.')
    if (!occupied) return alert('Please enter current occupancy.')
    if (parseInt(occupied) > parseInt(capacity)) return alert('Occupied cannot exceed total capacity.')

    const ownerData = JSON.parse(localStorage.getItem('pendingOwner') || '{}')
    try {
      await API.post('/auth/register-owner', {
        name: ownerData.name,
        email: ownerData.email,
        password: ownerData.password,
        phone: ownerData.phone,
        orphanage: {
          name: orphanageName, about, address, established,
          capacity: parseInt(capacity),
          occupied: parseInt(occupied),
          vacant: parseInt(capacity) - parseInt(occupied),
          facilities, mapLink
        }
      })
      localStorage.removeItem('pendingOwner')
      alert('Your orphanage has been submitted for admin approval!')
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.error || 'Submission failed.')
    }
  }

  return (
    <div className="wrapper">
      <div className="card floating setup-card">
        <div className="card-accent"></div>
        {step === 1 ? (
          <form onSubmit={goStep2}>
            <p className="step-header">Step 1 of 2 — Basic Information</p>
            <div className="field"><label>Orphanage Name</label><input type="text" placeholder="e.g. Shanti Nivas Orphanage" value={orphanageName} onChange={e => setOrphanageName(e.target.value)} /></div>
            <div className="field"><label>About / Description</label><textarea placeholder="Describe your orphanage..." value={about} onChange={e => setAbout(e.target.value)} /></div>
            <div className="field"><label>Address</label><input type="text" placeholder="Full address, Hubli, Karnataka" value={address} onChange={e => setAddress(e.target.value)} /></div>
            <div className="field"><label>Established Year (Optional)</label><input type="text" placeholder="e.g. 2005" value={established} onChange={e => setEstablished(e.target.value)} /></div>
            <div className="step-nav"><button type="submit">Next →</button></div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="step-header">Step 2 of 2 — Capacity & Facilities</p>
            <div className="field"><label>Total Capacity</label><input type="number" placeholder="e.g. 50" value={capacity} onChange={e => setCapacity(e.target.value)} /></div>
            <div className="field"><label>Currently Occupied</label><input type="number" placeholder="e.g. 38" value={occupied} onChange={e => setOccupied(e.target.value)} /></div>
            <div className="field">
              <label>Facilities Available</label>
              <div className="facilities-check">
                {facilityOptions.map(f => (
                  <label key={f} className="fac-item">
                    <input type="checkbox" checked={facilities.includes(f)} onChange={() => toggleFacility(f)} /> {f}
                  </label>
                ))}
              </div>
            </div>
            <div className="field"><label>Google Maps Embed Link (Optional)</label><input type="text" placeholder="Paste Google Maps embed src URL here" value={mapLink} onChange={e => setMapLink(e.target.value)} /></div>
            <div className="step-nav">
              <button type="button" className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              <button type="submit">Submit for Approval ✓</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
