import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./History.css";
import BottomNav from "./BottomNav";

export default function History() {
  const navigate = useNavigate();

  // ✅ FILTER ENUM (match backend)
  const [filter, setFilter] = useState("ALL");

  // ✅ MOCK DATA (chuẩn DB)
  const trips = [
    {
      id: 1,
      user_id: 1,
      distance_km: 8,
      fare_amount: 120000,
      status: "COMPLETED",
      start_time: "2026-03-22T14:30:00"
    },
    {
      id: 2,
      user_id: 1,
      distance_km: 5,
      fare_amount: 50000,
      status: "CANCELLED",
      start_time: "2026-03-21T09:10:00"
    },
    {
      id: 3,
      user_id: 1,
      distance_km: 7,
      fare_amount: 90000,
      status: "COMPLETED",
      start_time: "2026-03-20T18:00:00"
    },
    {
      id: 4,
      user_id: 1,
      distance_km: 3,
      fare_amount: 40000,
      status: "COMPLETED",
      start_time: "2026-03-19T11:45:00"
    },
    {
      id: 5,
      user_id: 1,
      distance_km: 10,
      fare_amount: 150000,
      status: "CANCELLED",
      start_time: "2026-03-18T06:30:00"
    }
  ];

  // ✅ FILTER LOGIC
  const filteredTrips =
  
    filter === "ALL"
      ? trips
      : trips.filter((t) => t.status === filter);

  // ✅ STATS
  const totalTrips = trips.length;

  const totalKm = trips.reduce(
    (sum, t) => sum + t.distance_km,
    0
  );

  const totalMoney = trips
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + t.fare_amount, 0);

  // ✅ MAP STATUS -> UI
  const statusMap = {
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy"
  };

  return (
    <div className="page history-page">

      {/* HEADER */}
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h3>Lịch sử chuyến đi</h3>
      </div>

      <div className="page-content">

        {/* STATS */}
        <div className="history-stats card">
          <div>
            <p>Tổng chuyến</p>
            <h3>{totalTrips}</h3>
          </div>
          <div>
            <p>Tổng km</p>
            <h3>{totalKm}</h3>
          </div>
          <div>
            <p>Chi phí</p>
            <h3>{totalMoney.toLocaleString()}đ</h3>
          </div>
        </div>

        {/* FILTER */}
        <div className="history-filter">
          {[
            { key: "ALL", label: "Tất cả" },
            { key: "COMPLETED", label: "Hoàn thành" },
            { key: "CANCELLED", label: "Đã hủy" }
          ].map((f) => (
            <button
              key={f.key}
              className={`filter-chip ${
                filter === f.key ? "active" : ""
              }`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="history-list">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="history-item card">

              {/* TOP */}
              <div className="history-top">
                <div className="trip-type">🚗</div>

                <div className="trip-info">
                  <div className="trip-route">
                    {trip.distance_km} km
                  </div>

                  <div className="trip-date">
                    {new Date(trip.start_time).toLocaleString()}
                  </div>
                </div>

                <div className="trip-price">
                  {trip.fare_amount.toLocaleString()}đ
                </div>
              </div>

              {/* BOTTOM */}
              <div className="history-bottom">
                <span
                  className={`badge ${
                    trip.status === "COMPLETED"
                      ? "badge-green"
                      : "badge-red"
                  }`}
                >
                  {statusMap[trip.status]}
                </span>

                <div className="trip-actions">
                  <button className="btn-sm btn-outline">
                    Xem chi tiết
                  </button>

                  <button className="btn-sm btn-primary">
                    Đặt lại
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}