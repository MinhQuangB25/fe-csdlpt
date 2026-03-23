import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Trang chủ", icon: "home", path: "/home" },
    { label: "Lịch sử", icon: "history", path: "/history" },
    { label: "Thông báo", icon: "notifications", path: "/notifications" },
    { label: "Tài khoản", icon: "person", path: "/profile" },
  ];

  // 👉 mock badge (sau này lấy từ API)
  const unreadCount = 3;

  return (
    <div className="bottom-nav">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;

        return (
          <button
            key={index}
            className={`nav-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="material-icons-round nav-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>

            {/* badge cho notifications */}
            {item.path === "/notifications" && unreadCount > 0 && (
              <span className="nav-badge">{unreadCount}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}