import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import BottomNav from '../components/BottomNav'

const menuItems = [
    { icon: 'credit_card', label: 'Phương thức thanh toán', path: '/payment', color: '#0db9f2' },
    { icon: 'local_offer', label: 'Khuyến mãi & Mã giảm giá', path: '/promotions', color: '#f97316' },
    { icon: 'receipt_long', label: 'Lịch sử chuyến đi', path: '/history', color: '#10b981' },
    { icon: 'dns', label: 'Trạng thái Server', path: '/failover', color: '#22c55e' },
    { icon: 'help_outline', label: 'Trợ giúp & Hỗ trợ', color: '#06b6d4' },
    { icon: 'settings', label: 'Cài đặt', color: '#6b7280' },
    { icon: 'info', label: 'Về GoiXe', color: '#a78bfa' },
]

export default function Profile() {
    const navigate = useNavigate()
    const { user, region, logout } = useUser()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>Tài khoản</h2>
            </div>
            <div style={{ padding: '0 20px 100px' }}>
                {/* Avatar card */}
                <div className="card" style={{ textAlign: 'center', padding: 24, marginBottom: 20 }}>
                    <div style={{
                        width: 72, height: 72, margin: '0 auto 12px',
                        background: 'var(--gradient-primary)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(13,185,242,0.3)'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: 36, color: 'white' }}>person</span>
                    </div>
                    <h3>{user?.name || 'Vị Khách Ẩn Danh'}</h3>
                    <p style={{ fontSize: 13 }}>{user?.phone || 'Chưa cập nhật số điện thoại'}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                        <span className="material-icons-round" style={{ fontSize: 18, color: '#eab308' }}>star</span>
                        <span style={{ fontWeight: 700, fontSize: 16 }}>5.0</span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>• Thành viên mới</span>
                    </div>
                    <div className="badge badge-blue" style={{ marginTop: 12 }}>
                        {region === 'NORTH' ? '🍁 Miền Bắc' : '🌴 Miền Nam'}
                    </div>
                </div>

                {/* Menu */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {menuItems.map(item => (
                        <button
                            key={item.label}
                            onClick={() => item.path && navigate(item.path)}
                            className="card"
                            style={{
                                display: 'flex', alignItems: 'center', gap: 14, padding: 16,
                                cursor: 'pointer', width: '100%', textAlign: 'left'
                            }}
                        >
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: `${item.color}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <span className="material-icons-round" style={{ color: item.color, fontSize: 22 }}>{item.icon}</span>
                            </div>
                            <span style={{ flex: 1, fontWeight: 500, fontSize: 15 }}>{item.label}</span>
                            <span className="material-icons-round" style={{ color: 'var(--text-muted)', fontSize: 20 }}>chevron_right</span>
                        </button>
                    ))}
                </div>

                <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: 24 }}>
                    <span className="material-icons-round">logout</span>
                    Đăng xuất
                </button>
            </div>
            <BottomNav />
        </div>
    )
}
