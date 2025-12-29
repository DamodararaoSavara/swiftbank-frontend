import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "./VerifyOtp.css";

const OTP_LENGTH = 6;
const TIMER_SECONDS = 90;

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const inputsRef = useRef([]);
  const autoSubmitRef = useRef(false);
  const navigate = useNavigate();

  /* ===================== VALIDATION ===================== */
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isValidOtp = () =>
    otp.every((d) => d !== "") && otp.join("").length === OTP_LENGTH;

  /* ===================== TIMER ===================== */
  const startTimer = () => setTimer(TIMER_SECONDS);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  /* ===================== BLOCKED EMAIL CHECK ===================== */
  useEffect(() => {
    const blockedEmail = localStorage.getItem("otpBlockedEmail");
    if (blockedEmail && blockedEmail === email) {
      setIsBlocked(true);
      setResendDisabled(true);
    }
  }, [email]);

  /* ===================== AUTO FOCUS ===================== */
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  /* ===================== AUTO VERIFY OTP ===================== */
  useEffect(() => {
    if (!isValidOtp()) return;
    if (!isValidEmail(email)) return;
    if (loading || isBlocked) return;
    if (autoSubmitRef.current) return;

    autoSubmitRef.current = true;
    submitOtp();
  }, [otp]);

  /* ===================== OTP INPUT ===================== */
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    autoSubmitRef.current = false;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasted.length === OTP_LENGTH) {
      setOtp(pasted.split(""));
      inputsRef.current[OTP_LENGTH - 1]?.focus();
    }
  };

  /* ===================== BACK ===================== */
  const handleBack = () => {
    if (otp.some((d) => d !== "")) {
      const confirmLeave = window.confirm(
        "OTP is not verified yet. Do you want to go back?"
      );
      if (!confirmLeave) return;
    }

    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(0);
    setResendDisabled(false);
    localStorage.removeItem("otpBlockedEmail");
    navigate("/login");
  };

  /* ===================== VERIFY OTP ===================== */
  const submitOtp = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-otp", {
        email,
        otp: otp.join(""),
      });

      toast.success("Account verified successfully");
      navigate("/login");
    } catch (error) {
      const status = error.response?.status;
      const msg =
        error.response?.data?.message || error.response?.data || "Invalid OTP";

      toast.error(msg);

      if (
        status === 403 ||
        status === 423 ||
        msg.toLowerCase().includes("blocked")
      ) {
        setIsBlocked(true);
        setResendDisabled(true);
        setTimer(0);
        localStorage.setItem("otpBlockedEmail", email);
      }
    } finally {
      autoSubmitRef.current = false;
      setTimeout(() => setLoading(false), 3000);
    }
  };

  /* ===================== RESEND OTP ===================== */
  const resendOtp = async () => {
    if (isBlocked) {
      toast.error("This email is blocked. Please contact support.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent successfully");
      setOtp(Array(OTP_LENGTH).fill(""));
      autoSubmitRef.current = false;
      startTimer();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  /* ===================== TIMER FORMAT ===================== */
  const formatTime = () => {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  /* ===================== UI ===================== */
  return (
    <div className="otp-container">
      <div className="otp-card">
        <button className="back-btn" onClick={handleBack} type="button">
          ❮ Back
        </button>

        <h2>OTP Verification</h2>
        <p>Enter the OTP sent to your email</p>

        <input
          type="email"
          placeholder="Email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>

        <button
          onClick={submitOtp}
          disabled={loading || isBlocked || !isValidOtp()}
        >
          {isBlocked
            ? "Account Blocked"
            : loading
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        {timer > 0 ? (
          <p className="timer">Resend OTP in {formatTime()}</p>
        ) : (
          !isBlocked && (
            <span className="resend" onClick={resendOtp}>
              Resend OTP
            </span>
          )
        )}

        {isBlocked && (
          <p className="blocked-msg">
            🚫 This email is temporarily blocked due to multiple invalid OTP
            attempts.
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
