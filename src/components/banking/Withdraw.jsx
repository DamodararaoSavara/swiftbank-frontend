import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import styles from "./Transaction.module.css";
import { toast } from "react-toastify";

const Withdraw = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("Enter valid withdrawal amount");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/account/${accountId}/withdraw`, {
        amount: Number(amount),
      });

      toast.success("Withdrawal successful");
      navigate(`/account/${accountId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Insufficient balance");
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
      <form className={styles.card} onSubmit={handleWithdraw}>
        <button
          className="back-btn"
          onClick={handleBack}
          aria-label="Go back to login"
          type="button"
        >
          ❮ Back
        </button>
        <h2 className={styles.title}>Withdraw Amount</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className={styles.input}
        />

        <button
          className={`${styles.btn} ${styles.withdraw}`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Withdraw"}
        </button>
      </form>
    </div>
  );
};

export default Withdraw;
