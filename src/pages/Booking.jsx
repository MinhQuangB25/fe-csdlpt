import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Wallet } from 'lucide-react';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get pickup and destination from state or use defaults
  const pickup = location.state?.pickup || 'Vị trí hiện tại';
  const destination = location.state?.destination || 'Landmark 81';

  // State for selected vehicle and payment method
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // Vehicle options
  const vehicles = [
    { id: 1, name: 'Xe máy', price: 35000, emoji: '🏍️' },
    { id: 2, name: 'Ô tô 4 chỗ', price: 65000, emoji: '🚗' },
    { id: 3, name: 'Ô tô 7 chỗ', price: 90000, emoji: '🚐' },
  ];

  const paymentMethods = [
    { id: 'cash', label: 'Tiền mặt' },
    { id: 'card', label: 'Thẻ' },
  ];

  const handleBooking = () => {
    if (selectedVehicle) {
      navigate('/searching', {
        state: {
          pickup,
          destination,
          vehicle: selectedVehicle,
          payment: selectedPayment,
        },
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-dark)',
        color: 'var(--text-gray)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '25px',
          paddingBottom: '15px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '5px',
          }}
        >
          <ChevronLeft size={24} />
        </button>
        <h1
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Xác nhận đặt xe
        </h1>
        <div style={{ width: '34px' }} />
      </div>

      {/* Mini Map */}
      <div
        style={{
          backgroundColor: '#1a2c34',
          borderRadius: '12px',
          height: '200px',
          marginBottom: '25px',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Route Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 'fit-content',
          }}
        >
          {/* Pickup Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapPin size={24} color='#4ade80' fill='#4ade80' />
            <span style={{ fontSize: '14px', color: '#4ade80' }}>Điểm đón</span>
          </div>

          {/* Dashed Line */}
          <div
            style={{
              width: '2px',
              height: '40px',
              borderLeft: '2px dashed #718096',
              margin: '4px 0',
            }}
          />

          {/* Destination Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <MapPin size={24} color='#ef4444' fill='#ef4444' />
            <span style={{ fontSize: '14px', color: '#ef4444' }}>Điểm đến</span>
          </div>
        </div>
      </div>

      {/* Trip Information */}
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '25px',
        }}
      >
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', opacity: '0.6', marginBottom: '4px' }}>
            Từ
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{pickup}</div>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '12px', opacity: '0.6', marginBottom: '4px' }}>
            Đến
          </div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{destination}</div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '15px',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '13px',
            opacity: '0.8',
          }}
        >
          <span>Khoảng cách: 5.2 km</span>
          <span>Thời gian ước tính: 15 phút</span>
        </div>
      </div>

      {/* Vehicle Selection */}
      <div style={{ marginBottom: '25px' }}>
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            opacity: '0.7',
          }}
        >
          Chọn loại xe
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '15px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border:
                  selectedVehicle === vehicle.id
                    ? '1px solid var(--primary)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: 'var(--text-gray)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedVehicle !== vehicle.id) {
                  e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedVehicle !== vehicle.id) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{ fontSize: '24px' }}>{vehicle.emoji}</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{vehicle.name}</span>
              </div>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color:
                    selectedVehicle === vehicle.id ? 'var(--primary)' : 'var(--text-gray)',
                }}
              >
                {vehicle.price.toLocaleString('vi-VN')}đ
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div style={{ marginBottom: '25px' }}>
        <h2
          style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            textTransform: 'uppercase',
            opacity: '0.7',
          }}
        >
          Phương thức thanh toán
        </h2>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 15px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: 'var(--text-gray)',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wallet size={18} color='var(--primary)' />
              <span>
                {paymentMethods.find((m) => m.id === selectedPayment)?.label}
              </span>
            </div>
            <span
              style={{
                fontSize: '12px',
                transform: showPaymentDropdown ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
              }}
            >
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {showPaymentDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                marginTop: '5px',
                backgroundColor: '#0a1419',
                border: '1px solid rgba(13, 185, 242, 0.2)',
                borderRadius: '8px',
                zIndex: 100,
                overflow: 'hidden',
              }}
            >
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedPayment(method.id);
                    setShowPaymentDropdown(false);
                  }}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '12px 15px',
                    backgroundColor:
                      selectedPayment === method.id
                        ? 'rgba(13, 185, 242, 0.15)'
                        : 'transparent',
                    color:
                      selectedPayment === method.id
                        ? 'var(--primary)'
                        : 'var(--text-gray)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    borderBottom:
                      method.id !== 'card' ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedPayment !== method.id) {
                      e.target.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {method.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Button */}
      <button
        onClick={handleBooking}
        disabled={!selectedVehicle}
        style={{
          width: '100%',
          padding: '15px',
          marginTop: 'auto',
          background:
            selectedVehicle
              ? 'var(--gradient)'
              : 'linear-gradient(135deg, rgba(13, 185, 242, 0.3), rgba(13, 185, 242, 0.3))',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '16px',
          fontWeight: '600',
          cursor: selectedVehicle ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          opacity: selectedVehicle ? 1 : 0.6,
        }}
        onMouseEnter={(e) => {
          if (selectedVehicle) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(13, 185, 242, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }}
      >
        Đặt xe ngay
      </button>
    </div>
  );
};

export default Booking;
