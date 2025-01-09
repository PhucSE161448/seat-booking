import React, { useState } from "react";
import "./login.css"; // Import file CSS
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState("1");
  const navigate = useNavigate(); // Khai báo useNavigate

  const handleLogin = (e) => {
    e.preventDefault();

    // Kiểm tra email và password
    if (email === "123" && password === "123") {
      // Điều hướng qua trang Home
      if (batch === "1") {
        navigate("/", { state: { role: "admin", batch: "1" } });
      } else if (batch === "2") {
        navigate("/show2", { state: { role: "admin", batch: "2" } });
      }
    } else {
      alert("Email hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <select
            className="login-select"
            value={batch}
            onChange={(e) => setBatch(e.target.value)} // Cập nhật state batch
          >
            <option value="1">Đợt 1</option>
            <option value="2">Đợt 2</option>
          </select>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
