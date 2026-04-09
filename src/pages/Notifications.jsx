import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useUser } from '../context/UserContext'
import api from '../services/api'

const tabs = ['Tất cả', 'Chuyến đi', 'Khuyến mãi', 'Hệ thống']
const tabMap = { 'Chuyến đi': 'ride', 'Khuyến mãi': 'promo', 'Hệ thống': 'system' }

function timeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} giờ trước`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Hôm qua'
    return `${diffDays} ngày trước`
}

export default function Notifications() {
    const navigate = useNavigate()
    const { user } = useUser()
    const [tab, setTab] = useState('Tất cả')
    const [notifications, setNotifications] = useState([])
    
    useEffect(() => {
        if (!user) return
        
        const loadNotifications = async () => {
            try {
                const res = await api.getNotifications(user.id)
                if (res.success) {
                    const dynamicNotifications = res.data.map(n => ({
                        id: n.id,
                        type: n.type,
                        icon: n.icon,
                        title: n.title,
                        desc: n.description,
                        time: timeAgo(n.created_at),
                        unread: !n.is_read
                    }))
                    setNotifications(dynamicNotifications)
                }
            } catch (err) {
                console.error("Fetch notifications failed:", err)
            }
        }
        
        loadNotifications()
    }, [user])

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
