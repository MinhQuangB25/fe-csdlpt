import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [region, setRegion] = useState('SOUTH')
    const [showPw, setShowPw] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async () => {
        if (!agreed) return
        
        if (!name || !phone || !email || !password || !confirmPassword) {
            setError('Vui lòng điền đầy đủ các thông tin bắt buộc.')
            return
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu và Xác nhận mật khẩu không khớp.')
            return
        }

        if (password.length < 6) {
            setError('Mật khẩu phải có tối thiểu 6 ký tự.')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Format phone number: convert +84 to 0 format (backend expects 0XXXXXXXXX)
            const formattedPhone = '0' + phone.replace(/\s/g, '')

            const payload = {
                name: name,
                phone: formattedPhone,
                email: email,
                password: password,
                region: region
            }

            await api.register(payload)

            // Skip OTP page and go directly to login upon successful registration
            alert('Đăng ký tài khoản thành công! Mời bạn đăng nhập.')
            navigate('/login')
        } catch (err) {
            console.error('Register error:', err)
            setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page" style={{ padding: '48px 24px 40px', overflowY: 'auto' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
                <span className="material-icons-round">arrow_back</span>
            </button>

            <h1 style={{ marginBottom: 4 }}>Đăng ký</h1>
            <p style={{ marginBottom: 32 }}>Tạo tài khoản GoiXe miễn phí</p>

            {error && (
                <div style={{
                    padding: '12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    fontSize: '13px',
                    marginBottom: '16px'
                }}>
                    {error}
                </div>
            )}

            <div className="input-group">
                <label>Họ và tên</label>
                <input className="input-field" placeholder="Nguyễn Văn A" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="input-group">
                <label>Số điện thoại</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input-field" value="+84" readOnly style={{ width: 70, textAlign: 'center' }} />
                    <input className="input-field" placeholder="912 345 678" style={{ flex: 1 }} value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
            </div>

            <div className="input-group">
                <label>Email</label>
                <input className="input-field" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div className="input-group">
                <label>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                    <input
                        className="input-field"
                        type={showPw ? 'text' : 'password'}
                        placeholder="Tối thiểu 6 ký tự"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button
                        onClick={() => setShowPw(!showPw)}
                        style={{
                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                        }}
                    >
                        <span className="material-icons-round">{showPw ? 'visibility_off' : 'visibility'}</span>
                    </button>
                </div>
            </div>

            <div className="input-group">
                <label>Xác nhận mật khẩu</label>
                <input 
                    className="input-field" 
                    type="password" 
                    placeholder="Nhập lại mật khẩu" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                />
            </div>

            <div className="input-group">
                <label>Chọn khu vực</label>
                <select className="input-field" value={region} onChange={e => setRegion(e.target.value)}>
                    <option value="SOUTH">🌴 Miền Nam — Server TP.HCM</option>
                    <option value="NORTH">🏔️ Miền Bắc — Server Hà Nội</option>
                </select>
            </div>

            <label style={{
                display: 'flex', alignItems: 'flex-start', gap: 10, margin: '20px 0 24px',
                fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer'
            }}>
                <input
                    type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    style={{ marginTop: 2, accentColor: 'var(--accent-blue)', width: 18, height: 18 }}
                />
                <span>Tôi đồng ý với <a href="#" style={{ color: 'var(--accent-blue)' }}>Điều khoản sử dụng</a> và <a href="#" style={{ color: 'var(--accent-blue)' }}>Chính sách bảo mật</a></span>
            </label>

            <button
                className="btn btn-primary"
                style={{ opacity: (agreed && !loading) ? 1 : 0.5 }}
                onClick={handleRegister}
                disabled={loading || !agreed}
            >
                <span className="material-icons-round">person_add</span>
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Đã có tài khoản? </span>
                <button className="btn-text" onClick={() => navigate('/login')}>Đăng nhập</button>
            </div>
        </div>
    )
}
