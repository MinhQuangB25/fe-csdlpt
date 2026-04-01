import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../services/api'

const vehicles = [
    { id: 'BIKE', icon: 'two_wheeler', name: 'Xe máy', price: 15000, wait: '3 phút', color: '#0db9f2' },
    { id: 'CAR_4_SEAT', icon: 'directions_car', name: 'Ô tô 4 chỗ', price: 45000, wait: '5 phút', color: '#10b981' },
    { id: 'CAR_7_SEAT', icon: 'airport_shuttle', name: 'Ô tô 7 chỗ', price: 75000, wait: '8 phút', color: '#f97316' },
]

export default function Booking() {
    const navigate = useNavigate()
    const { user, region } = useUser()
    const [selected, setSelected] = useState('BIKE')
    const [promo, setPromo] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const vehicle = vehicles.find(v => v.id === selected)
    const discount = promo === 'GOIXE20' ? Math.round(vehicle.price * 0.2) : 0
    const surcharge = 5000
    const total = vehicle.price + surcharge - discount

    const handleBooking = async () => {
        if (!user) {
            setError('Vui lòng đăng nhập trước')
            setTimeout(() => navigate('/login'), 2000)
            return
        }

        setLoading(true)
        setError('')

        try {
            // Mock coordinates for demo (you can replace these with real location selection)
            const location = region === 'NORTH' ? 'Hanoi' : 'HCM'
            const pickupCoords = region === 'NORTH'
                ? { lat: 21.0285, lng: 105.8542 }  // Hanoi
                : { lat: 10.7769, lng: 106.7009 }  // HCM

            const dropoffCoords = region === 'NORTH'
                ? { lat: 21.0368, lng: 105.8345 }
                : { lat: 10.7800, lng: 106.6800 }

            const bookingPayload = {
                user_id: user.id,
                location: location,
                pickup_lat: pickupCoords.lat,
                pickup_lng: pickupCoords.lng,
                dropoff_lat: dropoffCoords.lat,
                dropoff_lng: dropoffCoords.lng,
                vehicle_type: selected,
                payment_method: 'CASH'
            }

            const response = await api.bookTrip(bookingPayload)

            if (response.success) {
                // Store booking data for next page
                localStorage.setItem('currentBooking', JSON.stringify(response.data))
                navigate('/searching')
            }
        } catch (err) {
            console.error('Booking error:', err)
            setError(err.message || 'Đặt xe thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            {/* Map route */}
            <div style={{
                height: '35vh', position: 'relative',
                background: 'linear-gradient(135deg, #0a1628, #152847)',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    backgroundImage: 'linear-gradient(rgba(13,185,242,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(13,185,242,.3) 1px,transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
                {/* Route line */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <path d="M 80 130 Q 160 60 220 100 T 330 80" stroke="#0db9f2" strokeWidth="3" fill="none" strokeDasharray="8,6" opacity="0.8" />
                    <circle cx="80" cy="130" r="8" fill="#22c55e" stroke="white" strokeWidth="2" />
                    <circle cx="330" cy="80" r="8" fill="#ef4444" stroke="white" strokeWidth="2" />
                </svg>
                <button className="btn-icon" onClick={() => navigate(-1)} style={{ position: 'absolute', top: 48, left: 16 }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
            </div>

            <div style={{ padding: '20px', animation: 'slideUp 0.4s ease' }}>
                {/* Route info */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13 }}>123 Nguyễn Huệ, Q.1</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13 }}>Sân bay Tân Sơn Nhất</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>📏 12.5 km • ⏱️ ~25 phút</div>
                </div>

                {/* Vehicle select */}
                <h3 style={{ marginBottom: 10, fontSize: 15 }}>Chọn loại xe</h3>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                    {vehicles.map(v => (
                        <button key={v.id} onClick={() => setSelected(v.id)} style={{
                            flex: 1, padding: '14px 8px', textAlign: 'center', cursor: 'pointer',
                            background: selected === v.id ? `${v.color}15` : 'var(--bg-card)',
                            border: `2px solid ${selected === v.id ? v.color : 'var(--border-color)'}`,
                            borderRadius: 14, transition: 'all 0.2s', fontFamily: 'inherit', color: 'white'
                        }}>
                            <span className="material-icons-round" style={{ color: v.color, fontSize: 28 }}>{v.icon}</span>
                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{v.name}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: v.color, marginTop: 2 }}>{v.price.toLocaleString()}đ</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>~{v.wait}</div>
                        </button>
                    ))}
                </div>

                {/* Promo */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <input className="input-field" placeholder="Nhập mã khuyến mãi" value={promo} onChange={e => setPromo(e.target.value.toUpperCase())} style={{ flex: 1 }} />
                    <button className="btn btn-primary btn-sm" style={{ width: 'auto', padding: '10px 20px' }}>
                        Áp dụng
                    </button>
                </div>

                {/* Price detail */}
                {error && (
                    <div style={{
                        padding: '12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        color: '#ef4444',
                        fontSize: '13px',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                <div className="card" style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Cước phí</span>
                        <span>{vehicle.price.toLocaleString()}đ</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Phụ phí</span>
                        <span>{surcharge.toLocaleString()}đ</span>
                    </div>
                    {discount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                            <span style={{ color: 'var(--accent-green)' }}>Giảm giá (GOIXE20)</span>
                            <span style={{ color: 'var(--accent-green)' }}>-{discount.toLocaleString()}đ</span>
                        </div>
                    )}
                    <div className="divider" />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
                        <span>Tổng cộng</span>
                        <span style={{ color: 'var(--accent-blue)' }}>{total.toLocaleString()}đ</span>
                    </div>
                </div>

                {/* Payment method */}
                <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/payment')}>
                    <span className="material-icons-round" style={{ color: 'var(--accent-green)' }}>payments</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Thanh toán bằng</div>
                        <div style={{ fontWeight: 600 }}>💵 Tiền mặt</div>
                    </div>
                    <span className="material-icons-round" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleBooking}
                    disabled={loading}
                    style={{ fontSize: 17 }}
                >
                    <span className="material-icons-round">
                        {loading ? 'hourglass_empty' : 'local_taxi'}
                    </span>
                    {loading ? 'Đang đặt xe...' : `Đặt xe — ${total.toLocaleString()}đ`}
                </button>
            </div>
        </div>
    )
}
