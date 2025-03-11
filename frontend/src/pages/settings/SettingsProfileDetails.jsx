import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../styles/Settings.css';
import axios from 'axios';

const SettingsProfileDetails = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
  });

  // Get the current email
  useEffect(() => {
    const callCurrentEmail = async () => {
      await axios.get("/CSE442/2025-Spring/cse-442aj/owenbackend/api/getemail.php")
      .then(res => setFormData({
        "displayName": "",
        "email": res.data
    }))
      .catch(err => console.log(err))
    }
    callCurrentEmail()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Profile Details Form Data:", formData);

    try {
      const response = await axios.post("/CSE442/2025-Spring/cse-442aj/backend/api/settingsprofiledetails.php", formData, {
        headers:{
          'Content-Type': 'application/json'
        }
      })
      const result = response.data
      console.log("Profile Details Form Response", result);
      if (result.success) {
        //
      } else {
        alert(result.message)
      }
    } catch(error) {
      console.log("Error updating profile details:", error)
    }
  };

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
        <button className="selected" onClick={() => navigate("/settings/profile-details")}>Profile Details</button>

        <h3>Privacy & Security</h3>
        <button onClick={() => navigate("/settings/manage-password")}>Manage Password</button>
        <button onClick={() => navigate("/settings/recent-activity")}>Recent Activity</button>
        <button onClick={() => navigate("/settings/my-data")}>My Data</button>

        <h3>Legal</h3>
        <button onClick={() => navigate("/settings/terms-of-service")}>Terms of Service</button>
        <button onClick={() => navigate("/settings/privacy-policy")}>Privacy Policy</button>
      </div>

      {/* Right Panel */}
      <div className="settings-right">
        <h2>Profile Details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              placeholder="Enter new name"
              value={formData.displayName}
              onChange={handleChange}
              // required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter new email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Save Changes</button>
        </form>
      </div>

    </div>
  );
};

export default SettingsProfileDetails;