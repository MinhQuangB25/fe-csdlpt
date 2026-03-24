import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const rides = [
    { id: 1, type: 'two_wheeler', from: '123 Nguyễn Huệ', to: 'Sân bay TSN', price: '15.000đ', date: '07/03/2026', status: 'done', driver: 'Văn Tài', rating: 5 },
    { id: 2, type: 'directions_car', from: 'Đại học Bách Khoa', to: 'Vincom Center', price: '45.000đ', date: '06/03/2026', status: 'done', driver: 'Minh Đức', rating: 4 },
    { id: 3, type: 'two_wheeler', from: 'BV Chợ Rẫy', to: '456 Lê Lợi, Q.3', price: '18.000đ', date: '05/03/2026', status: 'cancelled', driver: 'Thanh Hùng', rating: 0 },
    { id: 4, type: 'airport_shuttle', from: 'Sân bay TSN', to: 'Q.7, Phú Mỹ Hưng', price: '95.000đ', date: '04/03/2026', status: 'done', driver: 'Hoàng Nam', rating: 5 },
    { id: 5, type: 'directions_car', from: 'Landmark 81', to: 'AEON Mall Bình Tân', price: '52.000đ', date: '02/03/2026', status: 'done', driver: 'Quốc Bảo', rating: 4 },
]

export default function History() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState('all')
    const filtered = filter === 'all' ? rides : rides.filter(r => r.status === filter)

    return (
        <div className="page">
            <div className="page-header">
                <h2>Lịch sử chuyến đi</h2>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Filters */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {[['all', 'Tất cả'], ['done', 'Hoàn thành'], ['cancelled', 'Đã hủy']].map(([val, label]) => (
                        <button key={val} onClick={() => setFilter(val)} style={{
                            padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', border: 'none', fontFamily: 'inherit', transition: 'all 0.2s',
                            background: filter === val ? 'rgba(13,185,242,0.2)' : 'var(--bg-card)',
                            color: filter === val ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Rides */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 100 }}>
                    {filtered.map(r => (
                        <div key={r.id} className="card" style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: r.status === 'cancelled' ? 'rgba(239,68,68,0.1)' : 'rgba(13,185,242,0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <span className="material-icons-round" style={{ color: r.status === 'cancelled' ? 'var(--accent-red)' : 'var(--accent-blue)' }}>{r.type}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 600, fontSize: 14 }}>{r.from}</span>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: r.status === 'cancelled' ? 'var(--text-muted)' : 'var(--accent-blue)' }}>{r.price}</span>
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>→ {r.to}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.driver} • {r.date}</span>
                                        {r.status === 'done' ? (
                                            <span className="badge badge-green" style={{ fontSize: 10 }}>Hoàn thành</span>
                                        ) : (
                                            <span className="badge badge-red" style={{ fontSize: 10 }}>Đã hủy</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BottomNav />
        </div>
    )
}
