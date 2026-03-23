import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Car, User, Star, Phone, MessageSquare } from 'lucide-react';

const Tracking = () => {
  const navigate = useNavigate();
  const [tripStatus, setTripStatus] = useState('Đang đến');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // Status cycle: 'Đang đến' -> 'Đang chờ' -> 'Đang đi' -> 'Hoàn thành'
  useEffect(() => {
    const statusCycle = ['Đang đến', 'Đang chờ', 'Đang đi', 'Hoàn thành'];
    let currentIndex = 0;

    const statusInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statusCycle.length;
      setTripStatus(statusCycle[currentIndex]);

      if (statusCycle[currentIndex] === 'Hoàn thành') {
        setShouldNavigate(true);
      }
    }, 4000);

    return () => clearInterval(statusInterval);
  }, []);

  // Navigate to /rate after 2 seconds when completed
  useEffect(() => {
    if (shouldNavigate) {
      const navigationTimer = setTimeout(() => {
        navigate('/rate');
      }, 2000);

      return () => clearTimeout(navigationTimer);
    }
  }, [shouldNavigate, navigate]);

  const polylinePoints = '50,160 150,60 250,60 350,160';
  const pathData = 'M50,160 L150,60 L250,60 L350,160';

  const styles = `
    @keyframes driveCar {
      0% {
        offset-distance: 0%;
      }
      100% {
        offset-distance: 100%;
      }
    }

    .car-moving {
      animation: driveCar 6s linear infinite;
      offset-path: path('${pathData}');
      offset-rotate: auto;
    }

    @keyframes pulseGlow {
      0%, 100% {
        box-shadow: 0 0 0 0 rgba(13, 185, 242, 0.7);
      }
      50% {
        box-shadow: 0 0 0 10px rgba(13, 185, 242, 0);
      }
    }

    .status-banner {
      animation: pulseGlow 2s infinite;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div
        style={{
          backgroundColor: 'var(--bg-dark)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          color: 'var(--text-gray)',
          padding: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        }}
      >
        {/* Map Section */}
        <div
          style={{
            backgroundColor: '#1a2c34',
            borderRadius: '12px',
            height: '200px',
            marginBottom: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* SVG Container with zigzag route and animated car */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 200"
            preserveAspectRatio="xMidYMid meet"
            style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}
          >
            {/* Zigzag route line (dashed polyline) */}
            <polyline
              points={polylinePoints}
              stroke="#718096"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          </svg>

          {/* Animated Car - positioned absolutely within SVG coordinates */}
          <div
            className="car-moving"
            style={{
              position: 'absolute',
              zIndex: 10,
              top: 0,
              left: 0,
            }}
          >
            <Car size={24} color="#0db9f2" fill="#0db9f2" />
          </div>

          {/* Pickup Icon (bottom left) */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              zIndex: 8,
            }}
          >
            <MapPin size={20} color="#4ade80" fill="#4ade80" />
            <span style={{ fontSize: '11px', color: '#4ade80' }}>Điểm đón</span>
          </div>

          {/* Destination Icon (bottom right) */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              zIndex: 8,
            }}
          >
            <MapPin size={20} color="#ef4444" fill="#ef4444" />
            <span style={{ fontSize: '11px', color: '#ef4444' }}>Điểm đến</span>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className="status-banner"
          style={{
            backgroundColor: 'rgba(13, 185, 242, 0.1)',
            borderLeft: '4px solid var(--primary)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'var(--primary)',
              marginBottom: '4px',
            }}
          >
            {tripStatus}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-gray)', opacity: '0.8' }}>
            Tài xế sẽ đến trong 3 phút
          </div>
        </div>

        {/* Driver Card */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          {/* Avatar */}
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

          {/* Driver Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
              Nguyễn Văn A
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px',
              }}
            >
              <Star size={14} color="#fbbf24" fill="#fbbf24" />
              <span style={{ fontSize: '13px' }}>4.9</span>
            </div>
            <div
              style={{
                display: 'inline-block',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                color: 'var(--text-gray)',
              }}
            >
              51F-123.45
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `2px solid var(--primary)`,
                backgroundColor: 'transparent',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Phone size={16} />
            </button>
            <button
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: `2px solid var(--primary)`,
                backgroundColor: 'transparent',
                color: 'var(--primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* Trip Details */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '13px', opacity: '0.7' }}>Giá cước</span>
            <span style={{ fontSize: '16px', fontWeight: '600' }}>65.000đ</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '13px', opacity: '0.7' }}>Phương thức thanh toán</span>
            <span style={{ fontSize: '13px', fontWeight: '500' }}>Tiền mặt</span>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={() => navigate('/booking')}
          style={{
            padding: '12px 20px',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            backgroundColor: 'transparent',
            color: 'rgba(239, 68, 68, 0.8)',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#ef4444';
            e.target.style.color = '#ef4444';
            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            e.target.style.color = 'rgba(239, 68, 68, 0.8)';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          Hủy chuyến
        </button>
      </div>
    </>
  );
};

export default Tracking;
