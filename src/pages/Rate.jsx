import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const tags = ['Lịch sự', 'Đúng giờ', 'Xe sạch', 'Lái an toàn', 'Thân thiện', 'Giá hợp lý']

export default function Rate() {
    const navigate = useNavigate()
    const [stars, setStars] = useState(0)
    const [selectedTags, setSelectedTags] = useState([])
    const [comment, setComment] = useState('')

    const toggleTag = tag => setSelectedTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )

    return (
        <div className="page" style={{ padding: '60px 24px 40px', textAlign: 'center' }}>
            {/* Checkmark */}
            <div style={{
                width: 80, height: 80, margin: '0 auto 20px',
                background: 'var(--gradient-success)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(34,197,94,0.3)',
                animation: 'float 3s ease-in-out infinite'
            }}>
                <span className="material-icons-round" style={{ fontSize: 40, color: 'white' }}>check</span>
            </div>

            <h2 style={{ marginBottom: 4 }}>Chuyến đi hoàn thành!</h2>
            <p>Cảm ơn bạn đã sử dụng GoiXe</p>

            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '24px 0' }}>
                {[1, 2, 3, 4, 5].map(i => (
                    <button key={i} onClick={() => setStars(i)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                        transition: 'transform 0.2s'
                    }}>
                        <span className="material-icons-round" style={{
                            fontSize: 40, color: i <= stars ? '#eab308' : 'var(--border-color)',
                            transition: 'all 0.2s', transform: i <= stars ? 'scale(1.1)' : 'scale(1)'
                        }}>star</span>
                    </button>
                ))}
            </div>
            {stars > 0 && <p style={{ color: 'var(--accent-yellow)', fontWeight: 600, marginBottom: 16 }}>
                {['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời!'][stars]}
            </p>}

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
                {tags.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} style={{
                        padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.2s', border: 'none', fontFamily: 'inherit',
                        background: selectedTags.includes(tag) ? 'rgba(13,185,242,0.2)' : 'var(--bg-card)',
                        color: selectedTags.includes(tag) ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        outline: selectedTags.includes(tag) ? '1.5px solid var(--accent-blue)' : '1px solid var(--border-color)'
                    }}>{tag}</button>
                ))}
            </div>

            {/* Comment */}
            <textarea
                className="input-field"
                placeholder="Nhận xét thêm (tùy chọn)..."
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ resize: 'none', marginBottom: 20 }}
            />

            <button className="btn btn-primary" onClick={() => navigate('/home')}>
                <span className="material-icons-round">send</span>
                Gửi đánh giá
            </button>

            <button className="btn-text" onClick={() => navigate('/home')} style={{ marginTop: 12, fontSize: 14, width: '100%', textAlign: 'center' }}>
                Bỏ qua
            </button>
        </div>
    )
}
