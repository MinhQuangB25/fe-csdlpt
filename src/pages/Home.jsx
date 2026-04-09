import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import BottomNav from '../components/BottomNav'
import L from 'leaflet'

// Fix generic Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { REGIONS, VEHICLE_RATES } from '../services/constants'
import { useUser } from '../context/UserContext'

// Custom user pulse marker
const userIcon = L.divIcon({
    className: 'custom-pulse-marker',
    html: `
        <div style="position: relative; width: 100%; height: 100%; border-radius: 50%;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 14px; height: 14px; background: #0db9f2; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(13,185,242,0.8); z-index: 2;"></div>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; background: rgba(13,185,242,0.3); border-radius: 50%; animation: pulse-radar 2s infinite ease-out; z-index: 1;"></div>
        </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const vehicles = Object.values(VEHICLE_RATES)

export default function Home() {
    const navigate = useNavigate()
    const { region } = useUser()
    const regionConfig = REGIONS[region] || REGIONS.SOUTH

    return (
        <div className="page">
            {/* Map Area */}
            <div style={{ height: '55vh', position: 'relative', zIndex: 1 }}>
                <MapContainer 
                    center={regionConfig.center} 
                    zoom={regionConfig.zoom} 
                    zoomControl={false}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://carto.com/">Carto</a>'
                    />
                    <Marker position={regionConfig.center} icon={userIcon} />
                </MapContainer>

                {/* GPS button overlay */}
                <button style={{
                    position: 'absolute', bottom: 44, right: 16, zIndex: 400,
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'rgba(26,26,46,0.9)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#0db9f2', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    <span className="material-icons-round">my_location</span>
                </button>

                {/* Region badge overlay */}
                <div style={{
                    position: 'absolute', top: 48, left: 20, zIndex: 400,
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <div className="badge badge-green" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16,185,129,0.3)', backdropFilter: 'blur(5px)' }}>
                        <span className="status-dot online" style={{ width: 6, height: 6 }} />
                        {regionConfig.name}
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
                            key={v.id}
                            className={`vehicle-btn ${v.id === 'BIKE' ? 'active' : ''}`}
                            onClick={() => navigate('/booking', { state: { vehicleType: v.id } })}
                        >
                            <div style={{ 
                                width: 44, height: 44, borderRadius: 12, 
                                background: `${v.color}15`, display: 'flex', 
                                alignItems: 'center', justifyContent: 'center', marginBottom: 8
                            }}>
                                <span className="material-icons-round" style={{ color: v.color, fontSize: 26 }}>{v.icon}</span>
                            </div>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>{v.name}</div>
                            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Giá rẻ • 3-5 phút</div>
                        </button>
                    ))}
                </div>
            </div>

            <BottomNav />
        </div>
    )
}
