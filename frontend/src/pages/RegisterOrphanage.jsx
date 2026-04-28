import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function RegisterOrphanage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleOwnerRegister(e) {
    e.preventDefault()
    const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/
    if (!name) return alert('Owner name cannot be blank.')
    if (!email) return alert('Email cannot be blank.')
    if (!emailPattern.test(email)) return alert('Enter a valid email address.')
    if (!phone || phone.length !== 10 || isNaN(phone)) return alert('Enter a valid 10-digit phone number.')
    if (!password) return alert('Password cannot be blank.')
    if (password.length < 6) return alert('Password must be at least 6 characters.')
    if (password !== confirm) return alert('Passwords do not match.')
    localStorage.setItem('pendingOwner', JSON.stringify({ name, email, phone, password }))
    navigate('/orphanage-setup')
  }

  return (
    <>
      <div className="dot-grid"></div>
      <div className="branding">
        <span className="brand-icon">🏠</span>
        <span className="brand-name">OrphanConnect</span>
      </div>
      <div className="hero-text">
        <h1 className="hero-title">Register your<br /><span>Orphanage.</span></h1>
        <p className="hero-sub">Create an owner account to manage your orphanage on OrphanConnect.</p>
      </div>
      <div className="wrapper">
        <div className="card floating">
          <div className="card-accent"></div>
          <div className="card-header">
            <h2>Owner Account</h2>
            <p>Step 1 of 2 — Your details</p>
          </div>
          <form onSubmit={handleOwnerRegister}>
            <div className="field"><label>Owner Full Name</label><input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email Address</label><input type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Phone Number</label><input type="text" placeholder="10-digit phone number" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <div className="field"><label>Confirm Password</label><input type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
            <button type="submit">Continue to Orphanage Setup →</button>
            <p className="switch-text">Already have an account? <Link to="/login">Sign in here</Link></p>
            <p className="switch-text">Registering as a user? <Link to="/register">User registration</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}