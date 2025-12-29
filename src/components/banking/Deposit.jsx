import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Transaction.module.css";
import { toast } from "react-toastify";

const Deposit = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Enter valid deposit amount");
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/account/${accountId}/deposit`, {
        amount: Number(amount),
      });
      toast.success("Deposit successful");
      navigate(`/account/${accountId}`, {
        state: { updatedAccount: response.data },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };
  //   Go back button=======================
  const handleBack = () => {
    navigate(`/account/${accountId}`);
  };
  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleDeposit}>
        <button
          className="back-btn"
          onClick={handleBack}
          aria-label="Go back to login"
          type="button"
        >
          ❮ Back
        </button>
        <h2 className={styles.title}>Deposit Amount</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />

        <button
          className={`${styles.btn} ${styles.deposit}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Deposit"}
        </button>
      </form>
    </div>
  );
};

export default Deposit;
