import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login() {
    const navigate = useNavigate()
    const [phone, setPhone] = useState('')
    const [region, setRegion] = useState('south')

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

                    <button className="btn btn-primary" onClick={() => navigate('/home')}>
                        <span className="material-icons-round">login</span>
                        Đăng nhập
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
