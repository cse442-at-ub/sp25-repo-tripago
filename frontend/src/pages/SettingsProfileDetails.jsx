import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Settings.css'

const SettingsProfileDetails = () => {
  const navigate = useNavigate();

  return (
    <div className='settings-container'>

      <div className='settings-left'>

        Preferences
        <hr></hr>

        <button>Accessibility</button>
        <button>Language and Region</button>

        <br></br>

        Profile
        <hr></hr>

        <button className='selected' onClick={() => navigate("/settings/profile-details")}>Profile Details</button>

        <br></br>

        Privacy and Security
        <hr></hr>

        <button>Manage Password</button>
        <button>Recent Activity</button>
        <button>My Data</button>

        <br></br>

        Legal
        <hr></hr>

        <button>Terms of Service</button>
        <button>Privacy Policy</button>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

      </div>

      <div className='settings-right'>
        Placeholder
      </div>

    </div>
  )
}

export default SettingsProfileDetails