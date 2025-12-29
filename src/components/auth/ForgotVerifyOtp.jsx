import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const OTP_LENGTH = 6;

export default function ForgotVerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("forgotEmail");

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-forgot-otp", {
        email,
        otp,
      });

      toast.success("OTP verified");
      navigate("/reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP</h2>
        <p>OTP sent to {email}</p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter OTP"
        />

        <button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}
