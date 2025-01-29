import React, { useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/Signup.css'

const Signup = () => {

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
    console.log("Signup Data:", formData);
  };

  return (
    <div className="signup-container">
    <h2>Create new account</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="firstName"
        placeholder="First name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
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
      <button type="submit" className='signup-button'>Create account</button>
    </form>
    <p>
      <Link to="/login" className='login_signup-btn'>Already have an account?</Link>
    </p>
  </div>
  )
}

export default Signup
