import React, { useEffect, useState } from "react";
import { getMe } from "../api/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getMe().then((res) => setUser(res.data.data));
  }, []);

  return (
    <div>
      <h2>Welcome to Manjiri, {user ? user.fullName : "Guest"}!</h2>

      <div>
        <p>Total Documents: 24</p>
        <p>Upcoming Events: 5</p>
        <p>Active Users: 12</p>
      </div>
    </div>
  );
};

export default Dashboard;
