import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  async function handleRegister(e) {
    e.preventDefault()
    const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/
    if (!name) return alert('Full name cannot be blank.')
    if (!email) return alert('Email cannot be blank.')
    if (!emailPattern.test(email)) return alert('Enter a valid email address.')
    if (!password) return alert('Password cannot be blank.')
    if (password.length < 6) return alert('Password must be at least 6 characters.')
    if (password !== confirm) return alert('Passwords do not match.')

    try {
      const res = await API.post('/auth/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))
      navigate('/home')
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed.')
    }
  }

  return (
    <>
      <div className="dot-grid"></div>
      <div className="branding">
        <span className="brand-icon">🏠</span>
        <span className="brand-name">OrphanConnect</span>
      </div>
      <div className="hero-text">
        <h1 className="hero-title">Orphanages in Hubli,<br /><span>at your fingertips.</span></h1>
        <p className="hero-sub">Browse, explore and support orphanages near you.</p>
      </div>
      <div className="wrapper">
        <div className="card floating">
          <div className="card-accent"></div>
          <div className="card-header">
            <h2>Create Account</h2>
            <p>Join and get started</p>
          </div>
          <form onSubmit={handleRegister}>
            <div className="field"><label>Full Name</label><input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email Address</label><input type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Password</label><input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} /></div>
            <div className="field"><label>Confirm Password</label><input type="password" placeholder="Repeat your password" value={confirm} onChange={e => setConfirm(e.target.value)} /></div>
            <button type="submit">Create Account</button>
            <p className="switch-text">Already have an account? <Link to="/login">Sign in here</Link></p>
            <div className="register-orphanage-divider">
              <p>Are you an orphanage owner?</p>
              <Link to="/register-orphanage" className="register-orphanage-link">🏠 Register your Orphanage</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}