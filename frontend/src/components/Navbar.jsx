import React from "react";
import "../styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/Tripago_VX.png";
import backArrow from "../assets/arrow-left.png";
import fav from "../assets/favicon.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isBrowseHotelsPage = location.pathname === "/browse-hotels";

  return (
    <nav className="navbar">
      {isBrowseHotelsPage ? (
        <div className="browse-hotels-nav">
          <img
            src={backArrow}
            alt="Back"
            className="back-arrow"
            onClick={() => navigate("/profile")} // Navigate to profile
            style={{ cursor: "pointer" }}
          />
          <img src={fav} alt="Tripago Favicon" className="tripago-fav" />
          <h1 className="hotels-header">Search for Hotels</h1>
        </div>
      ) : (
        <div className="logo">
          <button className="logo-btn" onClick={() => navigate("/")}>
            <img src={logo} alt="Tripago Logo" />
          </button>
        </div>
      )}

      {location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup" || location.pathname === "/forgot-password" ? (
        <ul className="nav-links">
          <li>
            <button className="navbar-links" onClick={() => navigate("/login")}>
              Login
            </button>
          </li>
          <li>
            <button
              className="navbar-links"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </li>
        </ul>
      ) : (
        <ul className="nav-links">
          <li>
            <button className="navbar-links" onClick={() => navigate("/")}>
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
