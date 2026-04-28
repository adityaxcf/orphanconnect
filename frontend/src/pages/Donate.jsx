import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api'
import Navbar from '../components/Navbar'

export default function Donate() {
  const navigate = useNavigate()
  const params = new URLSearchParams(useLocation().search)
  const orphanageId = params.get('orphanage')
  const orphanageName = params.get('name') || 'Orphanage'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [donationType, setDonationType] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login')
  }, [])

  async function saveTicket(n, e, p, type, amt, msg, paymentId) {
    await API.post('/tickets', {
      userName: n, userEmail: e, userPhone: p,
      orphanageId, orphanageName, type: 'donate',
      donationType: type, amount: amt, message: msg, paymentId
    })
    alert(type === 'Money'
      ? 'Payment successful! Donation ticket submitted.'
      : 'Thank you! Your donation request has been submitted.')
    navigate('/home')
  }

  async function openRazorpay(n, e, p, amt, msg) {
    const orderRes = await API.post('/payment/create-order', { amount: parseInt(amt) })
    const { orderId, amount: orderAmount, currency } = orderRes.data
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: orderAmount, currency, order_id: orderId,
      name: 'OrphanConnect', description: 'Donation to ' + orphanageName,
      prefill: { name: n, email: e, contact: p },
      theme: { color: '#4a72c4' },
      handler: async function(response) {
        const verifyRes = await API.post('/payment/verify', response)
        if (verifyRes.data.verified) {
          await saveTicket(n, e, p, 'Money', parseInt(amt), msg, verifyRes.data.paymentId)
        } else {
          alert('Payment verification failed.')
        }
      },
      modal: { ondismiss: () => alert('Payment was cancelled.') }
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  async function handleDonate(e) {
    e.preventDefault()
    const emailPattern = /^[a-zA-Z0-9._]+@[a-zA-Z0-9]+(\.[a-zA-Z]{2,})+$/
    if (!name) return alert('Name cannot be blank.')
    if (!email) return alert('Email cannot be blank.')
    if (!emailPattern.test(email)) return alert('Enter a valid email address.')
    if (!phone || phone.length !== 10) return alert('Enter a valid 10 digit phone number.')
    if (!donationType) return alert('Please select a donation type.')
    if (donationType === 'Money' && (!amount || parseInt(amount) < 1)) return alert('Please enter a valid amount.')

    if (donationType === 'Money') {
      await openRazorpay(name, email, phone, amount, message)
    } else {
      await saveTicket(name, email, phone, donationType, 0, message, '')
    }
  }

  return (
    <>
      <Navbar />
      <div className="detail-wrapper">
        <div className="detail-header"><h1>Donate</h1><p>Donating to {orphanageName}</p></div>
        <div className="detail-section">
          <form onSubmit={handleDonate}>
            <div className="field"><label>Full Name</label><input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="field"><label>Email</label><input type="text" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div className="field"><label>Phone Number</label><input type="text" placeholder="Your phone number" value={phone} onChange={e => setPhone(e.target.value)} /></div>
            <div className="field">
              <label>Type of Donation</label>
              <select value={donationType} onChange={e => setDonationType(e.target.value)}>
                <option value="">Select type</option>
                <option value="Money">Money</option>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Books">Books</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {donationType === 'Money' && (
              <div className="field"><label>Amount (₹)</label><input type="number" placeholder="Enter amount" min="1" value={amount} onChange={e => setAmount(e.target.value)} /></div>
            )}
            <div className="field"><label>Message / Note (Optional)</label><textarea placeholder="Any message for the orphanage" value={message} onChange={e => setMessage(e.target.value)} /></div>
            <button type="submit">Submit Donation</button>
          </form>
        </div>
      </div>
      <footer className="footer"><p>© 2025 OrphanConnect &nbsp;|&nbsp; Hubli, Karnataka</p></footer>
    </>
  )
}
