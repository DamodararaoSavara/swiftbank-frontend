import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import styles from "./Transfer.module.css";

const Transfer = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔑 Keep same requestId for whole transfer
  const [requestId] = useState(crypto.randomUUID());

  // 1️⃣ Send OTP
  const handleSendOtp = async () => {
    if (!toAccountId || Number(amount) <= 0) {
      toast.error("Enter valid account and amount first");
      return;
    }
    if (Number(toAccountId) === Number(accountId)) {
      toast.error("Cannot transfer to same account");
      return;
    }
    try {
      setLoading(true);

      // 🔍 Validate recipient account
      await api.post(
        `/account/${accountId}/transfer`,
        {
          toAccountId: Number(toAccountId),
          amount: Number(amount),
          otp: otp,
        },
        {
          headers: {
            "X-Request-Id": requestId,
          },
        }
      );
      await api.post(`/account/${accountId}/transfer/otp`);

      toast.success("OTP sent successfully 📩");
      setOtpSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Confirm Transfer
  const handleTransfer = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      await api.post(
        `/account/${accountId}/transfer`,
        {
          toAccountId: Number(toAccountId),
          amount: Number(amount),
          otp: otp,
        },
        {
          headers: {
            "X-Request-Id": requestId,
          },
        }
      );

      toast.success("Transfer successful 💸");
      navigate(`/account/${accountId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };
  //   Go back button=======================
  const handleBack = () => {
    navigate(`/account/${accountId}`);
  };
  return (
    <div className={styles.transferContainer}>
      <h2>Transfer Funds</h2>

      <form onSubmit={handleTransfer} className={styles.form}>
        <div className={styles.field}>
          <label>From Account</label>
          <input type="text" value={accountId} disabled />
        </div>

        <div className={styles.field}>
          <label>To Account ID</label>
          <input
            type="number"
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            placeholder="Enter recipient account ID"
            disabled={otpSent}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Amount</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={otpSent}
            required
          />
        </div>

        {!otpSent && (
          <button type="button" onClick={handleSendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        )}

        {otpSent && (
          <>
            <div className={styles.field}>
              <label>Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit OTP"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Confirm Transfer"}
            </button>
          </>
        )}
        <button
          className="back-btn"
          onClick={handleBack}
          aria-label="Go back to login"
          type="button"
        >
          ❮ Back
        </button>
      </form>
    </div>
  );
};

export default Transfer;
