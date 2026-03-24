import { useNavigate } from 'react-router-dom'

export default function Tracking() {
    const navigate = useNavigate()

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
                    <span className="material-icons-round" style={{ fontSize: 20, color: 'white' }}>two_wheeler</span>
                </div>
                <button className="btn-icon" onClick={() => navigate('/home')} style={{ position: 'absolute', top: 48, left: 16 }}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
            </div>

            <div style={{ padding: 20, animation: 'slideUp 0.4s ease' }}>
                {/* ETA */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tài xế đang đến</div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent-blue)' }}>5 phút</div>
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
                            <div style={{ fontWeight: 700, fontSize: 16 }}>Nguyễn Văn Tài</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>59-A1 234.56 • Honda Wave</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                                <span className="material-icons-round" style={{ fontSize: 16, color: '#eab308' }}>star</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>4.8</span>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• 1,234 chuyến</span>
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
                        <span style={{ fontSize: 13 }}>123 Nguyễn Huệ, Q.1</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} />
                        <span style={{ fontSize: 13 }}>Sân bay Tân Sơn Nhất</span>
                    </div>
                    <div className="divider" />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Tổng cộng</span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-blue)' }}>15.000đ</span>
                    </div>
                </div>

                <button className="btn btn-danger" onClick={() => navigate('/rate')}>
                    <span className="material-icons-round">close</span>
                    Hủy chuyến
                </button>

                <button className="btn btn-primary" onClick={() => navigate('/rate')} style={{ marginTop: 10 }}>
                    Hoàn thành (Demo)
                </button>
            </div>
        </div>
    )
}
