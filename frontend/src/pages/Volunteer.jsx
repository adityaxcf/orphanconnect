import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function Volunteer() {
  const navigate = useNavigate()
  const params = new URLSearchParams(useLocation().search)
  const orphanageId = params.get('orphanage')
  const orphanageName = params.get('name') || 'Orphanage'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [availability, setAvailability] = useState('')
  const [helpType, setHelpType] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { if (!localStorage.getItem('token')) navigate('/login') }, [])

  async function handleVolunteer(e) {
    e.preventDefault()
    const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/
    if (!name) return alert('Name cannot be blank.')
    if (!email) return alert('Email cannot be blank.')
    if (!emailPattern.test(email)) return alert('Enter a valid email address.')
    if (!phone || phone.length !== 10) return alert('Enter a valid 10 digit phone number.')
    if (!age) return alert('Age cannot be blank.')
    if (isNaN(age) || parseInt(age) < 18) return alert('You must be at least 18 to volunteer.')
    if (!availability) return alert('Please select your availability.')
    if (!helpType) return alert('Please select your type of help.')

    try {
      await API.post('/tickets', { userName: name, userEmail: email, userPhone: phone, orphanageId, orphanageName, type: 'volunteer', age: parseInt(age), availability, helpType, message })
      alert('Thank you for volunteering! You can track your ticket in My Tickets.')
      navigate('/home')
    } catch { alert('Something went wrong. Please try again.') }
  }

  return (
    <>
      <Navbar />
      <div className="detail-wrapper">
        <div className="detail-header"><h1>Volunteer</h1><p>Volunteering for {orphanageName}</p></div>
        <div className="detail-section">
          <form onSubmit={handleVolunteer}>
            <div className="field"><label>Full Name</label><input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Phone Number</label><input type="text" placeholder="Your phone number" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field"><label>Age</label><input type="text" placeholder="Your age" value={age} onChange={e => setAge(e.target.value)} /></div>
            <div className="field"><label>Availability</label>
              <select value={availability} onChange={e => setAvailability(e.target.value)}>
                <option value="">Select availability</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="field"><label>Type of Help</label>
              <select value={helpType} onChange={e => setHelpType(e.target.value)}>
                <option value="">Select type of help</option>
                <option value="Teaching">Teaching</option>
                <option value="Cooking">Cooking</option>
                <option value="Medical">Medical</option>
                <option value="General Help">General Help</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field"><label>Message / Note (Optional)</label><textarea placeholder="Anything you want the orphanage to know" value={message} onChange={e => setMessage(e.target.value)} /></div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <footer className="footer"><p>© 2025 OrphanConnect &nbsp;|&nbsp; Hubli, Karnataka</p></footer>
    </>
  )
}
