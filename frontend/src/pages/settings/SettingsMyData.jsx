import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/Settings.css';

const SettingsMyData = () => {
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
        <button onClick={() => navigate("/settings/language-and-region")}>Language & Region</button>

        <h3>Profile</h3>
        <button onClick={() => navigate("/settings/profile-details")}>Profile Details</button>

        <h3>Privacy & Security</h3>
        <button onClick={() => navigate("/settings/manage-password")}>Manage Password</button>
        <button onClick={() => navigate("/settings/recent-activity")}>Recent Activity</button>
        <button className="selected" onClick={() => navigate("/settings/my-data")}>My Data</button>

        <h3>Legal</h3>
        <button onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
        <button onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>
      </div>

      {/* Right Panel */}
      <div className="settings-right">
        <h2>Manage Your Data</h2>
        <p>You can download a copy of your data at any time.</p>
        
        <button className="download-btn">Download Your Data</button>
      </div>

    </div>
  );
};

export default SettingsMyData;
