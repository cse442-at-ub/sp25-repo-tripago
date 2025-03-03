import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Settings.css'

const SettingsTermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className='settings-container'>

      <div className='settings-left'>

        Preferences
        <hr></hr>

        <button onClick={() => navigate("/settings/accessibility")}>Accessibility</button>
        <button onClick={() => navigate("/settings/language-and-region")}>Language and Region</button>

        <br></br>

        Profile
        <hr></hr>

        <button onClick={() => navigate("/settings/profile-details")}>Profile Details</button>

        <br></br>

        Privacy and Security
        <hr></hr>

        <button onClick={() => navigate("/settings/manage-password")}>Manage Password</button>
        <button onClick={() => navigate("/settings/recent-activity")}>Recent Activity</button>
        <button onClick={() => navigate("/settings/my-data")}>My Data</button>

        <br></br>

        Legal
        <hr></hr>

        <button className='selected' onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
        <button onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>

        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

      </div>

      <div className='settings-right'>
        
        <br></br>
        <div>
          TBD blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah 
        </div>

      </div>

    </div>
  )
}

export default SettingsTermsOfService