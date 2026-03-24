import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const notifications = [
    { id: 1, type: 'ride', icon: 'two_wheeler', title: 'Chuyến đi hoàn thành', desc: 'Bạn đã đến Sân bay Tân Sơn Nhất. Tổng: 15.000đ', time: '5 phút trước', unread: true },
    { id: 2, type: 'promo', icon: 'local_offer', title: 'Giảm 20% cho chuyến tiếp', desc: 'Dùng mã GOIXE20 để được giảm 20% tối đa 30K', time: '1 giờ trước', unread: true },
    { id: 3, type: 'system', icon: 'warning', title: 'Bảo trì Server Miền Bắc', desc: 'Server HN bảo trì 23:00-02:00. Dịch vụ không bị ảnh hưởng.', time: '3 giờ trước', unread: false },
    { id: 4, type: 'ride', icon: 'star', title: 'Tài xế đánh giá bạn 5 sao', desc: 'Nguyễn Văn Tài đã đánh giá bạn 5 sao', time: 'Hôm qua', unread: false },
    { id: 5, type: 'promo', icon: 'celebration', title: 'Chào mừng thành viên mới!', desc: 'Nhận mã NEWUSER giảm 30K cho chuyến đầu', time: '2 ngày trước', unread: false },
    { id: 6, type: 'system', icon: 'update', title: 'Cập nhật phiên bản 2.1', desc: 'Nhiều tính năng mới và sửa lỗi', time: '1 tuần trước', unread: false },
]

const tabs = ['Tất cả', 'Chuyến đi', 'Khuyến mãi', 'Hệ thống']
const tabMap = { 'Chuyến đi': 'ride', 'Khuyến mãi': 'promo', 'Hệ thống': 'system' }

export default function Notifications() {
    const navigate = useNavigate()
    const [tab, setTab] = useState('Tất cả')
    const unreadCount = notifications.filter(n => n.unread).length

    const filtered = tab === 'Tất cả' ? notifications : notifications.filter(n => n.type === tabMap[tab])
    const iconColor = { ride: '#0db9f2', promo: '#f97316', system: '#ef4444' }

    return (
        <div className="page">
            <div className="page-header" style={{ justifyContent: 'space-between' }}>
                <h2>Thông báo {unreadCount > 0 && <span className="badge badge-blue" style={{ fontSize: 11, marginLeft: 6 }}>{unreadCount}</span>}</h2>
                <button className="btn-text" style={{ fontSize: 12, padding: '6px 8px' }}>Đọc tất cả</button>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto' }}>
                    {tabs.map(t => (
                        <button key={t} onClick={() => setTab(t)} style={{
                            padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', border: 'none', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'all 0.2s',
                            background: tab === t ? 'rgba(13,185,242,0.2)' : 'var(--bg-card)',
                            color: tab === t ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        }}>{t}</button>
                    ))}
                </div>

                {/* Maintenance banner */}
                <div style={{
                    padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: 12
                }}>
                    <span className="material-icons-round" style={{ color: 'var(--accent-red)', fontSize: 18 }}>warning</span>
                    <span style={{ color: 'var(--accent-red)' }}>Server Miền Bắc: Bảo trì 23:00-02:00</span>
                </div>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 100 }}>
                    {filtered.map(n => (
                        <div key={n.id} className="card" style={{
                            display: 'flex', gap: 12, padding: 14,
                            background: n.unread ? 'rgba(13,185,242,0.05)' : undefined,
                            borderColor: n.unread ? 'rgba(13,185,242,0.2)' : undefined
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                                background: `${iconColor[n.type]}15`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <span className="material-icons-round" style={{ color: iconColor[n.type], fontSize: 20 }}>{n.icon}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                    <span style={{ fontWeight: n.unread ? 700 : 500, fontSize: 14 }}>{n.title}</span>
                                    {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0, marginTop: 6 }} />}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{n.desc}</div>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>{n.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
