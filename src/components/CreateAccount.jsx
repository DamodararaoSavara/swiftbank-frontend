import { useState } from "react";
import api from "../api/axios";
import "./CreateAccount.css"; // or use module if preferred
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    accountType: "SAVINGS",
    balance: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/account", formData);
      const accountId = response.data.id;
      navigate(`/account/${accountId}`);
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        accountType: "SAVINGS",
        balance: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create account");
    }
  };

  return (
    <div className="accountPageWrapper">
      <div className="accountFormContainer">
        <h2>Create New Account</h2>

        <form onSubmit={handleSubmit} className="accountForm">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
          >
            <option value="SAVINGS">SAVINGS</option>
            <option value="CURRENT">CURRENT</option>
          </select>

          <input
            type="number"
            name="balance"
            placeholder="Initial Balance"
            value={formData.balance}
            onChange={handleChange}
            required
          />

          <button type="submit">Create Account</button>
          <p className="register-link">
            Already have an account? then login here
            <span onClick={() => navigate("/login")}> Login</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
