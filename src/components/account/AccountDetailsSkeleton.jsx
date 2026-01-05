import styles from "./AccountDetails.module.css";

const AccountDetailsSkeleton = () => {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonBalance} />

      <div className={styles.skeletonGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>

      <div className={styles.skeletonActions}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeletonButton} />
        ))}
      </div>
    </div>
  );
};

export default AccountDetailsSkeleton;
