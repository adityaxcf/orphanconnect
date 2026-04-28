import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/
    if (!email) return alert('Email cannot be blank.')
    if (!emailPattern.test(email)) return alert('Enter a valid email address.')
    if (!password) return alert('Password cannot be blank.')
    if (password.length < 6) return alert('Password must be at least 6 characters.')

    try {
      const res = await API.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('currentUser', JSON.stringify(res.data.user))
      if (res.data.user.role === 'admin') navigate('/admin')
      else if (res.data.user.role === 'owner') navigate('/owner-dashboard')
      else navigate('/home')
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed.')
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
            <h2>Welcome</h2>
            <p>Sign in to continue</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="field">
              <label>Email Address</label>
              <input type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button type="submit">Sign In</button>
            <p className="switch-text">Don't have an account? <Link to="/register">Register here</Link></p>
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