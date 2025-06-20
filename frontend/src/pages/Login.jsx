import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./style.css";

const Login = () => {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [mailError, setMailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setMailError("");
    setPasswordError("");
    setMessage("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (formData.email.trim() === "" && formData.password.trim() === "") {
      setMailError("Email is required");
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }
    if (formData.email.trim() === "" && formData.password.trim() !== "") {
      setMailError("Email is required");
      setLoading(false);
      return;
    }
    if (formData.email.trim() !== "" && formData.password.trim() === "") {
      setPasswordError("Password is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setMailError("Enter a valid email address");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setPasswordError("Minimum length must be six");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/api/user/login",
        formData
      );
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message);
      setFormData({ email: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response.data.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="login-container">
      <div className="login-box">
        <p className="login-title">SIGN IN</p>
        <div className="avatar">
           <FaUserCircle />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">
              <FaUser className="input-icon" />
            </label>
            <input
              type="text"
              placeholder="email"
              name="email"
              id="email"
              onChange={handleChange}
              value={formData.email}
              disabled={loading}
            />
          </div>
          <p className="error-msg">{mailError || "\u00A0"}</p>

          <div className="input-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
            </label>
            <input
              type="password"
              placeholder="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <p className="error-msg">{passwordError || "\u00A0"}</p>

          <div className="form-message">{message && <p>{message}</p>}</div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
