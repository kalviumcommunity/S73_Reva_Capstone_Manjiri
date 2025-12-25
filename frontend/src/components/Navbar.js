import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">Manjiri</div>
            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/documents">Documents</Link>
                <Link to="/events">Events</Link>
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;