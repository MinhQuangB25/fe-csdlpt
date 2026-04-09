export const VEHICLE_RATES = {
  BIKE: { id: 'BIKE', base: 5000, per_km: 5000, name: 'Xe máy', icon: 'two_wheeler', color: '#0db9f2' },
  CAR: { id: 'CAR', base: 10000, per_km: 10000, name: 'Ô tô 4 chỗ', icon: 'directions_car', color: '#10b981' },
  PREMIUM: { id: 'PREMIUM', base: 15000, per_km: 14000, name: 'Ô tô 7 chỗ', icon: 'airport_shuttle', color: '#f97316' },
}

export const ROAD_FACTOR = 1.3

export const REGIONS = {
  NORTH: {
    name: 'Miền Bắc',
    city: 'Hà Nội',
    center: [21.0285, 105.8542], // Hoan Kiem
    zoom: 13,
  },
  SOUTH: {
    name: 'Miền Nam',
    city: 'Hồ Chí Minh',
    center: [10.7769, 106.7009], // District 1
    zoom: 13,
  }
}

export const SURCHARGE_RULES = {
  LONG_DISTANCE_THRESHOLD: 10,
  LONG_DISTANCE_FEE: 10000,
  SHORT_DISTANCE_FEE: 5000,
}

export const roundPrice = (price) => {
  return Math.round(price / 1000) * 1000
}

export const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
