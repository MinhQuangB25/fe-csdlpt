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

    // Health Check states
    const [hcStatus, setHcStatus] = useState(null)
    const [hcEvents, setHcEvents] = useState([])
    const [activeTab, setActiveTab] = useState('servers') // 'servers' | 'health' | 'events'

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

    const fetchHealthCheck = async () => {
        try {
            const [statusRes, eventsRes] = await Promise.all([
                api.getHealthCheckStatus(),
                api.getHealthCheckEvents(30),
            ])
            setHcStatus(statusRes)
            setHcEvents(eventsRes.events || [])
        } catch (err) {
            console.error('Error fetching health check:', err)
        }
    }

    useEffect(() => {
        fetchHealth()
        fetchHealthCheck()
        const interval = setInterval(() => {
            fetchHealth()
            fetchHealthCheck()
        }, 8000)
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
            await fetchHealthCheck()
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

    // Helpers for health check display
    const getNodeStatusColor = (node) => {
        if (!node) return '#6b7280'
        if (node.is_healthy) return '#22c55e'
        if (node.failure_count > 0) return '#f59e0b'
        return '#ef4444'
    }

    const getActionIcon = (action) => {
        switch (action) {
            case 'FAILOVER': return '🚨'
            case 'RECOVERY': return '🔄'
            case 'NODE_DOWN': return '⬇️'
            case 'NODE_UP': return '⬆️'
            default: return '📋'
        }
    }

    const getActionColor = (action) => {
        switch (action) {
            case 'FAILOVER': return '#ef4444'
            case 'RECOVERY': return '#22c55e'
            case 'NODE_DOWN': return '#f59e0b'
            case 'NODE_UP': return '#22c55e'
            default: return 'var(--text-muted)'
        }
    }

    const tabs = [
        { id: 'servers', label: 'Servers', icon: 'dns' },
        { id: 'health', label: 'Health Check', icon: 'monitor_heart' },
        { id: 'events', label: 'Sự kiện', icon: 'timeline' },
    ]

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-icon" onClick={() => navigate(-1)}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2>Trạng thái Server</h2>
                <button className="btn-icon" onClick={() => { fetchHealth(); fetchHealthCheck() }} style={{ marginLeft: 'auto' }}>
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

                {/* Tabs */}
                <div style={{
                    display: 'flex', gap: 4, marginBottom: 16, padding: 4,
                    background: 'rgba(107,107,138,0.1)', borderRadius: 12
                }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                            flex: 1, padding: '10px 8px', border: 'none', borderRadius: 10, cursor: 'pointer',
                            fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: activeTab === t.id ? 'var(--card-bg)' : 'transparent',
                            color: activeTab === t.id ? 'var(--accent-blue)' : 'var(--text-muted)',
                            boxShadow: activeTab === t.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                            transition: 'all 0.2s ease',
                        }}>
                            <span className="material-icons-round" style={{ fontSize: 16 }}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ========== TAB: SERVERS ========== */}
                {activeTab === 'servers' && (
                    <>
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

                        {/* Detailed status */}
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
                    </>
                )}

                {/* ========== TAB: HEALTH CHECK ========== */}
                {activeTab === 'health' && (
                    <>
                        {/* Health check info card */}
                        <div className="card" style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <span className="material-icons-round" style={{ color: 'var(--accent-blue)', fontSize: 24 }}>monitor_heart</span>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>Auto Health Check</span>
                                <span style={{
                                    marginLeft: 'auto', fontSize: 11, padding: '4px 10px', borderRadius: 10,
                                    background: hcStatus?.running ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: hcStatus?.running ? '#22c55e' : '#ef4444',
                                    fontWeight: 600,
                                }}>
                                    {hcStatus?.running ? '● Đang chạy' : '○ Đã dừng'}
                                </span>
                            </div>

                            {/* Config info */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
                                padding: 12, borderRadius: 10, background: 'rgba(13,185,242,0.06)',
                            }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-blue)' }}>
                                        {hcStatus?.interval_seconds || 10}s
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Interval</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-orange)' }}>
                                        {hcStatus?.failure_threshold || 3}x
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Ngưỡng lỗi</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent-green)' }}>
                                        {hcStatus?.connect_timeout || 3}s
                                    </div>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Timeout</div>
                                </div>
                            </div>
                        </div>

                        {/* Node status cards */}
                        {hcStatus?.nodes && Object.values(hcStatus.nodes).map(node => (
                            <div key={node.name} className="card" style={{ marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
                                {/* Left color bar */}
                                <div style={{
                                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                                    background: getNodeStatusColor(node),
                                    borderRadius: '16px 0 0 16px',
                                }} />

                                <div style={{ paddingLeft: 8 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                        <span className="material-icons-round" style={{
                                            fontSize: 18,
                                            color: getNodeStatusColor(node)
                                        }}>
                                            {node.is_healthy ? 'check_circle' : 'error'}
                                        </span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>{node.name}</div>
                                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                                {node.region} • {node.role}
                                            </div>
                                        </div>
                                        <span style={{
                                            marginLeft: 'auto', fontSize: 11, padding: '3px 8px', borderRadius: 6,
                                            fontWeight: 600,
                                            background: node.is_healthy ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                                            color: node.is_healthy ? '#22c55e' : '#ef4444'
                                        }}>
                                            {node.is_healthy ? 'HEALTHY' : 'UNHEALTHY'}
                                        </span>
                                    </div>

                                    {/* Metrics row */}
                                    <div style={{
                                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
                                        fontSize: 11,
                                    }}>
                                        <div style={{
                                            padding: '6px 8px', borderRadius: 6,
                                            background: 'rgba(107,107,138,0.08)', textAlign: 'center'
                                        }}>
                                            <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Latency</div>
                                            <div style={{ fontWeight: 600, color: node.latency_ms > 100 ? '#f59e0b' : '#22c55e' }}>
                                                {node.latency_ms}ms
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '6px 8px', borderRadius: 6,
                                            background: 'rgba(107,107,138,0.08)', textAlign: 'center'
                                        }}>
                                            <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Lỗi liên tiếp</div>
                                            <div style={{
                                                fontWeight: 600,
                                                color: node.failure_count >= (hcStatus?.failure_threshold || 3) ? '#ef4444'
                                                    : node.failure_count > 0 ? '#f59e0b' : '#22c55e'
                                            }}>
                                                {node.failure_count}/{hcStatus?.failure_threshold || 3}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: '6px 8px', borderRadius: 6,
                                            background: 'rgba(107,107,138,0.08)', textAlign: 'center'
                                        }}>
                                            <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>Lần check</div>
                                            <div style={{ fontWeight: 600 }}>
                                                {node.last_check ? node.last_check.split(' ')[1] : '—'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error message */}
                                    {node.last_error && (
                                        <div style={{
                                            marginTop: 8, padding: '6px 10px', borderRadius: 6,
                                            background: 'rgba(239,68,68,0.08)', fontSize: 11, color: '#ef4444',
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                        }}>
                                            ⚠️ {node.last_error}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Info card */}
                        <div className="card" style={{ marginTop: 8, background: 'rgba(13,185,242,0.08)', fontSize: 12, color: 'var(--text-muted)' }}>
                            <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: 8 }}>💡 Cách hoạt động</div>
                            <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                                <li>Health Check tự động ping tất cả DB node mỗi <b>{hcStatus?.interval_seconds || 10}s</b></li>
                                <li>Nếu 1 node thất bại <b>{hcStatus?.failure_threshold || 3} lần liên tiếp</b> → đánh dấu DOWN</li>
                                <li>Khi Master DOWN → hệ thống tự động <b>chuyển sang Slave (READ_ONLY)</b></li>
                                <li>Khi Master phục hồi → tự động <b>khôi phục về NORMAL</b></li>
                            </ul>
                        </div>
                    </>
                )}

                {/* ========== TAB: EVENTS ========== */}
                {activeTab === 'events' && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <span className="material-icons-round" style={{ color: 'var(--accent-blue)', fontSize: 22 }}>timeline</span>
                            <span style={{ fontWeight: 700, fontSize: 15 }}>Lịch sử Failover</span>
                            <span style={{
                                marginLeft: 'auto', fontSize: 11, padding: '3px 8px', borderRadius: 6,
                                background: 'rgba(107,107,138,0.15)', color: 'var(--text-muted)',
                            }}>
                                {hcEvents.length} sự kiện
                            </span>
                        </div>

                        {hcEvents.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: 40 }}>
                                <span className="material-icons-round" style={{ fontSize: 40, color: 'var(--text-muted)', opacity: 0.4 }}>event_available</span>
                                <div style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 13 }}>
                                    Chưa có sự kiện failover nào
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>
                                    Hệ thống đang hoạt động bình thường ✓  
                                </div>
                            </div>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                {/* Timeline line */}
                                <div style={{
                                    position: 'absolute', left: 15, top: 0, bottom: 0, width: 2,
                                    background: 'rgba(107,107,138,0.2)',
                                }} />

                                {hcEvents.map((evt, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', gap: 16, marginBottom: 4,
                                        position: 'relative',
                                    }}>
                                        {/* Dot */}
                                        <div style={{
                                            width: 32, minWidth: 32, height: 32,
                                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'var(--card-bg)',
                                            border: `2px solid ${getActionColor(evt.action)}`,
                                            fontSize: 14, zIndex: 1,
                                        }}>
                                            {getActionIcon(evt.action)}
                                        </div>

                                        {/* Content */}
                                        <div className="card" style={{
                                            flex: 1, padding: '10px 14px', marginBottom: 0,
                                            borderLeft: `3px solid ${getActionColor(evt.action)}`,
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                                <span style={{
                                                    fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                                                    background: `${getActionColor(evt.action)}20`,
                                                    color: getActionColor(evt.action),
                                                }}>
                                                    {evt.action}
                                                </span>
                                                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                                    {evt.timestamp}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                                                {evt.message}
                                            </div>
                                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>
                                                {evt.region} • {evt.node}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
