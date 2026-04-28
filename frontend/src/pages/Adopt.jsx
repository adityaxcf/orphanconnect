import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function Adopt() {
  const navigate = useNavigate()
  const params = new URLSearchParams(useLocation().search)
  const orphanageId = params.get('orphanage')
  const orphanageName = params.get('name') || 'Orphanage'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [marital, setMarital] = useState('')
  const [occupation, setOccupation] = useState('')
  const [city, setCity] = useState('')
  const [agePref, setAgePref] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => { if (!localStorage.getItem('token')) navigate('/login') }, [])

  async function handleAdopt(e) {
    e.preventDefault()
    const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/
    if (!name) return alert('Name cannot be blank.')
    if (!email) return alert('Email cannot be blank.')
    if (!emailPattern.test(email)) return alert('Enter a valid email address.')
    if (!phone || phone.length !== 10 || isNaN(phone)) return alert('Enter a valid 10-digit phone number.')
    if (!age || parseInt(age) < 21) return alert('You must be at least 21 years old to adopt.')
    if (!marital) return alert('Please select your marital status.')
    if (!occupation) return alert('Occupation cannot be blank.')
    if (!city) return alert('Please enter your city/address.')
    if (!agePref) return alert('Please select your preferred age group.')
    if (!reason) return alert('Please provide a reason for adoption.')

    try {
      await API.post('/tickets', { userName: name, userEmail: email, userPhone: phone, orphanageId, orphanageName, type: 'adopt', age: parseInt(age), marital, occupation, city, agePref, reason })

      // Update occupied count
      try {
        const oRes = await API.get('/orphanages/' + orphanageId)
        const oData = oRes.data
        await API.patch('/orphanages/' + orphanageId, {
          occupied: Math.max(0, (oData.occupied || 0) - 1),
          vacant: (oData.vacant || 0) + 1
        })
      } catch(e) { console.log('Could not update occupancy:', e) }

      const visitDate = new Date()
      visitDate.setDate(visitDate.getDate() + 2)
      const formattedDate = visitDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

      alert(`🏠 Your adoption request has been submitted!\n\n✅ Your visit has been scheduled.\n📅 Please visit ${orphanageName} by ${formattedDate} to complete the formalities.\n\nYou can track your request in My Tickets.`)
      navigate('/home')
    } catch { alert('Something went wrong. Please try again.') }
  }

  return (
    <>
      <Navbar />
      <div className="detail-wrapper">
        <div className="detail-header"><h1>Adopt a Child</h1><p>Requesting adoption from {orphanageName}</p></div>
        <div className="detail-section">
          <h2>Your Information</h2>
          <form onSubmit={handleAdopt}>
            <div className="field"><label>Full Name</label><input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Phone Number</label><input type="text" placeholder="10-digit phone number" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field"><label>Age</label><input type="number" placeholder="Your age" min="21" value={age} onChange={e => setAge(e.target.value)} /></div>
            <div className="field"><label>Marital Status</label>
              <select value={marital} onChange={e => setMarital(e.target.value)}>
                <option value="">Select status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
            <div className="field"><label>Occupation</label><input type="text" placeholder="Your occupation" value={occupation} onChange={e => setOccupation(e.target.value)} /></div>
            <div className="field"><label>Home City / Address</label><input type="text" placeholder="Your city and address" value={city} onChange={e => setCity(e.target.value)} /></div>
            <div className="field"><label>Preferred Age Group of Child</label>
              <select value={agePref} onChange={e => setAgePref(e.target.value)}>
                <option value="">Select preference</option>
                <option value="0–3 years">0–3 years (Infant)</option>
                <option value="4–7 years">4–7 years (Toddler)</option>
                <option value="8–12 years">8–12 years (Child)</option>
                <option value="13–17 years">13–17 years (Teen)</option>
                <option value="No preference">No preference</option>
              </select>
            </div>
            <div className="field"><label>Reason for Adoption</label><textarea placeholder="Please briefly explain why you wish to adopt..." value={reason} onChange={e => setReason(e.target.value)} /></div>
            <button type="submit">Submit Adoption Request</button>
          </form>
        </div>
      </div>
    </>
  )
}
