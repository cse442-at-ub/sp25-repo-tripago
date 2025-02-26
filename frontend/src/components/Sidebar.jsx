import React from 'react'
import "../styles/Sidebar.css"
import { useNavigate } from "react-router-dom"; 

const Sidebar = () => {
  const navigate = useNavigate();

  return (
      <nav className="sidebar">
        <ul className="side-links">
          <li><button className='sidebar-links' onClick={() => navigate("/")}>Profile</button></li>
          <li><button className='sidebar-links' onClick={() => navigate("/")}>All Trips</button></li>
          <li><button className='sidebar-links' onClick={() => navigate("/")}>New Trip</button></li>
          <li><button className='sidebar-links' onClick={() => navigate("/")}>Community</button></li>
          <li><button className='sidebar-links' onClick={() => navigate("/")}>Settings</button></li>
        </ul>
      </nav>
  )
}

export default Sidebar
