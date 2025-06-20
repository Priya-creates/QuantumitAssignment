import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:3000/api/user/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setUser(res.data.data.name); 
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <h2>Welcome {user || "User"} 🎉</h2>
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0e1a2b",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
  },
  button: {
    background: "#00f3ff",
    color: "#0e1a2b",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
};
