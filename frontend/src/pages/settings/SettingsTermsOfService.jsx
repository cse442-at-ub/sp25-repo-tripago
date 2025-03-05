import React from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/Settings.css';

const SettingsTermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="settings-container">

      {/* Sidebar */}
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
        <button className="selected" onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
        <button onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>
      </div>

      {/* Right Panel */}
      <div className="settings-right">
        <h2>Terms of Service</h2>
        <p>
          By using Tripago, you agree to the following terms and conditions. Please read them carefully before proceeding.
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
        </p>

        <h3>2. User Responsibilities</h3>
        <p>
          You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
        </p>

        <h3>3. Prohibited Activities</h3>
        <p>
          Users may not engage in any activity that violates applicable laws, infringes on the rights of others, or disrupts the functionality of the service.
        </p>

        <h3>4. Modifications to the Terms</h3>
        <p>
          We reserve the right to update these terms at any time. Continued use of our services after modifications constitutes acceptance of the new terms.
        </p>

        <h3>5. Contact Information</h3>
        <p>
          If you have any questions regarding these Terms of Service, please contact our support team.
        </p>

        <button className="download-btn">Download Terms of Service</button>
      </div>

    </div>
  );
};

export default SettingsTermsOfService;
