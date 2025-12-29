import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      toast.success("OTP sent to your email");
      localStorage.setItem("forgotEmail", email);

      navigate("/forgot-verify-otp");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };
  //   Go back button=======================
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="auth-container">
      <div className="auth-card">
        <button
          className="back-btn"
          onClick={handleBack}
          aria-label="Go back to login"
          type="button"
        >
          ❮ Back
        </button>
        <h2>Forgot Password</h2>
        <p>Enter your registered email</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
