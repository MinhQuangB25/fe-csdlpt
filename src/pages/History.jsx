import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../services/api'
import BottomNav from '../components/BottomNav'

export default function History() {
    const navigate = useNavigate()
    const { user, region } = useUser()
    const [filter, setFilter] = useState('all')
    const [rides, setRides] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const filtered = filter === 'all' ? rides : rides.filter(r => r.status === filter)

    useEffect(() => {
        if (!user) {
            navigate('/login')
            return
        }

        fetchHistory()
    }, [user])

    const fetchHistory = async () => {
        if (!user) return

        setLoading(true)
        setError('')

        try {
            const location = region === 'NORTH' ? 'Hanoi' : 'HCM'
            const response = await api.getTripHistory(user.id, location)

            if (response.success && response.data) {
                // Convert backend data to frontend format
                const formattedRides = response.data.map((trip, index) => ({
                    id: trip.trip_id || index,
                    type: getVehicleIcon(trip.vehicle_type),
                    from: trip.pickup_address || 'Điểm đón',
                    to: trip.dropoff_address || 'Điểm đến',
                    price: trip.amount ? `${trip.amount.toLocaleString()}đ` : 'N/A',
                    date: formatDate(trip.created_at),
                    status: trip.status === 'COMPLETED' ? 'done' : 'cancelled',
                    driver: trip.driver_name || 'Tài xế',
                    rating: trip.rating || 0
                }))

                setRides(formattedRides)
            }
        } catch (err) {
            console.error('History fetch error:', err)
            setError(err.message || 'Không thể tải lịch sử. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const getVehicleIcon = (type) => {
        const typeMap = {
            'BIKE': 'two_wheeler',
            'CAR': 'directions_car',
            'PREMIUM': 'airport_shuttle'
        }
        return typeMap[type] || 'two_wheeler'
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
    }

    return (
        <div className="page">
            <div className="page-header">
                <h2>Lịch sử chuyến đi</h2>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Error message */}
                {error && (
                    <div style={{
                        padding: '12px',
                        background: 'rgba(249, 115, 22, 0.1)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        borderRadius: '12px',
                        color: '#f97316',
                        fontSize: '13px',
                        marginBottom: '16px'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '40px',
                        color: 'var(--text-muted)'
                    }}>
                        <span className="material-icons-round" style={{ fontSize: 40, animation: 'spin 1s linear infinite' }}>
                            sync
                        </span>
                    </div>
                )}

                {/* Filters */}
                {!loading && (
                    <>
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
                        {filtered.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: 'var(--text-muted)'
                            }}>
                                <span className="material-icons-round" style={{ fontSize: 60, opacity: 0.3, marginBottom: 16 }}>
                                    trip_origin
                                </span>
                                <div>Chưa có chuyến đi nào</div>
                            </div>
                        ) : (
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
                        )}
                    </>
                )}
            </div>
            <BottomNav />
        </div>
    )
}
