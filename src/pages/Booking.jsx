import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useUser } from '../context/UserContext'
import api from '../services/api'
import { VEHICLE_RATES, ROAD_FACTOR, SURCHARGE_RULES, roundPrice, haversineKm, REGIONS } from '../services/constants'

const pickupIcon = L.divIcon({
    className: 'custom-pickup-marker',
    html: `<div style="width: 14px; height: 14px; background: #22c55e; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(34,197,94,0.8);"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7]
})

const destIcon = L.divIcon({
    className: 'custom-dest-marker',
    html: `<div style="width: 14px; height: 14px; background: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(239,68,68,0.8);"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7]
})

function MapBoundsFitter({ bounds }) {
    const map = useMap()
    useEffect(() => {
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [40, 40] })
        }
    }, [bounds, map])
    return null
}

export default function Booking() {
    const navigate = useNavigate()
    const locationRouter = useLocation()
    const pickup = locationRouter.state?.pickup || null
    const destination = locationRouter.state?.destination || null
    const paymentMethod = locationRouter.state?.paymentMethod || { id: 'CASH', icon: '💵', name: 'Tiền mặt', color: '#22c55e' }

    const { user, region } = useUser()
    const [selected, setSelected] = useState(locationRouter.state?.vehicleType || 'BIKE')
    const [promo, setPromo] = useState('')
    const [showPromoModal, setShowPromoModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Coupons
    const coupons = [
        { code: 'GOIXE20', desc: 'Giảm 20% cho chuyến đi', condition: 'Đơn tối thiểu 50K', discount: '-20%', expires: '15/03/2026', active: true },
        { code: 'NEWUSER', desc: 'Giảm 30K cho người mới', condition: 'Chuyến đầu tiên', discount: '-30K', expires: '31/03/2026', active: true },
        { code: 'FREESHIP', desc: 'Miễn phí cước xe máy', condition: 'Khoảng cách < 5km', discount: 'Miễn phí', expires: '20/03/2026', active: true },
        { code: 'HOLIDAY50', desc: 'Giảm 50% dịp lễ', condition: 'Tối đa 50K', discount: '-50%', expires: '01/03/2026', active: false },
    ]

    // Compute distance
    const distanceKm = useMemo(() => {
        if (pickup?.lat && destination?.lat) {
            return haversineKm(pickup.lat, pickup.lng, destination.lat, destination.lng) * ROAD_FACTOR
        }
        return 0
    }, [pickup, destination])

    // Compute prices for all vehicles based on distance
    const vehicles = useMemo(() => {
        return Object.values(VEHICLE_RATES).map(v => {
            const fare = distanceKm > 0
                ? roundPrice(v.base + v.per_km * distanceKm)
                : roundPrice(v.base + v.per_km * 3) // default ~3km if no coords
            return { ...v, price: fare }
        })
    }, [distanceKm])

    const vehicle = vehicles.find(v => v.id === selected)
    
    // Simple promo evaluation
    let discount = 0
    if (promo === 'GOIXE20') discount = Math.round(vehicle.price * 0.2)
    else if (promo === 'NEWUSER') discount = Math.min(30000, vehicle.price)
    else if (promo === 'FREESHIP' && selected === 'BIKE') discount = vehicle.price
    else if (promo === 'HOLIDAY50') discount = Math.min(50000, Math.round(vehicle.price * 0.5))

    const surcharge = distanceKm > SURCHARGE_RULES.LONG_DISTANCE_THRESHOLD 
        ? SURCHARGE_RULES.LONG_DISTANCE_FEE 
        : SURCHARGE_RULES.SHORT_DISTANCE_FEE
    const total = vehicle.price + surcharge - discount
    
    const estimateMinutes = (dist, type) => {
        const avgSpeed = type === 'BIKE' ? 30 : 25
        return Math.max(3, Math.round((dist / avgSpeed) * 60))
    }
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
            const regionConfig = REGIONS[region]

            if (!pickup?.lat || !destination?.lat) {
                setError('Vui lòng chọn điểm đón và điểm đến trên bản đồ')
                setLoading(false)
                return
            }

            const pickupCoords = { lat: pickup.lat, lng: pickup.lng }
            const dropoffCoords = { lat: destination.lat, lng: destination.lng }

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
                dropoff_address: destName,
                fare_amount: total
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
                overflow: 'hidden', zIndex: 1
            }}>
                <MapContainer 
                    center={pickup && pickup.lat ? [pickup.lat, pickup.lng] : (REGIONS[region]?.center || [10.762622, 106.660172])} 
                    zoom={14} 
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; CARTO'
                    />
                    
                    {pickup && pickup.lat && <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />}
                    {destination && destination.lat && <Marker position={[destination.lat, destination.lng]} icon={destIcon} />}
                    
                    {pickup && pickup.lat && destination && destination.lat && (
                        <>
                            <Polyline 
                                positions={[[pickup.lat, pickup.lng], [destination.lat, destination.lng]]} 
                                pathOptions={{ color: '#0db9f2', weight: 4, dashArray: '10, 10' }} 
                            />
                            <MapBoundsFitter bounds={[[pickup.lat, pickup.lng], [destination.lat, destination.lng]]} />
                        </>
                    )}
                </MapContainer>

                <button className="btn-icon" onClick={() => navigate(-1)} style={{ position: 'absolute', top: 48, left: 16, zIndex: 400, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
            </div>

            <div style={{ padding: '20px', animation: 'slideUp 0.4s ease' }}>
                {/* Route info — clickable to go back to search */}
                <div className="card" style={{ marginBottom: 16, cursor: 'pointer' }} onClick={() => navigate('/search', { state: { vehicleType: selected } })}>
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
                <div 
                    className="card" 
                    style={{ marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}
                    onClick={() => setShowPromoModal(true)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="material-icons-round" style={{ color: promo ? 'var(--accent-green)' : '#f97316' }}>
                            {promo ? 'check_circle' : 'local_offer'}
                        </span>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: promo ? 'var(--accent-green)' : 'white' }}>
                                {promo || 'Chọn mã khuyến mãi'}
                            </div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                                {promo ? 'Đã áp dụng mã ưu đãi' : 'Bấm để chọn mã giảm giá'}
                            </div>
                        </div>
                    </div>
                    <span className="material-icons-round" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
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
                            <span style={{ color: 'var(--accent-green)' }}>Giảm giá ({promo})</span>
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
            {/* Promo Modal */}
            {showPromoModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                    animation: 'fadeIn 0.2s ease'
                }} onClick={() => setShowPromoModal(false)}>
                    
                    <div style={{
                        background: 'var(--bg-body)',
                        borderTopLeftRadius: 24, borderTopRightRadius: 24,
                        padding: '24px 20px',
                        animation: 'slideUp 0.3s ease',
                        maxHeight: '80vh', overflowY: 'auto'
                    }} onClick={e => e.stopPropagation()}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 18 }}>Chọn Khuyến Mãi</h3>
                            <button className="btn-icon" onClick={() => setShowPromoModal(false)}>
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {coupons.map(c => (
                                <div key={c.code} className="card" 
                                    onClick={() => {
                                        if (c.active) {
                                            setPromo(c.code)
                                            setShowPromoModal(false)
                                        }
                                    }}
                                    style={{
                                        opacity: c.active ? 1 : 0.5,
                                        cursor: c.active ? 'pointer' : 'not-allowed',
                                        position: 'relative', overflow: 'hidden',
                                        border: promo === c.code ? '2px solid var(--accent-blue)' : '2px solid transparent'
                                    }}>
                                    
                                    {!c.active && (
                                        <div style={{
                                            position: 'absolute', top: 12, right: -24,
                                            background: 'var(--accent-red)', color: 'white',
                                            padding: '2px 30px', fontSize: 10, fontWeight: 700,
                                            transform: 'rotate(35deg)'
                                        }}>HẾT HẠN</div>
                                    )}
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{
                                            padding: '4px 12px', borderRadius: 6,
                                            background: c.active ? 'rgba(13,185,242,0.15)' : 'rgba(107,107,138,0.15)',
                                            fontWeight: 700, fontSize: 14, letterSpacing: 1,
                                            color: c.active ? 'var(--accent-blue)' : 'var(--text-muted)',
                                        }}>{c.code}</div>
                                        <span style={{
                                            fontSize: 18, fontWeight: 800, color: c.active ? 'var(--accent-green)' : 'var(--text-muted)'
                                        }}>{c.discount}</span>
                                    </div>
                                    
                                    <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{c.desc}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.condition}</div>
                                </div>
                            ))}
                            
                            {promo && (
                                <button className="btn btn-danger" style={{ marginTop: 10 }} onClick={() => { setPromo(''); setShowPromoModal(false); }}>
                                    Bỏ chọn khuyến mãi
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
