import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import styles from "./AccountDetails.module.css";
import { PlusCircle, MinusCircle, ArrowLeftRight, History } from "lucide-react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import AccountDetailsSkeleton from "./AccountDetailsSkeleton";

const AccountDetails = () => {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const location = useLocation();
  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const isInactive = account?.accountStatus !== "ACTIVE";
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
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
  }, [accountId]);

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
  if (!account) return <AccountDetailsSkeleton />;

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
        <span
          className={`${styles.status} ${
            account.accountStatus === "ACTIVE" ? styles.active : styles.inactive
          }`}
        >
          {account.accountStatus}
        </span>
      </div>

      <div className={styles.balanceCard}>
        <span>Available Balance</span>
        <div className={styles.balanceAmount}>₹ {account.balance}</div>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span>Account ID </span>
          <strong>{account.accountId}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Username </span>
          <strong>{account.username}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Email </span>
          <strong>{account.email}</strong>
        </div>

        <div className={styles.infoItem}>
          <span>Account Type </span>
          <strong>{account.accountType}</strong>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionBtn} ${styles.deposit}`}
          onClick={handleDeposit}
          disabled={isInactive}
        >
          <PlusCircle size={18} />
          Deposit
        </button>

        <button
          className={`${styles.actionBtn} ${styles.withdraw}`}
          onClick={handleWithdraw}
          disabled={isInactive}
        >
          <MinusCircle size={18} />
          Withdraw
        </button>

        <button
          className={`${styles.actionBtn} ${styles.transfer}`}
          onClick={handleTransfer}
          disabled={isInactive}
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
