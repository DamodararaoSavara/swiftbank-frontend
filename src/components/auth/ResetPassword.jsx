import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("forgotEmail");

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const handleReset = async () => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])(?!.*\s).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return toast.error(
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters"
      );
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/reset-password", {
        email,
        newPassword: password,
        confirmPassword, // ✅ send to backend
      });

      toast.success("Password reset successful");

      localStorage.removeItem("forgotEmail");
      navigate("/login");
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.response?.data || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleReset} disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
