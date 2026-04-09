import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Searching() {
    const navigate = useNavigate()
    const [seconds, setSeconds] = useState(0)
    const [bookingData, setBookingData] = useState(null)

    useEffect(() => {
        const stored = localStorage.getItem('currentBooking')
        if (stored) {
            setBookingData(JSON.parse(stored))
        }
        const interval = setInterval(() => setSeconds(s => s + 1), 1000)
        const timeout = setTimeout(() => navigate('/tracking'), 5000)
        return () => { clearInterval(interval); clearTimeout(timeout) }
    }, [navigate])

    const pickupAddress = bookingData?.booking?.pickup_address || 'Đang lấy vị trí...'
    const dropoffAddress = bookingData?.booking?.dropoff_address || 'Đang chờ...'
    const vehicleType = bookingData?.booking?.vehicle_type === 'CAR' ? 'Ô tô 4 chỗ' : 
                        bookingData?.booking?.vehicle_type === 'PREMIUM' ? 'Xe cao cấp' : 'Xe máy'
    const fareAmount = bookingData?.booking?.fare_amount ? 
                       Number(bookingData.booking.fare_amount).toLocaleString('vi-VN') + 'đ' : '...'

    return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24, textAlign: 'center' }}>
            {/* Radar */}
            <div style={{ position: 'relative', width: 200, height: 200, marginBottom: 40 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 60, height: 60, borderRadius: '50%',
                        border: '2px solid rgba(13,185,242,0.4)',
                        animation: `radar 2s ${i * 0.6}s infinite`
                    }} />
                ))}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(13,185,242,0.5)',
                    animation: 'pulse 2s infinite'
                }}>
                    <span className="material-icons-round" style={{ fontSize: 28, color: 'white' }}>local_taxi</span>
                </div>
            </div>

            <h2 style={{ marginBottom: 8 }}>Đang tìm tài xế...</h2>
            <p style={{ marginBottom: 4 }}>Thời gian chờ ước lượng: <strong style={{ color: 'var(--accent-blue)' }}>2-5 phút</strong></p>
            <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--accent-blue)', margin: '16px 0' }}>
                {Math.floor(seconds / 60).toString().padStart(2, '0')}:{(seconds % 60).toString().padStart(2, '0')}
            </p>

            {/* Trip info */}
            <div className="card" style={{ width: '100%', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%' }} />
                    <span style={{ fontSize: 13 }}>{pickupAddress}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
                    <span style={{ fontSize: 13 }}>{dropoffAddress}</span>
                </div>
                <div className="divider" style={{ margin: '10px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{vehicleType}</span>
                    <span style={{ fontWeight: 600 }}>{fareAmount}</span>
                </div>
            </div>

            {/* 3 dots loading */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-blue)',
                        animation: `pulse 1.4s ${i * 0.2}s infinite`
                    }} />
                ))}
            </div>

            <button className="btn btn-danger" onClick={() => navigate('/home')}>
                <span className="material-icons-round">close</span>
                Hủy tìm kiếm
            </button>
        </div>
    )
}
