import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/Home.css'

const Home = () => {
  const [data, setData] = useState(null)

  // Testing connection to PHP
  useEffect(() => {
    fetch('http://localhost:8000/api/test.php')
      .then((response) => {
        console.log("Raw response:", response);
        return response.text(); // Log raw response before parsing
      })
      .then((text) => {
        console.log("Raw text received:", text);
        return JSON.parse(text); // Manually parse JSON
      })
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className='home-wrapper'>
        <div>{data ? <div>{data.message}</div> : <div>Loading . . .</div>}</div>
      <h1 style={{ textAlign: "center" }}>The smarter way to <span class='home__go'>go.</span></h1>
      <p className="home-subtext">
      Effortless trip planning – from itinerary creation to budgeting and beyond.
</p>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button><Link to="/login" className='home-button'>Plan your next trip.</Link></button>
      </div>
    </div>
  )
}

export default Home
