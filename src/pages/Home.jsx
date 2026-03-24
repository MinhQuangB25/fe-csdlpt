import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

const vehicles = [
    { icon: 'two_wheeler', name: 'Xe máy', price: '15.000đ', time: '3 phút', color: '#0db9f2' },
    { icon: 'directions_car', name: 'Ô tô 4 chỗ', price: '32.000đ', time: '5 phút', color: '#10b981' },
    { icon: 'airport_shuttle', name: 'Ô tô 7 chỗ', price: '45.000đ', time: '8 phút', color: '#f97316' },
]

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="page">
            {/* Map Area */}
            <div style={{
                height: '55vh', position: 'relative',
                background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 30%, #152847 60%, #0a1628 100%)',
                overflow: 'hidden'
            }}>
                {/* Grid pattern */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.1,
                    backgroundImage: 'linear-gradient(rgba(13,185,242,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(13,185,242,0.3) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} />
                {/* Roads */}
                <div style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: 2, background: 'rgba(13,185,242,0.2)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '40%', width: 2, background: 'rgba(13,185,242,0.2)' }} />
                <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 2, background: 'rgba(13,185,242,0.15)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '70%', width: 2, background: 'rgba(13,185,242,0.15)' }} />

                {/* User location */}
                <div style={{
                    position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%, -50%)'
                }}>
                    <div style={{
                        width: 18, height: 18, background: '#0db9f2', borderRadius: '50%',
                        border: '3px solid white', boxShadow: '0 0 20px rgba(13,185,242,0.6)',
                        animation: 'pulse 2s infinite'
                    }} />
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: 60, height: 60, borderRadius: '50%',
                        background: 'rgba(13,185,242,0.15)',
                        animation: 'radar 2s infinite'
                    }} />
                </div>

                {/* GPS button */}
                <button style={{
                    position: 'absolute', bottom: 16, right: 16,
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(26,26,46,0.9)', border: '1px solid var(--border-color)',
                    color: 'var(--accent-blue)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(10px)'
                }}>
                    <span className="material-icons-round">my_location</span>
                </button>

                {/* Region badge */}
                <div style={{
                    position: 'absolute', top: 48, left: 20,
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <div className="badge badge-green">
                        <span className="status-dot online" style={{ width: 6, height: 6 }} />
                        Miền Nam
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <div style={{ padding: '0 20px', marginTop: -28, position: 'relative', zIndex: 2 }}>
                <button
                    onClick={() => navigate('/search')}
                    style={{
                        width: '100%', padding: '16px 20px',
                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                        borderRadius: 16, color: 'var(--text-muted)', fontSize: 15,
                        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                        boxShadow: 'var(--shadow-card)', fontFamily: 'inherit',
                        textAlign: 'left'
                    }}
                >
                    <span className="material-icons-round" style={{ color: 'var(--accent-blue)' }}>search</span>
                    Bạn muốn đi đâu?
                </button>
            </div>

            {/* Vehicle types */}
            <div style={{ padding: '20px 20px 100px' }}>
                <h3 style={{ marginBottom: 12 }}>Chọn loại xe</h3>
                <div style={{ display: 'flex', gap: 12 }}>
                    {vehicles.map(v => (
                        <button
                            key={v.name}
                            onClick={() => navigate('/search')}
                            className="card"
                            style={{
                                flex: 1, textAlign: 'center', cursor: 'pointer',
                                padding: '16px 8px', border: '1px solid var(--border-color)',
                            }}
                        >
                            <div style={{
                                width: 48, height: 48, margin: '0 auto 8px',
                                background: `${v.color}20`, borderRadius: 14,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <span className="material-icons-round" style={{ color: v.color, fontSize: 26 }}>{v.icon}</span>
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{v.name}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: v.color }}>{v.price}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>~{v.time}</div>
                        </button>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    )
}
