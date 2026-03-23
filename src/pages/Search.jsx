import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Home, Briefcase, History } from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('Vị trí hiện tại');
  const [destination, setDestination] = useState('');

  // Mock dữ liệu địa chỉ đã lưu
  const savedAddresses = [
    { id: 1, name: 'Nhà riêng', icon: Home },
    { id: 2, name: 'Công ty', icon: Briefcase },
  ];

  // Mock dữ liệu tìm kiếm gần đây
  const recentSearches = [
    { id: 1, name: 'Trung tâm thương mại Landmark 81, TP. Hồ Chí Minh' },
    { id: 2, name: 'Sân bay Tân Sơn Nhất, TP. Hồ Chí Minh' },
    { id: 3, name: 'Trường Đại học Bách Khoa TP. Hồ Chí Minh' },
  ];

  const handleLocationSelect = (locationName) => {
    setDestination(locationName);
    navigate('/booking', { state: { pickup: pickupLocation, destination: locationName } });
  };

  return (
    <div style={{
      backgroundColor: 'var(--bg-dark)',
      color: 'var(--text-gray)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
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
        <h1 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '0',
          flex: 1,
          textAlign: 'center',
        }}>
          Chọn điểm đến
        </h1>
        <div style={{ width: '34px' }} />
      </div>

      {/* Input Fields */}
      <div style={{ marginBottom: '30px' }}>
        {/* Pickup Location */}
        <input
          type="text"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '8px',
            color: '#0db9f2',
            fontSize: '14px',
            fontWeight: '500',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          placeholder="Điểm đón"
        />

        {/* Destination */}
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Điểm đến"
          style={{
            width: '100%',
            padding: '12px 15px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '8px',
            color: 'var(--text-gray)',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Saved Addresses */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '15px',
          textTransform: 'uppercase',
          color: 'var(--text-gray)',
          opacity: '0.7',
        }}>
          Địa chỉ đã lưu
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {savedAddresses.map((address) => {
            const IconComponent = address.icon;
            return (
              <button
                key={address.id}
                onClick={() => handleLocationSelect(address.name)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 15px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'var(--text-gray)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
              >
                <IconComponent size={20} color="var(--primary)" />
                <span>{address.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Searches */}
      <div>
        <h2 style={{
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '15px',
          textTransform: 'uppercase',
          color: 'var(--text-gray)',
          opacity: '0.7',
        }}>
          Tìm kiếm gần đây
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentSearches.map((search) => (
            <button
              key={search.id}
              onClick={() => handleLocationSelect(search.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 15px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                borderRadius: '8px',
                color: 'var(--text-gray)',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(13, 185, 242, 0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            >
              <History size={20} color="var(--primary)" />
              <span>{search.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
