import React from 'react'
import "../styles/Navbar.css"
import { useNavigate, useLocation } from "react-router-dom"; 
import logo from '../assets/Tripago_VX.png'

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if the current page is "style-guide"
  const isStyleGuidePage = location.pathname === "/style-guide";
  const isBrowseHotelsPage = location.pathname === "/browse-hotels";
  const isProfilePage = location.pathname === "/profile";


  return (
      <nav className="navbar">
        <div className="logo">
        <button className="logo-btn" onClick={() => navigate("/")}>
          <img src={logo} alt="Tripago Logo" />
        </button>
        </div>

         {/* Hide Login and Signup buttons on the Style Guide page */}
        {!isStyleGuidePage && !isBrowseHotelsPage && (
        <ul className="nav-links">
          <li><button className='navbar-links' onClick={() => navigate("/login")}>Login</button></li>
          <li><button className='navbar-links' onClick={() => navigate("/signup")}>Signup</button></li>
        </ul>
        )}

        
      </nav>
  )
}

export default Navbar
