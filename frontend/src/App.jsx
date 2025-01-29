import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Plan from './pages/Plan.jsx';
import Signup from './pages/Signup.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './App.css'

const App = () => {

  return (
    <BrowserRouter>
    <div className="app-container">
      <Navbar />
      <main className="content">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/plan" element={<Plan />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
  )
}

export default App
