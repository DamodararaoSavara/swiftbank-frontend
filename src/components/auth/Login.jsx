import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";

const LOGIN_URL = "/auth/login";
const CHECK_EMAIL_URL = "/auth/is-email-verified";

export default function Login({ onLogin }) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ===================== VALIDATION ===================== */
  const validateForm = () => {
    if (!usernameOrEmail.trim()) {
      toast.error("Username or Email is required");
      //setError("Username or Email is required");
      return false;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      //setError("Password is required");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  /* ===================== LOGIN ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await api.post(LOGIN_URL, {
        usernameOrEmail,
        password,
      });

      const { token, roles, userId } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem("userId", userId);

      if (onLogin) onLogin();

      if (roles.includes("ADMIN")) {
        navigate("/dashboard");
      } else {
        navigate(`/account/${userId}`);
      }
    } catch (error) {
      const status = error.response?.status;
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";

      /* 🔒 BLOCKED ACCOUNT */
      if (status === 403 && msg.toLowerCase().includes("blocked")) {
        toast.error("Your account is blocked. Please contact support.");
        //setError("Your account is blocked. Please contact support.");
        return;
      }

      /* 📩 EMAIL NOT VERIFIED */
      if (
        status === 401 ||
        (status === 400 && msg.toLowerCase().includes("not verified")) ||
        msg.toLowerCase().includes("not activated.")
      ) {
        toast.error(msg);
        //setError("Email not verified. Please verify OTP.");

        // store email for OTP screen
        localStorage.setItem("otpEmail", usernameOrEmail);

        setTimeout(() => {
          navigate("/verify-otp");
        }, 3000);
        return;
      }
      /* ❌ INVALID CREDENTIALS */
      if (msg.toLowerCase().includes("bad credentials")) {
        toast.error("Invalid email or password");
      } else {
        toast.error(msg);
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = usernameOrEmail;
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      const res = await api.get(CHECK_EMAIL_URL, {
        params: { email },
      });
      if (res.data.verified) {
        navigate("/forgot-password", { state: { email } });
      } else {
        toast.error("Email is not verified. Please verify your email first.");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    }
  };

  /* ===================== UI ===================== */
  return (
    <div className="gradient-bg">
      <div className="login-card">
        <h2 style={{ color: "blue" }}>Welcome to SBI</h2>
        <h3>Securely access your account</h3>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <p className="register-link">
            <span onClick={handleForgotPassword}>Forgot Password?</span>
          </p>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* <p className="divider">Or Sign Up Using</p>

        <div className="social-row">
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
            alt="Facebook"
            onClick={() =>
              (window.location.href = "https://www.facebook.com/login.php/")
            }
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
            alt="Twitter"
            onClick={() =>
              (window.location.href = "https://x.com/i/flow/login")
            }
          />
          <img
            src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
            alt="Google"
            onClick={() =>
              (window.location.href =
                "https://accounts.google.com/signin/v2/usernamerecovery?flowName=GlifWebSignIn&flowEntry=ServiceLogin")
            }
          />
        </div> */}

        <p className="register-link">
          Create account?
          <span onClick={() => navigate("/bank-registration")}>
            👉 Create one
          </span>
        </p>

        <p className="register-link">
          Already registered but not verified 👉
          <span onClick={() => navigate("/verify-otp")}> Verify with OTP</span>
        </p>
      </div>
    </div>
  );
}
