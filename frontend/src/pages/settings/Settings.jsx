import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">

      {/* Left Sidebar */}
      <div className="settings-left">
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
        <button onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>
      </div>

      {/* Right Content Area */}
      <div className="settings-right">
        <h2>Settings</h2>
        <p>Select a category from the left to view and update your preferences.</p>
      </div>

    </div>
  );
};

export default Settings;
