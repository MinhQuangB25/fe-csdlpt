import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

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
    const { region } = useUser()

    // Which field is being edited: 'pickup' or 'destination'
    const [activeField, setActiveField] = useState('destination')

    // Pickup state
    const [pickupQuery, setPickupQuery] = useState('')
    const [pickupResults, setPickupResults] = useState([])
    const [pickupSelected, setPickupSelected] = useState(null) // { name, detail, lat, lng }
    const [isSearchingPickup, setIsSearchingPickup] = useState(false)

    // Destination state
    const [destQuery, setDestQuery] = useState('')
    const [destResults, setDestResults] = useState([])
    const [destSelected, setDestSelected] = useState(null)
    const [isSearchingDest, setIsSearchingDest] = useState(false)

    const pickupTimeout = useRef(null)
    const destTimeout = useRef(null)

    // Generic Nominatim search
    const doSearch = async (val, setResults, setIsSearching, timeoutRef) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (val.length < 3) {
            setResults([])
            return
        }
        timeoutRef.current = setTimeout(async () => {
            setIsSearching(true)
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(val)}&format=json&limit=5&countrycodes=vn`)
                const data = await res.json()
                setResults(data)
            } catch (err) {
                console.error("Search error", err)
            } finally {
                setIsSearching(false)
            }
        }, 600)
    }

    const handlePickupSearch = (e) => {
        const val = e.target.value
        setPickupQuery(val)
        setPickupSelected(null)
        doSearch(val, setPickupResults, setIsSearchingPickup, pickupTimeout)
    }

    const handleDestSearch = (e) => {
        const val = e.target.value
        setDestQuery(val)
        setDestSelected(null)
        doSearch(val, setDestResults, setIsSearchingDest, destTimeout)
    }

    const pickLocation = (loc, type) => {
        const parts = loc.display_name.split(', ')
        const name = parts[0]
        const detail = parts.slice(1).join(', ')
        const parsed = { name, detail, lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) }

        if (type === 'pickup') {
            setPickupSelected(parsed)
            setPickupQuery(name)
            setPickupResults([])
            // Auto-switch to destination field if not yet filled
            if (!destSelected) setActiveField('destination')
        } else {
            setDestSelected(parsed)
            setDestQuery(name)
            setDestResults([])
        }
    }

    // Navigate to booking once both pickup & dest are set
    const goToBooking = (pickup, dest) => {
        navigate('/booking', {
            state: { pickup, destination: dest }
        })
    }

    // Auto-navigate when both are selected
    const tryAutoNavigate = (pickup, dest) => {
        if (pickup && dest) {
            goToBooking(pickup, dest)
        }
    }

    // After selecting destination, check if we can auto-navigate
    const handleDestPick = (loc) => {
        const parts = loc.display_name.split(', ')
        const name = parts[0]
        const detail = parts.slice(1).join(', ')
        const dest = { name, detail, lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) }
        setDestSelected(dest)
        setDestQuery(name)
        setDestResults([])
        tryAutoNavigate(pickupSelected, dest)
    }

    const handlePickupPick = (loc) => {
        const parts = loc.display_name.split(', ')
        const name = parts[0]
        const detail = parts.slice(1).join(', ')
        const pickup = { name, detail, lat: parseFloat(loc.lat), lng: parseFloat(loc.lon) }
        setPickupSelected(pickup)
        setPickupQuery(name)
        setPickupResults([])
        if (!destSelected) setActiveField('destination')
        tryAutoNavigate(pickup, destSelected)
    }

    // For saved/recent/hot places, set as destination with no lat/lng
    const defaultSelect = (name, detail) => {
        // Use region-based default pickup if not already set
        const defaultPickup = pickupSelected || {
            name: region === 'NORTH' ? 'Hoàn Kiếm' : 'Nguyễn Huệ',
            detail: region === 'NORTH' ? 'Hà Nội' : 'Quận 1, TP.HCM',
            lat: region === 'NORTH' ? 21.0285 : 10.7769,
            lng: region === 'NORTH' ? 105.8542 : 106.7009
        }
        goToBooking(defaultPickup, { name, detail })
    }

    // Active query & results for current field
    const activeQuery = activeField === 'pickup' ? pickupQuery : destQuery
    const activeResults = activeField === 'pickup' ? pickupResults : destResults
    const isActiveSearching = activeField === 'pickup' ? isSearchingPickup : isSearchingDest

    return (
        <div className="page" style={{ padding: '48px 20px 40px' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
                <span className="material-icons-round">arrow_back</span>
            </button>

            {/* Pickup & Destination inputs */}
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
                        <input
                            className="input-field"
                            placeholder="📍 Chọn điểm đón"
                            value={pickupQuery}
                            onChange={handlePickupSearch}
                            onFocus={() => setActiveField('pickup')}
                            style={{
                                fontSize: 14,
                                borderColor: activeField === 'pickup' ? '#22c55e' : undefined,
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <input
                            className="input-field"
                            placeholder="🔴 Bạn muốn đi đâu?"
                            autoFocus
                            value={destQuery}
                            onChange={handleDestSearch}
                            onFocus={() => setActiveField('destination')}
                            style={{
                                fontSize: 14,
                                borderColor: activeField === 'destination' ? 'var(--accent-blue)' : undefined,
                                transition: 'border-color 0.2s'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Selected chips */}
            {(pickupSelected || destSelected) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                    {pickupSelected && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: 20, padding: '6px 12px', fontSize: 12
                        }}>
                            <span style={{ color: '#22c55e' }}>●</span>
                            <span style={{ fontWeight: 500 }}>{pickupSelected.name}</span>
                            <button onClick={() => { setPickupSelected(null); setPickupQuery('') }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
                        </div>
                    )}
                    {destSelected && (
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 20, padding: '6px 12px', fontSize: 12
                        }}>
                            <span style={{ color: '#ef4444' }}>●</span>
                            <span style={{ fontWeight: 500 }}>{destSelected.name}</span>
                            <button onClick={() => { setDestSelected(null); setDestQuery('') }}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: 16, lineHeight: 1 }}>×</button>
                        </div>
                    )}
                </div>
            )}

            {/* Confirm button when both selected */}
            {pickupSelected && destSelected && (
                <button
                    className="btn btn-primary"
                    onClick={() => goToBooking(pickupSelected, destSelected)}
                    style={{ marginBottom: 24, fontSize: 16 }}
                >
                    <span className="material-icons-round">navigation</span>
                    Xác nhận lộ trình
                </button>
            )}

            {/* Search results for active field */}
            {activeQuery.length > 0 && !(activeField === 'pickup' ? pickupSelected : destSelected) ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                        {activeField === 'pickup' ? '🟢 Kết quả điểm đón' : '🔴 Kết quả điểm đến'}
                    </div>
                    {isActiveSearching ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                            Đang tìm kiếm...
                        </div>
                    ) : (
                        <>
                            {activeResults.map(r => (
                                <button
                                    key={r.place_id}
                                    onClick={() => activeField === 'pickup' ? handlePickupPick(r) : handleDestPick(r)}
                                    className="card"
                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 14, textAlign: 'left' }}
                                >
                                    <span className="material-icons-round" style={{
                                        color: activeField === 'pickup' ? '#22c55e' : 'var(--accent-blue)'
                                    }}>place</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 500, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {r.display_name.split(',')[0]}
                                        </div>
                                        <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {r.display_name}
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {activeQuery.length >= 3 && activeResults.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                    Không tìm thấy kết quả
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : activeQuery.length === 0 && (
                <>
                    {/* Saved */}
                    <h3 style={{ marginBottom: 12, fontSize: 15 }}>📌 Địa chỉ đã lưu</h3>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
                        {saved.map(s => (
                            <button key={s.label} onClick={() => defaultSelect(s.label, s.addr)} className="card" style={{
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
                            <button key={r.addr} onClick={() => defaultSelect(r.addr, r.detail)} className="card" style={{
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
                        <button key={h.name} onClick={() => defaultSelect(h.name, h.addr)} className="card" style={{
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
                </>
            )}
        </div>
    )
}
