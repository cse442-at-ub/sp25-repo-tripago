import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Settings.css'

const SettingsLanguageAndRegion = () => {
  const navigate = useNavigate();

  return (
    <div className='settings-container'>

      <div className='settings-left'>

        Preferences
        <hr></hr>

        <button onClick={() => navigate("/settings/accessibility")}>Accessibility</button>
        <button className='selected' onClick={() => navigate("/settings/language-and-region")}>Language and Region</button>

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

        <button onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
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
        
        <form>
            <br></br>

            <label>Account Language</label>
            <select>
              <option value='english'>English</option>
              <option value='spanish'>Spanish</option>
              <option value='tbd'>Languages TBD</option>
            </select>
            <br></br>

            <label>Region/Time</label>
            <select>
              <option value='est'>Eastern Time</option>
              <option value='pst'>Pacifc Time</option>
              <option value='etc'>etc</option>
            </select>
            <br></br>

            <label>Country</label>
            <select>
              <option value='US'>United States</option>
              <option value='etc'>etc</option>
            </select>
            <br></br>

        </form>

      </div>

    </div>
  )
}

export default SettingsLanguageAndRegion