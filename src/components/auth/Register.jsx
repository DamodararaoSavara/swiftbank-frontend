import { useState } from "react";
import axios from "../../api/axios";

const REGISTER_URL = "/api/account";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({
          name,
          username,
          email,
          password,
          accountType,
          balance,
        })
      );

      setMsg("Registration successful! You can now login.");
    } catch (err) {
      setMsg("Registration failed. Try again!");
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>

      {msg && <p>{msg}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
