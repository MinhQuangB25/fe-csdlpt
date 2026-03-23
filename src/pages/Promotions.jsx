import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Promotions.css";

export default function Promotions() {
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  // ✅ MOCK DATA (chuẩn backend)
  const coupons = [
    {
      id: 1,
      code: "GOIXE50",
      discount_type: "PERCENT", // PERCENT | FIXED
      discount_value: 50,
      max_discount: 50000,
      min_order: 0,
      expiry_date: "2026-03-30T23:59:59"
    },
    {
      id: 2,
      code: "FREESHIP",
      discount_type: "FIXED",
      discount_value: 30000,
      max_discount: 30000,
      min_order: 0,
      expiry_date: "2026-03-28T23:59:59"
    },
    {
      id: 3,
      code: "SAVE20",
      discount_type: "PERCENT",
      discount_value: 20,
      max_discount: 30000,
      min_order: 50000,
      expiry_date: "2026-03-20T23:59:59"
    },
    {
      id: 4,
      code: "WELCOME10",
      discount_type: "PERCENT",
      discount_value: 10,
      max_discount: null,
      min_order: 0,
      expiry_date: "2026-03-25T23:59:59"
    }
  ];

  // ✅ CHECK EXPIRED REAL-TIME
  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  // ✅ COPY
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setToast(`Đã sao chép: ${code}`);
    setTimeout(() => setToast(""), 2000);
  };

  // ✅ FORMAT UI
  const formatDesc = (c) => {
    if (c.discount_type === "PERCENT") {
      return `Giảm ${c.discount_value}%`;
    }
    return `Giảm ${c.discount_value.toLocaleString()}đ`;
  };

  const formatCondition = (c) => {
    if (c.max_discount) {
      return `Tối đa ${c.max_discount.toLocaleString()}đ`;
    }
    return "Không giới hạn";
  };

  return (
    <div className="page promotions-page">

      {/* HEADER */}
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h3>Khuyến mãi</h3>
      </div>

      <div className="page-content">

        {/* BANNER */}
        <div className="promo-banner">
          🎉 Ưu đãi dành riêng cho bạn
        </div>

        {/* LIST */}
        <div className="promo-list">
          {coupons.map((c) => {
            const expired = isExpired(c.expiry_date);

            return (
              <div
                key={c.id}
                className={`promo-card card ${
                  expired ? "expired" : ""
                }`}
              >
                <div className="promo-top">
                  <span className="promo-code">{c.code}</span>

                  {expired && (
                    <span className="badge badge-red">
                      Hết hạn
                    </span>
                  )}
                </div>

                <div className="promo-desc">
                  {formatDesc(c)}
                </div>

                <div className="promo-condition">
                  {formatCondition(c)}
                </div>

                <div className="promo-exp">
                  HSD:{" "}
                  {new Date(c.expiry_date).toLocaleDateString()}
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleCopy(c.code)}
                  disabled={expired}
                >
                  Sao chép mã
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}