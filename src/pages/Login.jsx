import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import api from '../services/api'
import './Login.css'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useUser()
    const [phone, setPhone] = useState('')
    const [region, setRegion] = useState('south')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async () => {
        if (!phone) {
            setError('Vui lòng nhập số điện thoại')
            return
        }

        setLoading(true)
        setError('')

        try {
            // Convert region to location
            const location = region === 'north' ? 'Hanoi' : 'HCM'

            // Format phone number: convert +84 to 0 format (backend expects 0XXXXXXXXX)
            const formattedPhone = '0' + phone.replace(/\s/g, '')

            const response = await api.login(formattedPhone, location)

            // Save user data to context
            login(
                response.user,
                response.token,
                response.routing.region,
                response.routing
            )

            navigate('/home')
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page login-page">
            <div className="login-bg">
                <div className="login-circles">
                    <div className="circle circle-1" />
                    <div className="circle circle-2" />
                    <div className="circle circle-3" />
                </div>
            </div>

            <div className="login-content">
                <div className="login-logo">
                    <div className="logo-icon">
                        <span className="material-icons-round">local_taxi</span>
                    </div>
                    <h1 className="logo-text">GoiXe</h1>
                    <p className="logo-tagline">Gọi xe nhanh — Đến nơi an toàn</p>
                </div>

                <div className="login-form">
                    <div className="server-status">
                        <span className="status-dot online" />
                        <span>Server đang hoạt động</span>
                    </div>

                    <div className="input-group">
                        <label>Số điện thoại</label>
                        <div className="phone-input">
                            <span className="phone-prefix">+84</span>
                            <input
                                type="tel"
                                className="input-field"
                                placeholder="912 345 678"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Chọn khu vực</label>
                        <select
                            className="input-field"
                            value={region}
                            onChange={e => setRegion(e.target.value)}
                        >
                            <option value="north">🏔️ Miền Bắc — Server Hà Nội</option>
                            <option value="south">🌴 Miền Nam — Server TP.HCM</option>
                        </select>
                    </div>

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

                    <button
                        className="btn btn-primary"
                        onClick={handleLogin}
                        disabled={loading || !phone}
                    >
                        <span className="material-icons-round">
                            {loading ? 'hourglass_empty' : 'login'}
                        </span>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>

                    <div className="login-footer">
                        <span className="text-muted">Chưa có tài khoản?</span>
                        <button className="btn-text" onClick={() => navigate('/register')}>
                            Đăng ký ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
