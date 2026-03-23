import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'


// import Login from './pages/Login'
// import Register from './pages/Register'
// import OTP from './pages/OTP'
// import Home from './pages/Home'
import Search from './pages/Search'
import Booking from './pages/Booking'
import Searching from './pages/Searching'
 import Tracking from './pages/Tracking'
  import Rate from './pages/Rate'
// import History from './pages/History'
// import Profile from './pages/Profile'
// import Failover from './pages/Failover'
// import Payment from './pages/Payment'
// import Notifications from './pages/Notifications'
// import Promotions from './pages/Promotions'


export default function App() {
  return (
    <Router>
      <Routes>
        {/* Tự động chuyển hướng vào trang search luôn cho tiện */}
        <Route path="/" element={<Navigate to="/search" replace />} />
        
        {/* Trang bạn vừa code */}
        <Route path="/search" element={<Search />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/searching" element={<Searching />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/rate" element={<Rate />} />
        {/* Các Route khác tạm ẩn đi */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        */}
      </Routes>
    </Router>
  )
}