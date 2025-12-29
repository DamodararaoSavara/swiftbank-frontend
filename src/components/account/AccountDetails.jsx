import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import styles from "./AccountDetails.module.css";
import { PlusCircle, MinusCircle, ArrowLeftRight, History } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

const AccountDetails = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const location = useLocation();
  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  useEffect(() => {
    if (location.state?.updatedAccount) {
      setAccount(location.state.updatedAccount);
      return;
    }
    const fetchAccount = async () => {
      try {
        const response = await api.get(`/account/${accountId}`);
        setAccount(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    };
    fetchAccount();
  }, [accountId, location.state]);

  const handleDeposit = () => {
    navigate(`/account/${accountId}/deposit`);
  };

  const handleWithdraw = () => {
    navigate(`/account/${accountId}/withdraw`);
  };

  const handleTransfer = () => {
    navigate(`/account/${accountId}/transfer`);
  };
  const handleTransactionHistory = () => {
    navigate(`/account/${accountId}/transactions`);
  };
  //   Go back button=======================
  const handleBack = () => {
    navigate("/dashboard");
  };
  if (!account) return <p>Loading...</p>;

  return (
    <div className={styles.detailsContainer}>
      {roles.includes("ADMIN") && (
        <button
          className="back-btn"
          onClick={handleBack}
          aria-label="Go back to login"
          type="button"
        >
          ❮ Back
        </button>
      )}
      <div className={styles.header}>
        <h2 className={styles.title}>Account Details</h2>
        <span className={styles.status}>{account.accountStatus}</span>
      </div>

      <div className={styles.balanceCard}>
        <span>Available Balance</span>
        <div className={styles.balanceAmount}>₹ {account.balance}</div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span>Account ID</span>
          <strong>{account.accountId}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Username</span>
          <strong>{account.username}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Email</span>
          <strong>{account.email}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Account Type</span>
          <strong>{account.accountType}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.deposit}`}
          onClick={handleDeposit}
        >
          <PlusCircle size={18} />
          Deposit
        </button>

        <button
          className={`${styles.actionBtn} ${styles.withdraw}`}
          onClick={handleWithdraw}
        >
          <MinusCircle size={18} />
          Withdraw
        </button>

        <button
          className={`${styles.actionBtn} ${styles.transfer}`}
          onClick={handleTransfer}
        >
          <ArrowLeftRight size={18} />
          Transfer
        </button>
        <button
          className={`${styles.actionBtn} ${styles.history}`}
          onClick={handleTransactionHistory}
        >
          <History size={18} />
          Transactions
        </button>
      </div>
    </div>
  );
};

export default AccountDetails;
