import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const fetchAccounts = async () => {
    try {
      const response = await api.get("/account");
      setAccounts(response.data);
    } catch (error) {
      const status = error.response?.status;
      const msg = error.response?.data?.message || "Failed to load accounts";
      if (status === 401 || status === 403) return;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const blockAccount = async (accountId) => {
    try {
      await api.put(`/admin/block/${accountId}`);
      toast.success("Account blocked");
      fetchAccounts();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to block account";
      toast.error(msg);
    }
  };

  const unblockAccount = async (accountId) => {
    try {
      await api.put(`/admin/unblock/${accountId}`);
      toast.success("Account unlocked");
      fetchAccounts();
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to unlock account";
      toast.error(msg);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Admin Dashboard – Accounts</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Account Id</th>
            <th>User</th>
            <th>Email</th>
            <th>Balance</th>
            <th>Type</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {accounts.map((acc) => {
            const blocked =
              acc.accountLocked || acc.accountStatus === "BLOCKED";

            return (
              <tr
                key={acc.accountId}
                className={blocked ? styles.blockedRow : ""}
              >
                <td>{acc.accountId}</td>
                <td>{acc.username}</td>
                <td>{acc.email}</td>
                <td>₹{acc.balance}</td>
                <td>{acc.accountType}</td>

                <td>
                  <span
                    className={
                      blocked ? styles.badgeBlocked : styles.badgeActive
                    }
                  >
                    {acc.accountStatus}
                  </span>
                </td>

                <td>{formatDateTime(acc.createdAt)}</td>

                <td className={styles.actions}>
                  <button
                    className={styles.view}
                    disabled={blocked}
                    onClick={() => navigate(`/account/${acc.accountId}`)}
                  >
                    View
                  </button>

                  {blocked ? (
                    <button
                      className={styles.unblock}
                      onClick={() => unblockAccount(acc.accountId)}
                    >
                      Unlock
                    </button>
                  ) : (
                    <button
                      className={styles.block}
                      onClick={() => blockAccount(acc.accountId)}
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
