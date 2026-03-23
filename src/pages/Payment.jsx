import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

export default function Payment() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("cash");
  const [toast, setToast] = useState("");

  const methods = [
    {
      id: "cash",
      icon: "💵",
      name: "Tiền mặt",
      desc: "Thanh toán trực tiếp cho tài xế",
    },
    {
      id: "wallet",
      icon: "👛",
      name: "Ví GoiXe",
      desc: "Thanh toán bằng số dư ví",
    },
    {
      id: "momo",
      icon: "📱",
      name: "MoMo",
      desc: "Ví điện tử MoMo",
    },
    {
      id: "zalopay",
      icon: "💳",
      name: "ZaloPay",
      desc: "Thanh toán qua ZaloPay",
    },
    {
      id: "vnpay",
      icon: "🏦",
      name: "VNPay",
      desc: "Cổng thanh toán ngân hàng",
    },
  ];

  const quickAmounts = [50000, 100000, 200000, 500000];

  const handleTopup = (amount) => {
    setToast(`Nạp ${amount.toLocaleString()}đ thành công`);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="page payment-page">

      {/* HEADER */}
      <div className="page-header">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <h3>Phương thức thanh toán</h3>
      </div>

      <div className="page-content">

        {/* LIST PAYMENT */}
        <div className="payment-list">
          {methods.map((m) => (
            <div
              key={m.id}
              className={`payment-item card ${
                selected === m.id ? "active" : ""
              }`}
              onClick={() => setSelected(m.id)}
            >
              <div className="payment-left">
                <div className="payment-icon">{m.icon}</div>
                <div>
                  <div className="payment-name">{m.name}</div>
                  <div className="payment-desc">{m.desc}</div>
                </div>
              </div>

              <input
                type="radio"
                checked={selected === m.id}
                onChange={() => setSelected(m.id)}
              />
            </div>
          ))}
        </div>

        {/* WALLET TOPUP */}
        <div className="wallet-section card">
          <h3>Nạp ví GoiXe</h3>

          <div className="wallet-grid">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                className="wallet-btn"
                onClick={() => handleTopup(amount)}
              >
                {amount / 1000}K
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}