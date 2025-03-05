import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/Settings.css';

const SettingsPrivacyPolicy = () => {
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
        <button onClick={() => navigate("/settings/my-data")}>My Data</button>

        <h3>Legal</h3>
        <button onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
        <button className="selected" onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>
      </div>

      {/* Right Panel */}
      <div className="settings-right">
        <h2>Privacy Policy</h2>
        <p>Review our privacy policy and download a copy if needed.</p>
        
        <button className="download-btn">Download Privacy Policy</button>
      </div>

    </div>
  );
};

export default SettingsPrivacyPolicy;
