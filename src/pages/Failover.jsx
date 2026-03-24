import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const servers = [
    { id: 'south', name: 'Server Miền Nam', location: 'TP.HCM', role: 'Master', status: 'online', latency: '12ms', sync: 100, load: 45 },
    { id: 'north', name: 'Server Miền Bắc', location: 'Hà Nội', role: 'Slave', status: 'online', latency: '35ms', sync: 98.5, load: 32 },
]

export default function Failover() {
    const navigate = useNavigate()
    const [active, setActive] = useState('south')

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-icon" onClick={() => navigate(-1)}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2>Trạng thái Server</h2>
            </div>

            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    {servers.map(s => (
                        <div key={s.id} className={`card ${active === s.id ? 'card-glow' : ''}`} style={{
                            flex: 1, cursor: 'pointer', padding: 16
                        }} onClick={() => setActive(s.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span className={`status-dot ${s.status}`} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: s.status === 'online' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                    {s.status === 'online' ? 'Hoạt động' : 'Offline'}
                                </span>
                            </div>
                            <h3 style={{ fontSize: 14, marginBottom: 4 }}>{s.name}</h3>
                            <p style={{ fontSize: 12 }}>{s.location}</p>
                            <div className={`badge ${s.role === 'Master' ? 'badge-blue' : 'badge-orange'}`} style={{ marginTop: 8, fontSize: 11 }}>
                                {s.role}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Details */}
                {servers.map(s => (
                    <div key={s.id} className="card" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontWeight: 600 }}>{s.name}</span>
                            <span className={`badge ${s.role === 'Master' ? 'badge-blue' : 'badge-orange'}`} style={{ fontSize: 11 }}>{s.role}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Latency</span>
                            <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{s.latency}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Sync</span>
                            <span style={{ fontWeight: 600 }}>{s.sync}%</span>
                        </div>

                        {/* Load bar */}
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>CPU Load: {s.load}%</div>
                        <div style={{ height: 6, background: 'var(--bg-input)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', width: `${s.load}%`, borderRadius: 3,
                                background: s.load < 50 ? 'var(--accent-green)' : s.load < 80 ? 'var(--accent-orange)' : 'var(--accent-red)',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                ))}

                {/* Diagram */}
                <div className="card" style={{ textAlign: 'center', padding: 24 }}>
                    <h3 style={{ fontSize: 14, marginBottom: 16 }}>Kiến trúc Master-Slave</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                        <div style={{
                            padding: '12px 20px', borderRadius: 12,
                            background: 'rgba(13,185,242,0.15)', border: '1px solid var(--accent-blue)'
                        }}>
                            <span className="material-icons-round" style={{ color: 'var(--accent-blue)' }}>dns</span>
                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Master</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>TP.HCM</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className="material-icons-round" style={{ color: 'var(--accent-green)', fontSize: 20 }}>sync</span>
                            <div style={{ fontSize: 10, color: 'var(--accent-green)' }}>98.5%</div>
                        </div>
                        <div style={{
                            padding: '12px 20px', borderRadius: 12,
                            background: 'rgba(249,115,22,0.15)', border: '1px solid var(--accent-orange)'
                        }}>
                            <span className="material-icons-round" style={{ color: 'var(--accent-orange)' }}>dns</span>
                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>Slave</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hà Nội</div>
                        </div>
                    </div>
                </div>

                <button className="btn btn-outline" style={{ marginTop: 16 }}>
                    <span className="material-icons-round">swap_horiz</span>
                    Chuyển server thủ công
                </button>
            </div>
        </div>
    )
}
