import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car } from 'lucide-react';

const Searching = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + (100 / 50); 
        if (newProgress >= 100) return 100;
        return newProgress;
      });
    }, 100);
    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    const navigationTimer = setTimeout(() => {
      navigate('/tracking');
    }, 5000);
    return () => clearTimeout(navigationTimer);
  }, [navigate]);

  const styles = `
    @keyframes radar-expand {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
      }
      100% {
        transform: translate(-50%, -50%) scale(2.5);
        opacity: 0;
      }
    }

    .radar-container {
      position: relative;
      width: 150px;
      height: 150px;
      margin: 0 auto;
      margin-bottom: 40px;
    }

    .radar-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 150px;
      height: 150px;
      border: 2px solid #0db9f2;
      border-radius: 50%;
      animation: radar-expand 2s infinite;
      
      /* CHỐT HẠ: ÉP VÒNG TRÒN NẰM IM Ở TÂM TRƯỚC KHI CHẠY */
      animation-fill-mode: backwards; 
    }

    .radar-ring:nth-child(1) { animation-delay: 0s; }
    .radar-ring:nth-child(2) { animation-delay: 0.67s; }
    .radar-ring:nth-child(3) { animation-delay: 1.34s; }

    .car-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
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
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          color: 'var(--text-gray)',
        }}
      >
        <div className="radar-container">
          <div className="radar-ring" />
          <div className="radar-ring" />
          <div className="radar-ring" />
          <div className="car-center">
            <Car color="#0db9f2" size={48} />
          </div>
        </div>

        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>
          Đang tìm tài xế gần bạn...
        </h2>

        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)', fontFamily: 'monospace', marginBottom: '40px', letterSpacing: '2px' }}>
          {Math.ceil((5000 - progress * 50) / 1000)}s
        </div>

        <div style={{ width: '100%', maxWidth: '300px', height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '60px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient)', transition: 'width 0.1s linear', borderRadius: '2px' }} />
        </div>

        <button
          onClick={() => navigate('/booking')}
          style={{
            padding: '12px 30px',
            border: `2px solid var(--primary)`,
            backgroundColor: 'transparent',
            color: 'var(--primary)',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.1)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Hủy tìm kiếm
        </button>
      </div>
    </>
  );
};

export default Searching;