# 🚕 GoiXe - Ride Hailing Frontend

Frontend React cho ứng dụng gọi xe phân tán theo vị trí.

## 🚀 Quick Start

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình Backend URL
```bash
# .env file đã được tạo sẵn
# Mặc định: VITE_API_URL=http://localhost:8000
```

### 3. Chạy development server
```bash
npm run dev
```

Ứng dụng chạy tại: **http://localhost:5173**

## 📚 Tài liệu

- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Chi tiết tích hợp Backend API
- **[../Ride-Hailing-Project/DOCKER_QUICKSTART.md](../Ride-Hailing-Project/DOCKER_QUICKSTART.md)** - Hướng dẫn chạy toàn bộ hệ thống với Docker

## 🔌 Backend API

Frontend đã được tích hợp với Backend FastAPI:

- ✅ Login API (`POST /login`)
- ✅ Book Trip API (`POST /book-trip`)
- ✅ Trip History API (`POST /trip-history`)

## 🧪 Test với Mock Users

**Miền Bắc:**
- Phone: `912000001`
- Khu vực: Miền Bắc

**Miền Nam:**
- Phone: `913000001`
- Khu vực: Miền Nam

## 🛠 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **Fetch API** - HTTP requests

## 📦 Project Structure

```
src/
├── services/
│   └── api.js              # API service
├── context/
│   └── UserContext.jsx     # User state management
├── pages/
│   ├── Login.jsx           # Login page with API
│   ├── Booking.jsx         # Booking page with API
│   └── History.jsx         # History page with API
└── components/
    └── BottomNav.jsx       # Bottom navigation
```

## 🧑‍💻 Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Full System Setup

Để chạy đầy đủ hệ thống (Database + Backend + Frontend):

```bash
# 1. Start Database + Backend với Docker
cd ../Ride-Hailing-Project
docker compose up -d

# 2. Setup replication (lần đầu tiên)
bash scripts/00-setup-replication.sh

# 3. Start Frontend
cd ../goixe
npm run dev
```

## 📝 Features

- ✅ User authentication
- ✅ Region-based routing (North/South)
- ✅ Vehicle selection (Bike, 4-seat car, 7-seat car)
- ✅ Trip booking
- ✅ Trip history
- ✅ Real-time error handling
- ✅ Loading states
- ✅ LocalStorage persistence

## 🔗 Related Projects

- [Backend FastAPI](../Ride-Hailing-Project/backend/)
- [Database Infrastructure](../Ride-Hailing-Project/)

## 📄 License

Private project for educational purposes.

