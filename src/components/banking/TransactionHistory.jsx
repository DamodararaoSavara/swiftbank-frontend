import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import styles from "./TransactionHistory.module.css";
import { toast } from "react-toastify";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const formatDateTime = (dateTime) => {
    const d = new Date(dateTime);
    return d
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  useEffect(() => {
    api
      .get(`/account/${accountId}/transactions`)
      .then((res) => setTransactions(res.data))
      .catch(() => toast.error("Failed to load transactions"));
  }, [accountId]);

  //   Go back button=======================
  const handleBack = () => {
    navigate(`/account/${accountId}`);
  };
  return (
    <div className={styles.container}>
      <button
        className="back-btn"
        onClick={handleBack}
        aria-label="Go back to login"
        type="button"
      >
        ❮ Back
      </button>
      <h2>Transaction History</h2>

      <table>
        <thead>
          <tr>
            <th>Account Id</th>
            <th>Transaction Type</th>
            <th>Balance</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.accountId}>
              <td>{tx.accountId}</td>
              <td>{tx.transactionType}</td>
              <td>₹ {tx.amount}</td>
              <td>{formatDateTime(tx.dateTimeStamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
