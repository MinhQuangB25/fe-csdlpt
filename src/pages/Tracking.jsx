import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../services/api'

export default function Tracking() {
    const navigate = useNavigate()
    const { region } = useUser()
    const [bookingData, setBookingData] = useState(null)
    const [tripStatus, setTripStatus] = useState(null)
    const [loading, setLoading] = useState(true)
    const [canceling, setCanceling] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        // Load booking data from localStorage
        const savedBooking = localStorage.getItem('currentBooking')
        if (!savedBooking) {
            navigate('/home')
            return
        }

        const booking = JSON.parse(savedBooking)
        setBookingData(booking)
        setLoading(false)

        // Poll trip status every 5 seconds
        const pollStatus = async () => {
            try {
                const response = await api.getTripStatus(region, booking.booking.id)
                setTripStatus(response)

                // If trip is completed or cancelled, stop polling
                if (response.status === 'COMPLETED' || response.status === 'CANCELLED') {
                    clearInterval(intervalId)
                }
            } catch (err) {
                console.error('Error fetching trip status:', err)
            }
        }

        // Initial fetch
        pollStatus()

        // Set up polling interval
        const intervalId = setInterval(pollStatus, 5000)

        // Cleanup on unmount
        return () => clearInterval(intervalId)
    }, [region, navigate])

    const handleCancelTrip = async () => {
        if (!bookingData || canceling) return

        if (!window.confirm('Bạn có chắc muốn hủy chuyến đi này?')) return

        setCanceling(true)
        setError('')

        try {
            await api.updateTripStatus(region, bookingData.booking.id, 'CANCELLED')
            localStorage.removeItem('currentBooking')
            setTimeout(() => navigate('/home'), 1000)
        } catch (err) {
            console.error('Error canceling trip:', err)
            setError('Không thể hủy chuyến. Vui lòng thử lại.')
            setCanceling(false)
        }
    }

    const handleComplete = async () => {
        if (!bookingData) return

        try {
            await api.updateTripStatus(region, bookingData.booking.id, 'COMPLETED')
            localStorage.removeItem('currentBooking')
            navigate('/rate', { state: { bookingId: bookingData.booking.id } })
        } catch (err) {
            console.error('Error completing trip:', err)
            setError('Không thể hoàn thành chuyến. Vui lòng thử lại.')
        }
    }

    if (loading || !bookingData) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
                    <div style={{ color: 'var(--text-muted)' }}>Đang tải thông tin chuyến đi...</div>
                </div>
            </div>
        )
    }

    const { driver, booking } = bookingData
    const status = tripStatus?.status || booking.status || 'DRIVER_ASSIGNED'

    return (
        <div className="page">
            {/* Map */}
            <div style={{
                height: '45vh', position: 'relative',
                background: 'linear-gradient(135deg, #0a1628, #152847)', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08,
                    backgroundImage: 'linear-gradient(rgba(13,185,242,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(13,185,242,.3) 1px,transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    <path d="M 60 200 Q 140 100 200 150 T 340 100" stroke="#0db9f2" strokeWidth="3" fill="none" opacity="0.7" />
                    <circle cx="60" cy="200" r="6" fill="#22c55e" stroke="white" strokeWidth="2" />
                    <circle cx="340" cy="100" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
                </svg>
                {/* Driver car icon */}
                <div style={{
                    position: 'absolute', top: '40%', left: '45%',
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(13,185,242,0.5)', animation: 'pulse 2s infinite'
                }}>
                    <span className="material-icons-round" style={{ fontSize: 20, color: 'white' }}>
                        {booking.vehicle_type === 'CAR_4' || booking.vehicle_type === 'CAR_7' ? 'directions_car' : 'two_wheeler'}
                    </span>
                </div>
                <button className="btn-icon" onClick={() => navigate('/home')} style={{ position: 'absolute', top: 48, left: 16 }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>

                {/* Status badge */}
                <div style={{ position: 'absolute', top: 48, right: 16 }}>
                    <span style={{
                        padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                        background: status === 'COMPLETED' ? 'rgba(34,197,94,0.2)' :
                                   status === 'CANCELLED' ? 'rgba(239,68,68,0.2)' : 'rgba(13,185,242,0.2)',
                        color: status === 'COMPLETED' ? '#22c55e' :
                               status === 'CANCELLED' ? '#ef4444' : '#0db9f2'
                    }}>
                        {status === 'PENDING' && '⏳ Đang tìm tài xế'}
                        {status === 'DRIVER_ASSIGNED' && '✓ Đã có tài xế'}
                        {status === 'DRIVER_ARRIVING' && '🚗 Tài xế đang đến'}
                        {status === 'IN_PROGRESS' && '🛣️ Đang di chuyển'}
                        {status === 'COMPLETED' && '✅ Hoàn thành'}
                        {status === 'CANCELLED' && '❌ Đã hủy'}
                    </span>
                </div>
            </div>

            <div style={{ padding: 20, animation: 'slideUp 0.4s ease' }}>
                {/* ETA */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {status === 'IN_PROGRESS' ? 'Thời gian còn lại' : 'Tài xế đang đến'}
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-blue)' }}>
                        {status === 'IN_PROGRESS' ? '15 phút' : '5 phút'}
                    </div>
                </div>

                {/* Driver info */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: '50%',
                            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span className="material-icons-round" style={{ fontSize: 28, color: 'white' }}>person</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 16 }}>{driver.name}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                {driver.vehicle_plate} • {driver.vehicle_model || 'Honda Wave'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                <span className="material-icons-round" style={{ fontSize: 16, color: '#eab308' }}>star</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{driver.rating || 4.8}</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {driver.total_trips || 0} chuyến</span>
                            </div>
                        </div>
                    </div>

                    <div className="divider" />

                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                            <span className="material-icons-round" style={{ fontSize: 18 }}>phone</span>
                            Gọi điện
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                            <span className="material-icons-round" style={{ fontSize: 18 }}>chat</span>
                            Nhắn tin
                        </button>
                    </div>
                </div>

                {/* Route */}
                <div className="card" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13 }}>Điểm đón ({booking.pickup_lat?.toFixed(4)}, {booking.pickup_lng?.toFixed(4)})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13 }}>Điểm đến ({booking.dropoff_lat?.toFixed(4)}, {booking.dropoff_lng?.toFixed(4)})</span>
                    </div>
                    <div className="divider" />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Thanh toán</span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{booking.payment_method === 'CASH' ? '💵 Tiền mặt' : '💳 Ví'}</span>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div style={{
                        padding: 12, background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444', borderRadius: 8, fontSize: 13, marginBottom: 16
                    }}>
                        {error}
                    </div>
                )}

                {/* Action buttons */}
                {status !== 'COMPLETED' && status !== 'CANCELLED' && (
                    <>
                        <button className="btn btn-danger" onClick={handleCancelTrip} disabled={canceling}>
                            <span className="material-icons-round">close</span>
                            {canceling ? 'Đang hủy...' : 'Hủy chuyến'}
                        </button>

                        <button className="btn btn-primary" onClick={handleComplete} style={{ marginTop: 10 }}>
                            <span className="material-icons-round">check_circle</span>
                            Hoàn thành chuyến
                        </button>
                    </>
                )}

                {status === 'COMPLETED' && (
                    <button className="btn btn-primary" onClick={() => navigate('/rate')}>
                        <span className="material-icons-round">star</span>
                        Đánh giá chuyến đi
                    </button>
                )}

                {status === 'CANCELLED' && (
                    <button className="btn btn-outline" onClick={() => navigate('/home')}>
                        <span className="material-icons-round">home</span>
                        Về trang chủ
                    </button>
                )}
            </div>
        </div>
    )
}
