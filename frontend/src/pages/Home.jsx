import React from 'react'
import { useNavigate } from "react-router-dom"; 
import '../styles/Home.css'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className='content'>
      <p className='title-text'>The smarter way to <span className='title-text-accent'>go.</span></p>
      <p className='description-text'>Effortless trip planning – from itinerary creation to budgeting and beyond.</p>

      <button onClick={() => navigate('/login')} className='plan-button'>Plan your next trip.</button>
    </div>
  )
}

export default Home
