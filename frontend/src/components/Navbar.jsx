import React from 'react'
import "../styles/Navbar.css"
import { Link } from "react-router-dom";
import logo from '../assets/Tripago_VX.png'

const Navbar = () => {
  return (
      <nav className="navbar">
        <div className="logo">
        <Link to="/" className="logo">
        <img src={logo} alt="Tripago Logo" />
      </Link>
        </div>
        <ul className="nav-links">
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Signup</a></li>
        </ul>
      </nav>
  )
}

export default Navbar
