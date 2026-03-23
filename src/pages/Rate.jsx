import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, User, MapPin } from 'lucide-react';

const Rate = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

  const feedbackTexts = {
    5: 'Tuyệt vời!',
    4: 'Hài lòng',
    3: 'Bình thường',
    2: 'Cần cải thiện',
    1: 'Không hài lòng',
  };

  const quickFeedbackTags = ['Lịch sự', 'Chuyên nghiệp', 'Xe sạch', 'An toàn', 'Đúng giờ'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitRating = () => {
    navigate('/home');
  };

  const handleSkip = () => {
    navigate('/home');
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-dark)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        color: 'var(--text-gray)',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '30px',
          paddingBottom: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '22px',
            fontWeight: '700',
            margin: '0',
            color: 'white',
          }}
        >
          Đánh giá chuyến đi
        </h1>
      </div>

      {/* Driver Info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '30px',
          padding: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <User size={32} color="var(--text-gray)" />
        </div>

        <div>
          <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
            Nguyễn Văn A
          </div>
          <div
            style={{
              display: 'inline-block',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              color: 'var(--text-gray)',
              opacity: '0.8',
            }}
          >
            51F-123.45
          </div>
        </div>
      </div>

      {/* Rating System */}
      <div
        style={{
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <Star
                  size={40}
                  color={star <= rating ? '#fbbf24' : '#6b7280'}
                  fill={star <= rating ? '#fbbf24' : 'transparent'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          <div
            style={{
              fontSize: '18px',
              fontWeight: '600',
              color: 'var(--primary)',
              marginTop: '8px',
            }}
          >
            {feedbackTexts[rating]}
          </div>
        </div>
      </div>

      {/* Quick Feedback Tags */}
      <div style={{ marginBottom: '30px' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            opacity: '0.7',
          }}
        >
          Nhận xét nhanh
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {quickFeedbackTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: selectedTags.includes(tag)
                  ? `2px solid var(--primary)`
                  : `1px solid rgba(255, 255, 255, 0.2)`,
                backgroundColor: selectedTags.includes(tag)
                  ? 'rgba(13, 185, 242, 0.1)'
                  : 'transparent',
                color: selectedTags.includes(tag) ? 'var(--primary)' : 'var(--text-gray)',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.05)';
              }}
              onMouseLeave={(e) => {
                if (!selectedTags.includes(tag)) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Comment Textarea */}
      <div style={{ marginBottom: '30px' }}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Nhập ý kiến đóng góp của bạn (tùy chọn)..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: 'var(--text-gray)',
            fontSize: '14px',
            fontFamily: 'inherit',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        />
      </div>

      {/* Trip Summary */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '30px',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '12px', opacity: '0.7' }}>
          THÔNG TIN CHUYẾN ĐI
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Route */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="var(--primary)" />
            <span style={{ fontSize: '13px' }}>Vị trí hiện tại → Landmark 81</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', opacity: '0.7' }}>Tổng tiền</span>
            <span style={{ fontSize: '15px', fontWeight: '600' }}>65.000đ</span>
          </div>

          {/* Payment */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', opacity: '0.7' }}>Phương thức</span>
            <span style={{ fontSize: '13px' }}>Tiền mặt</span>
          </div>

          {/* Duration */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', opacity: '0.7' }}>Thời gian</span>
            <span style={{ fontSize: '13px' }}>15 phút</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
        {/* Submit Button */}
        <button
          onClick={handleSubmitRating}
          style={{
            padding: '14px',
            background: 'var(--gradient)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(13, 185, 242, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          Gửi đánh giá
        </button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          style={{
            padding: '14px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'rgba(255, 255, 255, 0.6)';
          }}
        >
          Bỏ qua
        </button>
      </div>
    </div>
  );
};

export default Rate;
