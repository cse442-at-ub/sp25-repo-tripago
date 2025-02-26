import React from 'react'
import "../styles/Sidebar.css"
import { useNavigate } from "react-router-dom"; 

const Sidebar = () => {
  const navigate = useNavigate();

  return (
      <nav className="sidebar">
        <ul className="side-links">
          <li><button className='sidebar-links' onClick={() => navigate("/login")}>Login</button></li>
          <li><button className='sidebar-links' onClick={() => navigate("/signup")}>Signup</button></li>
        </ul>
      </nav>
  )
}

export default Sidebar
