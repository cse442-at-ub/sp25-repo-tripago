import React from 'react'
import "../styles/Navbar.css"
import { useNavigate } from "react-router-dom"; 
import logo from '../assets/Tripago_VX.png'

const Sidebar = () => {
  const navigate = useNavigate();

  return (
      <nav className="sidebar">
        <div className="logo">
        <button className="logo-btn" onClick={() => navigate("/")}>
          <img src={logo} alt="Tripago Logo" />
        </button>
        </div>
        <ul className="nav-links">
          <li><button className='navbar-links' onClick={() => navigate("/login")}>Login</button></li>
          <li><button className='navbar-links' onClick={() => navigate("/signup")}>Signup</button></li>
        </ul>
      </nav>
  )
}

export default Sidebar
