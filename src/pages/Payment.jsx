import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const methods = [
    { id: 'cash', icon: '💵', name: 'Tiền mặt', desc: 'Thanh toán khi hoàn thành', color: '#22c55e' },
    { id: 'wallet', icon: '👛', name: 'Ví GoiXe', desc: 'Số dư: 350.000đ', color: '#0db9f2' },
    { id: 'momo', icon: '🟣', name: 'MoMo', desc: '**** 5678', color: '#a855f7' },
    { id: 'zalopay', icon: '🔵', name: 'ZaloPay', desc: '**** 1234', color: '#0db9f2' },
    { id: 'vnpay', icon: '🔴', name: 'VNPay', desc: '**** 9012', color: '#ef4444' },
]
const topupAmounts = [50000, 100000, 200000, 500000]
const transactions = [
    { desc: 'Chuyến đi #1234', amount: '-15.000đ', time: '07/03/2026' },
    { desc: 'Nạp ví', amount: '+200.000đ', time: '06/03/2026' },
    { desc: 'Chuyến đi #1230', amount: '-45.000đ', time: '05/03/2026' },
]

export default function Payment() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState('cash')
    const [showTopup, setShowTopup] = useState(false)

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-icon" onClick={() => navigate(-1)}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2>Thanh toán</h2>
            </div>

            <div style={{ padding: '0 20px' }}>
                {methods.map(m => (
                    <button key={m.id} onClick={() => setSelected(m.id)} className="card" style={{
                        display: 'flex', alignItems: 'center', gap: 14, padding: 16, marginBottom: 8,
                        width: '100%', cursor: 'pointer',
                        borderColor: selected === m.id ? 'var(--accent-blue)' : undefined
                    }}>
                        <span style={{ fontSize: 28 }}>{m.icon}</span>
                        <div style={{ flex: 1, textAlign: 'left' }}>
                            <div style={{ fontWeight: 600, fontSize: 15 }}>{m.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.desc}</div>
                        </div>
                        <div style={{
                            width: 20, height: 20, borderRadius: '50%',
                            border: `2px solid ${selected === m.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {selected === m.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent-blue)' }} />}
                        </div>
                    </button>
                ))}

                {/* Topup */}
                <button className="btn btn-outline" onClick={() => setShowTopup(!showTopup)} style={{ marginTop: 12, marginBottom: 12 }}>
                    <span className="material-icons-round">add</span>
                    {showTopup ? 'Đóng' : 'Nạp tiền vào Ví GoiXe'}
                </button>

                {showTopup && (
                    <div className="card" style={{ marginBottom: 16, animation: 'slideUp 0.3s ease' }}>
                        <h3 style={{ fontSize: 14, marginBottom: 12 }}>Chọn mệnh giá</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {topupAmounts.map(a => (
                                <button key={a} className="btn btn-outline btn-sm" style={{ fontWeight: 600 }}>
                                    {a.toLocaleString()}đ
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add card */}
                <button className="card" style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: 16, marginBottom: 20,
                    width: '100%', cursor: 'pointer', border: '1.5px dashed var(--border-color)'
                }}>
                    <span className="material-icons-round" style={{ color: 'var(--accent-blue)' }}>add_card</span>
                    <span style={{ fontWeight: 500, color: 'var(--accent-blue)' }}>Thêm thẻ ngân hàng</span>
                </button>

                {/* Recent transactions */}
                <h3 style={{ fontSize: 15, marginBottom: 12 }}>Giao dịch gần đây</h3>
                {transactions.map((t, i) => (
                    <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', padding: 14, marginBottom: 8 }}>
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{t.desc}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.time}</div>
                        </div>
                        <span style={{
                            fontWeight: 700, fontSize: 14,
                            color: t.amount.startsWith('+') ? 'var(--accent-green)' : 'var(--text-secondary)'
                        }}>{t.amount}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
