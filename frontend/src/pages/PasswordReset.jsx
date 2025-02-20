import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'

const PasswordReset = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password Reset Data:", formData);

    useNavigate("/new-password")
  };

  return (
    <div className="login-container ">
    <h2>Reset Password</h2>
    <form onSubmit={handleSubmit}>
      <input
        className='email-input-box'
        type="email"
        name="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      {/* The Send Link button takes you to the New Password Page */}
      <button type="submit" className='login_signup-button'>Send Link</button>
    </form>

    <p classname='forgot_password_link'>
        <button className='link-button' onClick={() => navigate("/login")}>
          I know my password.
        </button>
    </p>
    <p> 
        <button className='link-button' onClick={() => navigate("/signup")}>
        Don't have an account? Sign up here.
        </button>
    </p>
  </div>
  )
}

export default PasswordReset
