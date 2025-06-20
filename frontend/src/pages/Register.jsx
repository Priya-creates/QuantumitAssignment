import React from "react";
import { FaUser, FaLock, FaUserCircle } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Register = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    dob: "",
    password: "",
  });

  const [nameError, setNameError] = React.useState("");
  const [mailError, setMailError] = React.useState("");
  const [dobError, setDobError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setNameError("");
    if (name === "email") setMailError("");
    if (name === "dob") setDobError("");
    if (name === "password") setPasswordError("");
    setMessage("");

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name.trim()) setNameError("Name is required");
    if (!formData.email.trim()) setMailError("Email is required");
    if (!formData.dob.trim()) setDobError("Date of birth is required");
    if (!formData.password.trim()) setPasswordError("Password is required");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.dob.trim() ||
      !formData.password.trim()
    ) {
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMailError("Enter a valid email address");
      setLoading(false);
      return;
    }

    if (new Date(formData.dob) >= new Date()) {
      setDobError("Date of birth must be in the past");
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
        "http://localhost:3000/api/user/register",
        formData
      );
      setMessage(res.data.message);
      setFormData({ name: "", email: "", dob: "", password: "" });
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <p className="login-title">REGISTER</p>
        <div className="avatar">
          <FaUserCircle />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">
              <FaUser className="input-icon" />
            </label>
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <p className="error-msg">{nameError || "\u00A0"}</p>

          <div className="input-group">
            <label htmlFor="email">
              <FaUser className="input-icon" />
            </label>
            <input
              type="email"
              placeholder="Email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <p className="error-msg">{mailError || "\u00A0"}</p>

          <div className="input-group">
            <label htmlFor="dob">
              <FaCalendarAlt className="input-icon" />
            </label>
            <input
              type="date"
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={loading}
              placeholder="Date of birth"
            />
          </div>
          <p className="error-msg">{dobError || "\u00A0"}</p>

          <div className="input-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
            </label>
            <input
              type="password"
              placeholder="Password"
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
            {loading ? "Registering..." : "REGISTER"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
