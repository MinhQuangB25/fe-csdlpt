import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import OTP from './pages/OTP'
import Home from './pages/Home'
import Search from './pages/Search'
import Booking from './pages/Booking'
import Searching from './pages/Searching'
import Tracking from './pages/Tracking'
import Rate from './pages/Rate'
import History from './pages/History'
import Profile from './pages/Profile'
import Failover from './pages/Failover'
import Payment from './pages/Payment'
import Notifications from './pages/Notifications'
import Promotions from './pages/Promotions'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/searching" element={<Searching />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/rate" element={<Rate />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/failover" element={<Failover />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/promotions" element={<Promotions />} />
      </Routes>
    </Router>
  )
}
