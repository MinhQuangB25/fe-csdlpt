
import { useNavigate } from 'react-router-dom'
import './Profile.css'
import BottomNav from "./BottomNav";

export default function Profile() {
  const navigate = useNavigate()

  const user = {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "admin@gmail.com",
    region: "SOUTH",
    created_at: "2026-03-01T10:00:00"
  }

  const menuItems = [
    { icon: "credit_card", label: "Phương thức thanh toán", path: "/payment" },
    { icon: "local_offer", label: "Khuyến mãi", path: "/promotions" },
    { icon: "history", label: "Lịch sử", path: "/history" },
    { icon: "dns", label: "Trạng thái Server", path: "/server" },
    { icon: "help", label: "Trợ giúp", path: "/help" },
    { icon: "settings", label: "Cài đặt", path: "/settings" }
  ]

  return (
    <div className="page profile-page">

      <div className="profile-bg">
        <div className="profile-circles">
          <div className="circle circle-1" />
          <div className="circle circle-2" />
        </div>
      </div>

      <div className="profile-content">

        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="material-icons-round">person</span>
          </div>

          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-phone">{user.phone}</p>
          <p className="profile-email">{user.email}</p>

          <div className="profile-badge">
            🌍 {user.region === "NORTH" ? "Miền Bắc" : "Miền Nam"}
          </div>
        </div>

        <div className="profile-menu card">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="profile-menu-item"
              onClick={() => navigate(item.path)}
            >
              <span className="material-icons-round menu-icon">
                {item.icon}
              </span>

              <span className="menu-label">{item.label}</span>

              <span className="material-icons-round menu-chevron">
                chevron_right
              </span>
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="profile-actions">
          <button className="btn btn-danger" onClick={() => navigate('/')}>
            <span className="material-icons-round">logout</span>
            Đăng xuất
          </button>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <BottomNav />
    </div>

  )

}