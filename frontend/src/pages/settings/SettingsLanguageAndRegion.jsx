import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/Settings.css';

const SettingsLanguageAndRegion = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="settings-container">

       {/* Hamburger Button */}
       <button className="hamburger-menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Left Sidebar */}
      <div className={`settings-left ${menuOpen ? "open" : ""}`}>
        <h3>Preferences</h3>
        <button onClick={() => navigate("/settings/accessibility")}>Accessibility</button>
        <button className="selected" onClick={() => navigate("/settings/language-and-region")}>Language & Region</button>

        <h3>Profile</h3>
        <button onClick={() => navigate("/settings/profile-details")}>Profile Details</button>

        <h3>Privacy & Security</h3>
        <button onClick={() => navigate("/settings/manage-password")}>Manage Password</button>
        <button onClick={() => navigate("/settings/recent-activity")}>Recent Activity</button>
        <button onClick={() => navigate("/settings/my-data")}>My Data</button>

        <h3>Legal</h3>
        <button onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
        <button onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>
        <button className="return-home-btn" onClick={() => navigate("/user-profile")}>Return to Profile</button>
      </div>

      {/* Right Panel */}
      <div className="settings-right">
        <h2>Language & Region Settings</h2>

        <form>
          <div className="form-group">
            <label htmlFor="account-language">Account Language</label>
            <select id="account-language">
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="tbd">Languages TBD</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="time-zone">Region/Time</label>
            <select id="time-zone">
              <option value="est">Eastern Time</option>
              <option value="pst">Pacific Time</option>
              <option value="etc">etc</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country</label>
            <select id="country">
              <option value="US">United States</option>
              <option value="etc">etc</option>
            </select>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SettingsLanguageAndRegion;
