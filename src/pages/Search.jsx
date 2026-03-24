import { useNavigate } from 'react-router-dom'

const saved = [
    { icon: 'home', label: 'Nhà', addr: '123 Nguyễn Huệ, Q.1, TP.HCM' },
    { icon: 'business', label: 'Công ty', addr: '456 Lê Lợi, Q.3, TP.HCM' },
]
const recent = [
    { addr: 'Sân bay Tân Sơn Nhất', detail: 'Trường Sơn, Tân Bình', time: '2 ngày trước' },
    { addr: 'Bệnh viện Chợ Rẫy', detail: '201B Nguyễn Chí Thanh, Q.5', time: '3 ngày trước' },
    { addr: 'Đại học Bách Khoa', detail: '268 Lý Thường Kiệt, Q.10', time: '1 tuần trước' },
]
const hot = [
    { icon: 'local_mall', name: 'Vincom Center', addr: '72 Lê Thánh Tôn, Q.1' },
    { icon: 'local_cafe', name: 'Highlands Coffee', addr: '26 Lý Tự Trọng, Q.1' },
]

export default function Search() {
    const navigate = useNavigate()

    return (
        <div className="page" style={{ padding: '48px 20px 40px' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
                <span className="material-icons-round">arrow_back</span>
            </button>

            {/* Pickup & Destination */}
            <div style={{
                display: 'flex', gap: 12, marginBottom: 24,
                background: 'var(--bg-card)', borderRadius: 16, padding: 16,
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, paddingTop: 14 }}>
                    <div style={{ width: 12, height: 12, background: '#22c55e', borderRadius: '50%', border: '2px solid #166534' }} />
                    <div style={{ width: 2, height: 28, background: 'var(--border-color)', borderRadius: 1, borderLeft: '2px dashed var(--text-muted)' }} />
                    <div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%', border: '2px solid #991b1b' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <div className="input-group" style={{ marginBottom: 8 }}>
                        <input className="input-field" placeholder="Vị trí hiện tại" defaultValue="📍 Vị trí của bạn" style={{ fontSize: 14 }} />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <input className="input-field" placeholder="Bạn muốn đi đâu?" autoFocus style={{ fontSize: 14, borderColor: 'var(--accent-blue)' }} />
                    </div>
                </div>
            </div>

            {/* Saved */}
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>📌 Địa chỉ đã lưu</h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                {saved.map(s => (
                    <button key={s.label} onClick={() => navigate('/booking')} className="card" style={{
                        flex: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: 14
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(13,185,242,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span className="material-icons-round" style={{ color: 'var(--accent-blue)', fontSize: 20 }}>{s.icon}</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{s.label}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.addr}</div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Recent */}
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>🕒 Gần đây</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                {recent.map(r => (
                    <button key={r.addr} onClick={() => navigate('/booking')} className="card" style={{
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 14
                    }}>
                        <span className="material-icons-round" style={{ color: 'var(--text-muted)' }}>history</span>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 500, fontSize: 14 }}>{r.addr}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.detail}</div>
                        </div>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.time}</span>
                    </button>
                ))}
            </div>

            {/* Hot */}
            <h3 style={{ marginBottom: 12, fontSize: 15 }}>🔥 Địa điểm phổ biến</h3>
            {hot.map(h => (
                <button key={h.name} onClick={() => navigate('/booking')} className="card" style={{
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 14, marginBottom: 8, width: '100%'
                }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'rgba(249,115,22,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span className="material-icons-round" style={{ color: 'var(--accent-orange)', fontSize: 20 }}>{h.icon}</span>
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{h.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{h.addr}</div>
                    </div>
                </button>
            ))}

            <button className="btn btn-outline" onClick={() => navigate('/booking')} style={{ marginTop: 16 }}>
                <span className="material-icons-round">map</span>
                Chọn trên bản đồ
            </button>
        </div>
    )
}
