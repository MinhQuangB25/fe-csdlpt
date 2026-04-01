import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Failover() {
    const navigate = useNavigate()
    const [healthData, setHealthData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [active, setActive] = useState('SOUTH')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchHealth = async () => {
        try {
            const response = await api.health()
            setHealthData(response)
            setLoading(false)
        } catch (err) {
            console.error('Error fetching health:', err)
            setError('Không thể kết nối đến server')
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHealth()
        // Refresh every 10 seconds
        const interval = setInterval(fetchHealth, 10000)
        return () => clearInterval(interval)
    }, [])

    const handleToggleNode = async (region, nodeRole, currentHealth) => {
        setUpdating(true)
        setError('')
        setSuccess('')

        const newHealth = currentHealth === 'UP' ? 'DOWN' : 'UP'

        try {
            await api.updateNodeState(region, nodeRole, newHealth)
            setSuccess(`Đã ${newHealth === 'UP' ? 'bật' : 'tắt'} ${nodeRole} của ${region}`)
            await fetchHealth()
        } catch (err) {
            console.error('Error updating node:', err)
            setError('Không thể cập nhật trạng thái node')
        } finally {
            setUpdating(false)
        }
    }

    const handleToggleMode = async (region, currentMode) => {
        setUpdating(true)
        setError('')
        setSuccess('')

        const newMode = currentMode === 'NORMAL' ? 'READ_ONLY' : 'NORMAL'

        try {
            await api.updateMode(region, newMode)
            setSuccess(`Đã chuyển ${region} sang chế độ ${newMode}`)
            await fetchHealth()
        } catch (err) {
            console.error('Error updating mode:', err)
            setError('Không thể chuyển chế độ')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 24, marginBottom: 16 }}>⏳</div>
                    <div style={{ color: 'var(--text-muted)' }}>Đang tải trạng thái server...</div>
                </div>
            </div>
        )
    }

    const clusters = healthData?.clusters || {}
    const serverList = [
        { id: 'NORTH', name: 'Server Miền Bắc', location: 'Hà Nội', data: clusters.NORTH },
        { id: 'SOUTH', name: 'Server Miền Nam', location: 'TP.HCM', data: clusters.SOUTH },
    ]

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-icon" onClick={() => navigate(-1)}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2>Trạng thái Server</h2>
                <button className="btn-icon" onClick={fetchHealth} style={{ marginLeft: 'auto' }}>
                    <span className="material-icons-round">refresh</span>
                </button>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Service status */}
                <div className="card" style={{ marginBottom: 16, padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{
                            width: 12, height: 12, borderRadius: '50%',
                            background: healthData?.status === 'UP' ? '#22c55e' : '#ef4444'
                        }} />
                        <span style={{ fontWeight: 600 }}>{healthData?.service}</span>
                        <span style={{
                            marginLeft: 'auto', fontSize: 12, padding: '4px 10px', borderRadius: 12,
                            background: healthData?.status === 'UP' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                            color: healthData?.status === 'UP' ? '#22c55e' : '#ef4444'
                        }}>
                            {healthData?.status === 'UP' ? '🟢 Online' : '🔴 Offline'}
                        </span>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div style={{
                        padding: 12, marginBottom: 16, borderRadius: 8,
                        background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 13
                    }}>{error}</div>
                )}
                {success && (
                    <div style={{
                        padding: 12, marginBottom: 16, borderRadius: 8,
                        background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: 13
                    }}>{success}</div>
                )}

                {/* Server cards */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                    {serverList.map(s => (
                        <div key={s.id} className={`card ${active === s.id ? 'card-glow' : ''}`} style={{
                            flex: 1, cursor: 'pointer', padding: 16
                        }} onClick={() => setActive(s.id)}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: s.data?.primary_status === 'UP' ? '#22c55e' : '#ef4444'
                                }} />
                                <span style={{
                                    fontSize: 12, fontWeight: 600,
                                    color: s.data?.primary_status === 'UP' ? 'var(--accent-green)' : 'var(--accent-red)'
                                }}>
                                    {s.data?.primary_status === 'UP' ? 'Hoạt động' : 'Offline'}
                                </span>
                            </div>
                            <h3 style={{ fontSize: 14, marginBottom: 4 }}>{s.name}</h3>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.location}</p>
                            <div style={{
                                marginTop: 8, display: 'inline-block', fontSize: 11, padding: '4px 8px', borderRadius: 6,
                                background: s.data?.mode === 'NORMAL' ? 'rgba(13,185,242,0.15)' : 'rgba(249,115,22,0.15)',
                                color: s.data?.mode === 'NORMAL' ? 'var(--accent-blue)' : 'var(--accent-orange)'
                            }}>
                                {s.data?.mode || 'UNKNOWN'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Detailed status for each region */}
                {serverList.map(s => (
                    <div key={s.id} className="card" style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span style={{ fontWeight: 600 }}>{s.name}</span>
                        </div>

                        {/* Primary node */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Primary Node</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    padding: '2px 8px', borderRadius: 4, fontSize: 11,
                                    background: s.data?.primary_status === 'UP' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: s.data?.primary_status === 'UP' ? '#22c55e' : '#ef4444'
                                }}>
                                    {s.data?.primary_status || 'UNKNOWN'}
                                </span>
                                <button
                                    onClick={() => handleToggleNode(s.id, 'primary', s.data?.primary_status)}
                                    disabled={updating}
                                    style={{
                                        padding: '4px 8px', fontSize: 10, border: 'none', borderRadius: 4, cursor: 'pointer',
                                        background: 'rgba(107,107,138,0.2)', color: 'var(--text-muted)'
                                    }}
                                >
                                    {s.data?.primary_status === 'UP' ? 'Tắt' : 'Bật'}
                                </button>
                            </div>
                        </div>

                        {/* Replica node */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Replica Node</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    padding: '2px 8px', borderRadius: 4, fontSize: 11,
                                    background: s.data?.replica_status === 'UP' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: s.data?.replica_status === 'UP' ? '#22c55e' : '#ef4444'
                                }}>
                                    {s.data?.replica_status || 'UNKNOWN'}
                                </span>
                                <button
                                    onClick={() => handleToggleNode(s.id, 'replica', s.data?.replica_status)}
                                    disabled={updating}
                                    style={{
                                        padding: '4px 8px', fontSize: 10, border: 'none', borderRadius: 4, cursor: 'pointer',
                                        background: 'rgba(107,107,138,0.2)', color: 'var(--text-muted)'
                                    }}
                                >
                                    {s.data?.replica_status === 'UP' ? 'Tắt' : 'Bật'}
                                </button>
                            </div>
                        </div>

                        {/* Mode */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 8 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Chế độ</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{
                                    padding: '2px 8px', borderRadius: 4, fontSize: 11,
                                    background: s.data?.mode === 'NORMAL' ? 'rgba(13,185,242,0.15)' : 'rgba(249,115,22,0.15)',
                                    color: s.data?.mode === 'NORMAL' ? 'var(--accent-blue)' : 'var(--accent-orange)'
                                }}>
                                    {s.data?.mode || 'UNKNOWN'}
                                </span>
                                <button
                                    onClick={() => handleToggleMode(s.id, s.data?.mode)}
                                    disabled={updating}
                                    style={{
                                        padding: '4px 8px', fontSize: 10, border: 'none', borderRadius: 4, cursor: 'pointer',
                                        background: 'rgba(107,107,138,0.2)', color: 'var(--text-muted)'
                                    }}
                                >
                                    {s.data?.mode === 'NORMAL' ? 'Read Only' : 'Normal'}
                                </button>
                            </div>
                        </div>

                        {/* Write allowed */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                            <span style={{ color: 'var(--text-muted)' }}>Ghi dữ liệu</span>
                            <span style={{
                                color: s.data?.write_allowed ? '#22c55e' : '#ef4444',
                                fontWeight: 600
                            }}>
                                {s.data?.write_allowed ? '✓ Cho phép' : '✗ Từ chối'}
                            </span>
                        </div>
                    </div>
                ))}

                {/* Diagram */}
                <div className="card" style={{ textAlign: 'center', padding: 24 }}>
                    <h3 style={{ fontSize: 14, marginBottom: 16 }}>Kiến trúc Master-Slave</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
                        <div style={{
                            padding: '12px 20px', borderRadius: 12,
                            background: clusters.SOUTH?.primary_status === 'UP' ? 'rgba(13,185,242,0.15)' : 'rgba(239,68,68,0.15)',
                            border: `1px solid ${clusters.SOUTH?.primary_status === 'UP' ? 'var(--accent-blue)' : '#ef4444'}`
                        }}>
                            <span className="material-icons-round" style={{
                                color: clusters.SOUTH?.primary_status === 'UP' ? 'var(--accent-blue)' : '#ef4444'
                            }}>dns</span>
                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>SOUTH</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>TP.HCM</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span className="material-icons-round" style={{ color: 'var(--accent-green)', fontSize: 20 }}>sync</span>
                            <div style={{ fontSize: 10, color: 'var(--accent-green)' }}>Sync</div>
                        </div>
                        <div style={{
                            padding: '12px 20px', borderRadius: 12,
                            background: clusters.NORTH?.primary_status === 'UP' ? 'rgba(249,115,22,0.15)' : 'rgba(239,68,68,0.15)',
                            border: `1px solid ${clusters.NORTH?.primary_status === 'UP' ? 'var(--accent-orange)' : '#ef4444'}`
                        }}>
                            <span className="material-icons-round" style={{
                                color: clusters.NORTH?.primary_status === 'UP' ? 'var(--accent-orange)' : '#ef4444'
                            }}>dns</span>
                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>NORTH</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Hà Nội</div>
                        </div>
                    </div>
                </div>

                {/* Info card */}
                <div className="card" style={{ marginTop: 16, background: 'rgba(13,185,242,0.08)', fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 8 }}>💡 Demo Failover</div>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                        <li>Click "Tắt" Primary Node để giả lập server down</li>
                        <li>Hệ thống sẽ tự động chuyển sang Replica</li>
                        <li>Click "Read Only" để test chế độ chỉ đọc</li>
                        <li>Data tự động refresh mỗi 10 giây</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
