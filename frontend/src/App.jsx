import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterOrphanage from './pages/RegisterOrphanage'
import OrphanageSetup from './pages/OrphanageSetup'
import Home from './pages/Home'
import OrphanageDetail from './pages/OrphanageDetail'
import Donate from './pages/Donate'
import Volunteer from './pages/Volunteer'
import Adopt from './pages/Adopt'
import Children from './pages/Children'
import Tickets from './pages/Tickets'
import OwnerDashboard from './pages/OwnerDashboard'
import Admin from './pages/Admin'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-orphanage" element={<RegisterOrphanage />} />
        <Route path="/orphanage-setup" element={<OrphanageSetup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/orphanage/:id" element={<OrphanageDetail />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/volunteer" element={<Volunteer />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/children" element={<Children />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App