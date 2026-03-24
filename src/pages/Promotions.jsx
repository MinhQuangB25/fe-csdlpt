import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const coupons = [
    { code: 'GOIXE20', desc: 'Giảm 20% cho chuyến đi', condition: 'Đơn tối thiểu 50K', discount: '-20%', expires: '15/03/2026', active: true },
    { code: 'NEWUSER', desc: 'Giảm 30K cho người mới', condition: 'Chuyến đầu tiên', discount: '-30K', expires: '31/03/2026', active: true },
    { code: 'FREESHIP', desc: 'Miễn phí cước xe máy', condition: 'Khoảng cách < 5km', discount: 'Miễn phí', expires: '20/03/2026', active: true },
    { code: 'HOLIDAY50', desc: 'Giảm 50% dịp lễ', condition: 'Tối đa 50K', discount: '-50%', expires: '01/03/2026', active: false },
]

export default function Promotions() {
    const navigate = useNavigate()
    const [promoCode, setPromoCode] = useState('')
    const [copied, setCopied] = useState(null)

    const copyCode = (code) => {
        navigator.clipboard?.writeText(code)
        setCopied(code)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="page">
            <div className="page-header">
                <button className="btn-icon" onClick={() => navigate(-1)}>
                    <span className="material-icons-round">arrow_back</span>
                </button>
                <h2>Khuyến mãi</h2>
            </div>

            <div style={{ padding: '0 20px' }}>
                {/* Banner */}
                <div style={{
                    padding: '24px 20px', borderRadius: 16, marginBottom: 20,
                    background: 'var(--gradient-primary)',
                    textAlign: 'center', position: 'relative', overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    <div style={{ position: 'absolute', bottom: -30, left: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                    <span style={{ fontSize: 40 }}>🎉</span>
                    <h2 style={{ fontSize: 28, marginTop: 8 }}>Giảm đến 50%</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginTop: 4, fontSize: 14 }}>Nhập mã để nhận ưu đãi hấp dẫn</p>
                </div>

                {/* Input */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                    <input
                        className="input-field"
                        placeholder="Nhập mã khuyến mãi"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value.toUpperCase())}
                        style={{ flex: 1, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600 }}
                    />
                    <button className="btn btn-primary btn-sm" style={{ width: 'auto', padding: '10px 20px' }}>
                        Áp dụng
                    </button>
                </div>

                {/* Coupons */}
                <h3 style={{ fontSize: 15, marginBottom: 12 }}>Mã khuyến mãi của bạn</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {coupons.map(c => (
                        <div key={c.code} className="card" style={{
                            opacity: c.active ? 1 : 0.5,
                            position: 'relative', overflow: 'hidden'
                        }}>
                            {!c.active && (
                                <div style={{
                                    position: 'absolute', top: 12, right: -24,
                                    background: 'var(--accent-red)', color: 'white',
                                    padding: '2px 30px', fontSize: 10, fontWeight: 700,
                                    transform: 'rotate(35deg)'
                                }}>HẾT HẠN</div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <div style={{
                                    padding: '4px 12px', borderRadius: 6,
                                    background: c.active ? 'rgba(13,185,242,0.15)' : 'rgba(107,107,138,0.15)',
                                    fontWeight: 700, fontSize: 14, letterSpacing: 1,
                                    color: c.active ? 'var(--accent-blue)' : 'var(--text-muted)',
                                    fontFamily: 'monospace'
                                }}>{c.code}</div>
                                <span style={{
                                    fontSize: 18, fontWeight: 800,
                                    color: c.active ? 'var(--accent-green)' : 'var(--text-muted)'
                                }}>{c.discount}</span>
                            </div>
                            <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{c.desc}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.condition}</div>
                            <div className="divider" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>HSD: {c.expires}</span>
                                {c.active && (
                                    <button onClick={() => copyCode(c.code)} className="btn-text" style={{ fontSize: 13, padding: '4px 8px' }}>
                                        <span className="material-icons-round" style={{ fontSize: 16, marginRight: 4 }}>{copied === c.code ? 'check' : 'content_copy'}</span>
                                        {copied === c.code ? 'Đã sao chép!' : 'Sao chép mã'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
