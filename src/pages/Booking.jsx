import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../services/api'

// Base rates per km for each vehicle type
const vehicleRates = [
    { id: 'BIKE', icon: 'two_wheeler', name: 'Xe máy', ratePerKm: 5000, baseFare: 5000, wait: '3 phút', color: '#0db9f2' },
    { id: 'CAR', icon: 'directions_car', name: 'Ô tô 4 chỗ', ratePerKm: 10000, baseFare: 10000, wait: '5 phút', color: '#10b981' },
    { id: 'PREMIUM', icon: 'airport_shuttle', name: 'Ô tô 7 chỗ', ratePerKm: 14000, baseFare: 15000, wait: '8 phút', color: '#f97316' },
]

// Haversine formula — returns distance in km
function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371
    const toRad = (v) => (v * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// Estimate duration in minutes based on average speed
function estimateMinutes(distKm, vehicleId) {
    const avgSpeeds = { BIKE: 25, CAR: 30, PREMIUM: 28 } // km/h
    const speed = avgSpeeds[vehicleId] || 28
    return Math.round((distKm / speed) * 60)
}

// Round price to nearest 1000đ
function roundPrice(p) {
    return Math.round(p / 1000) * 1000
}

export default function Booking() {
    const navigate = useNavigate()
    const locationRouter = useLocation()
    const pickup = locationRouter.state?.pickup || null
    const destination = locationRouter.state?.destination || null
    const paymentMethod = locationRouter.state?.paymentMethod || { id: 'CASH', icon: '💵', name: 'Tiền mặt', color: '#22c55e' }

    const { user, region } = useUser()
    const [selected, setSelected] = useState('BIKE')
    const [promo, setPromo] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Compute distance
    const distanceKm = useMemo(() => {
        if (pickup?.lat && destination?.lat) {
            // Multiply by 1.3 to get road estimate (straight-line → road factor)
            return haversineKm(pickup.lat, pickup.lng, destination.lat, destination.lng) * 1.3
        }
        return 0
    }, [pickup, destination])

    // Compute prices for all vehicles based on distance
    const vehicles = useMemo(() => {
        return vehicleRates.map(v => {
            const fare = distanceKm > 0
                ? roundPrice(v.baseFare + v.ratePerKm * distanceKm)
                : roundPrice(v.baseFare + v.ratePerKm * 3) // default ~3km if no coords
            return { ...v, price: fare }
        })
    }, [distanceKm])

    const vehicle = vehicles.find(v => v.id === selected)
    const discount = promo === 'GOIXE20' ? Math.round(vehicle.price * 0.2) : 0
    const surcharge = distanceKm > 10 ? 10000 : 5000
    const total = vehicle.price + surcharge - discount
    const estMinutes = distanceKm > 0 ? estimateMinutes(distanceKm, selected) : null

    // Pickup info for display
    const pickupName = pickup?.name || (region === 'NORTH' ? 'Hoàn Kiếm, Hà Nội' : '123 Nguyễn Huệ, Quận 1')
    const destName = destination?.name || 'Chưa chọn điểm đến'

    const handleBooking = async () => {
        if (!user) {
            setError('Vui lòng đăng nhập trước')
            setTimeout(() => navigate('/login'), 2000)
            return
        }

        setLoading(true)
        setError('')

        try {
            const location = region === 'NORTH' ? 'Hanoi' : 'HCM'

            const pickupCoords = pickup?.lat
                ? { lat: pickup.lat, lng: pickup.lng }
                : (region === 'NORTH'
                    ? { lat: 21.0285, lng: 105.8542 }
                    : { lat: 10.7769, lng: 106.7009 })

            const dropoffCoords = destination?.lat
                ? { lat: destination.lat, lng: destination.lng }
                : (region === 'NORTH'
                    ? { lat: 21.0368, lng: 105.8345 }
                    : { lat: 10.7800, lng: 106.6800 })

            const bookingPayload = {
                user_id: user.id,
                location: location,
                pickup_lat: pickupCoords.lat,
                pickup_lng: pickupCoords.lng,
                dropoff_lat: dropoffCoords.lat,
                dropoff_lng: dropoffCoords.lng,
                vehicle_type: selected,
                payment_method: paymentMethod.id,
                pickup_address: pickupName,
                dropoff_address: destName
            }

            const response = await api.bookTrip(bookingPayload)

            if (response.success) {
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
                {/* Route info — clickable to go back to search */}
                <div className="card" style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => navigate('/search')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 10, height: 10, background: '#22c55e', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pickupName}</span>
                        <span className="material-icons-round" style={{ color: 'var(--text-muted)', fontSize: 16 }}>edit</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 10, height: 10, background: '#ef4444', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{destName}</span>
                    </div>
                    {distanceKm > 0 && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                            📏 {distanceKm.toFixed(1)} km
                            {estMinutes && <> • ⏱️ ~{estMinutes} phút</>}
                        </div>
                    )}
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
                        <span style={{ color: 'var(--text-secondary)' }}>Cước phí ({distanceKm > 0 ? `${distanceKm.toFixed(1)} km` : '~3 km'})</span>
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
                <div className="card" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/payment', { state: locationRouter.state })}>
                    <span style={{ fontSize: 24 }}>{paymentMethod.icon}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Thanh toán bằng</div>
                        <div style={{ fontWeight: 600, color: paymentMethod.color }}>{paymentMethod.name}</div>
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
