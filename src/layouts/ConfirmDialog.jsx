import "./ConfirmDialog.css";

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="confirm-backdrop">
      <div className="confirm-box">
        <h3>{title}</h3>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
