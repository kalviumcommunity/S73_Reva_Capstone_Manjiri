import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1>Welcome 👋</h1>

      <div className="landing-box">
        <p>New user?</p>
        <button onClick={() => navigate("/register")}>
          Register
        </button>
        <p style={{ marginTop: "8px" }}>
          Already registered? You’ll login after this.
        </p>
      </div>

      <div className="landing-box">
        <p>Existing user?</p>
        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Landing;