import React, { useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/Login.css'

const Login = () => {

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
    console.log("Login Data:", formData);
  };

  return (
    <div className="login-container ">
    <h2>Login to Tripa<span>go</span></h2>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit" className='login_signup-button'>Login</button>
    </form>
    <p classname='forgot_password_link'>
      <Link to="/forgot_password" className='login_signup-btn'>Forgot your password?</Link>
    </p>
    <p> 
      <Link to="/signup" className='login_signup-btn'> Don't have an account? Sign up here.</Link>
    </p>
  </div>
  )
}

export default Login
