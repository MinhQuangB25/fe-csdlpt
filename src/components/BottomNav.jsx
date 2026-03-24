import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
    { icon: 'home', label: 'Trang chủ', path: '/home' },
    { icon: 'receipt_long', label: 'Hoạt động', path: '/history' },
    { icon: 'notifications', label: 'Thông báo', path: '/notifications' },
    { icon: 'account_circle', label: 'Tài khoản', path: '/profile' },
]

export default function BottomNav() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav className="bottom-nav">
            {tabs.map(tab => (
                <button
                    key={tab.path}
                    className={`nav-item ${location.pathname === tab.path ? 'active' : ''}`}
                    onClick={() => navigate(tab.path)}
                >
                    <span className="material-icons-round">{tab.icon}</span>
                    {tab.label}
                </button>
            ))}
        </nav>
    )
}
