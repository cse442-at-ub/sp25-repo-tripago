import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Login.css'

const Login = () => {

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

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Login Data:", formData);

    try {
      const response = await axios.post("/api/login.php",formData,{
        headers:{
          'Content-Type':'application/json'
        }
      })
      const result = response.data
      console.log("Registration Response",result);
      if (result.success){
        //navigate to login on success
        navigate('/home')
      } else {
        alert(result.message)
      }
    } catch(error){
      console.log("Error during signup:",error)
    }

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

    <p className='forgot_password_link'>
        <button className='link-button' onClick={() => navigate("/forgot-password")}>
          Forgot your password?
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

export default Login
