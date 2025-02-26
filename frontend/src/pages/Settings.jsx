import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Settings.css'
import Sidebar from "../components/Sidebar.jsx";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className='settings-container'>

      <div className='settings-left'>
        Preferences
        <hr></hr>
      </div>
    </div>
  )
}

export default Settings