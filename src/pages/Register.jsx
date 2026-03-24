import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const navigate = useNavigate()
    const [showPw, setShowPw] = useState(false)
    const [agreed, setAgreed] = useState(false)

    return (
        <div className="page" style={{ padding: '48px 24px 40px' }}>
            <button className="btn-icon" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
                <span className="material-icons-round">arrow_back</span>
            </button>

            <h1 style={{ marginBottom: 4 }}>Đăng ký</h1>
            <p style={{ marginBottom: 32 }}>Tạo tài khoản GoiXe miễn phí</p>

            <div className="input-group">
                <label>Họ và tên</label>
                <input className="input-field" placeholder="Nguyễn Văn A" />
            </div>

            <div className="input-group">
                <label>Số điện thoại</label>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input className="input-field" value="+84" readOnly style={{ width: 70, textAlign: 'center' }} />
                    <input className="input-field" placeholder="912 345 678" style={{ flex: 1 }} />
                </div>
            </div>

            <div className="input-group">
                <label>Email</label>
                <input className="input-field" type="email" placeholder="email@example.com" />
            </div>

            <div className="input-group">
                <label>Mật khẩu</label>
                <div style={{ position: 'relative' }}>
                    <input
                        className="input-field"
                        type={showPw ? 'text' : 'password'}
                        placeholder="Tối thiểu 8 ký tự"
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
                <input className="input-field" type="password" placeholder="Nhập lại mật khẩu" />
            </div>

            <div className="input-group">
                <label>Chọn khu vực</label>
                <select className="input-field">
                    <option>🌴 Miền Nam — Server TP.HCM</option>
                    <option>🏔️ Miền Bắc — Server Hà Nội</option>
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
                style={{ opacity: agreed ? 1 : 0.5 }}
                onClick={() => agreed && navigate('/otp')}
            >
                <span className="material-icons-round">person_add</span>
                Đăng ký
            </button>

            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>Đã có tài khoản? </span>
                <button className="btn-text" onClick={() => navigate('/login')}>Đăng nhập</button>
            </div>
        </div>
    )
}
