import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const userId = localStorage.getItem("userId");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div
        className="navbar-left"
        onClick={() => navigate(`/account/${userId}`)}
      >
        🏦 <span>SwiftBank</span>
      </div>

      {/* CENTER */}
      <ul className="navbar-links">
        {roles.includes("ADMIN") && (
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
        )}

        {!roles.includes("ADMIN") && userId && (
          <li onClick={() => navigate(`/account/${userId}`)}>My Account</li>
        )}

        <li onClick={() => navigate(`/account/${userId}`)}>Transfer</li>
      </ul>

      {/* RIGHT */}
      <div className="navbar-right">
        <button className="logout-btn" onClick={() => setShowConfirm(true)}>
          Logout
        </button>
      </div>
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onCancel={() => setShowConfirm(false)}
        onConfirm={logout}
      />
    </nav>
  );
};

export default Navbar;
