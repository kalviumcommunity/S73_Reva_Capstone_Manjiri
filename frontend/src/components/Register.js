import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "student"
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await registerUser(form);
    localStorage.setItem("token", res.data.token);

    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="fullName" placeholder="Full Name" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
