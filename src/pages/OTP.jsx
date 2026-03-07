import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function OTP() {
    const navigate = useNavigate()
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timer, setTimer] = useState(45)
    const refs = useRef([])

    useEffect(() => {
        refs.current[0]?.focus()
        const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000)
        return () => clearInterval(interval)
    }, [])

    const handleChange = (i, val) => {
        if (!/^\d*$/.test(val)) return
        const next = [...otp]
        next[i] = val.slice(-1)
        setOtp(next)
        if (val && i < 5) refs.current[i + 1]?.focus()
    }
    const handleKey = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) refs.current[i - 1]?.focus()
    }

    const filled = otp.every(d => d !== '')

    return (
        <div className="page" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ position: 'absolute', left: 24, top: 48 }}>
                <span className="material-icons-round">arrow_back</span>
            </button>

            <div style={{ marginTop: 40, marginBottom: 32 }}>
                <div style={{
                    width: 80, height: 80, margin: '0 auto 20px',
                    background: 'linear-gradient(135deg, rgba(13,185,242,0.2), rgba(16,185,129,0.2))',
                    borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'float 3s ease-in-out infinite'
                }}>
                    <span className="material-icons-round" style={{ fontSize: 40, color: 'var(--accent-blue)' }}>verified_user</span>
                </div>
                <h2>Xác thực OTP</h2>
                <p style={{ marginTop: 8 }}>Nhập mã OTP đã gửi đến số<br /><strong style={{ color: 'white' }}>0912 *** 678</strong></p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 24 }}>
                {otp.map((d, i) => (
                    <input
                        key={i}
                        ref={el => refs.current[i] = el}
                        value={d}
                        onChange={e => handleChange(i, e.target.value)}
                        onKeyDown={e => handleKey(i, e)}
                        maxLength={1}
                        style={{
                            width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                            background: d ? 'rgba(13,185,242,0.1)' : 'var(--bg-input)',
                            border: `2px solid ${d ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                            borderRadius: 12, color: 'white', outline: 'none', caretColor: 'var(--accent-blue)',
                            transition: 'all 0.2s',
                            boxShadow: d ? '0 0 12px rgba(13,185,242,0.2)' : 'none',
                            fontFamily: 'inherit'
                        }}
                    />
                ))}
            </div>

            <p style={{ fontSize: 13, marginBottom: 24 }}>
                {timer > 0
                    ? <>Mã hiệu lực trong <strong style={{ color: 'var(--accent-blue)' }}>{timer}s</strong></>
                    : <button className="btn-text" onClick={() => setTimer(45)} style={{ fontSize: 14 }}>Gửi lại mã</button>
                }
            </p>

            <button
                className="btn btn-primary"
                style={{ opacity: filled ? 1 : 0.5 }}
                onClick={() => filled && navigate('/home')}
            >
                <span className="material-icons-round">check_circle</span>
                Xác nhận
            </button>
        </div>
    )
}
