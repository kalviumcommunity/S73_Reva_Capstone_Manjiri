import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";
import "./Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe().then((res) => setUser(res.data.data));
  }, []);

  return (
    <div className="dashboard">
      <h2>Welcome to Manjiri, {user ? user.fullName : "Guest"}!</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Documents: 24</p>
        </div>
        <div className="stat-card">
          <p>Upcoming Events: 5</p>
        </div>
        <div className="stat-card">
          <p>Active Users: 12</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
