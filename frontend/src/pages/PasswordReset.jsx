import React, { useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import '../styles/Login.css'
import axios from "axios";

const PasswordReset = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //axios.post('http://localhost/tripago/reset_password.php', formData).then(function(responce){
    //  console.log(responce.data);
    //  console.log(responce.status);
      //navigate('/');

    //});
    
    
    
    console.log("Password Reset Data:", formData);
    try {
      //const response = await fetch("http://localhost/tripago/passwordreset.php", {
      //const response = await fetch("/CSE442/2025-Spring/cse-442aj/backend/api/passwordreset.php", {
        const response = await fetch("http://localhost/tripago/reset_password.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();
      console.log("Response:", result);
  
      if (result.status === "success") {
        alert("Check your email for the reset link: " + result.resetLink);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } 
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
      <button type="submit" className='login_signup-button'>Send Link</button>
    </form>

    <p className='forgot_password_link'>
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
