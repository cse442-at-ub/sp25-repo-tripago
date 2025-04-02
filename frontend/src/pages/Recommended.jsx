import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Paris from "../assets/paris.jpg";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "../styles/recommended.css";
import MobileSidebarToggle from "../components/MobileSidebarToggle.jsx";

const VerifyLocation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [destinationImages, setDestinationImages] = useState([]);
  const [error, setError] = useState(null);
  const [imagesFetched, setImagesFetched] = useState(false); // Flag to ensure images are fetched only once

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch("http://localhost/tripago/getRecommendations.php?category=Recommendations");
        
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
  
        const data = await response.json();
        let destinationsList = data.data || [];
  
        // Fetch images for each destination **before** updating state
        destinationsList = await Promise.all(
          destinationsList.map(async (destination) => {
            try {
              const imgResponse = await fetch(`http://localhost/tripago/pexelsSearch.php?query=${destination.name}`);
              
              if (!imgResponse.ok) {
                throw new Error("Failed to fetch image");
              }
  
              const imgData = await imgResponse.json();
              return { ...destination, image_url: imgData.photos[0]?.src.large || Paris }; 
            } catch (imgErr) {
              console.error("Error retrieving image for", destination.name, imgErr);
              return { ...destination, image_url: Paris }; // Default to Paris image
            }
          })
        );
  
        setDestinations(destinationsList); // Update state **after** fetching images
      } catch (err) {
        console.error("Error fetching destinations:", err);
      }
    };
  
    fetchDestinations();
  }, []);
  
  // Save trip selection
  const handleNewTrip = (destination) => {
    localStorage.setItem(
      "selectedTrip",
      JSON.stringify({ name: destination.name, cityCode: destination.iataCode, newTrip: true })
    );
    navigate("/profile");
  };

  const filteredDestinations = destinations.filter(destination =>
    //destination.city_name.toLowerCase().includes(searchQuery.toLowerCase())
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (name) => {
    setFavorites(prev => ({ ...prev, [name]: !prev[name] }));
    console.log(destinations);
  };

  return (
    <div style={{display: 'flex', width:'100%', height: '100vh', textAlign: 'left'}}>
      <Sidebar />
      <Navbar />
    <div style={{ paddingTop: '5rem', paddingBottom: '10rem', display: 'flex', flexWrap: 'wrap', height: '600vh', backgroundColor: '#f3f4f6', width: '100%' }}>
      
      <div class="card_positions">
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#374151", marginTop: "2rem" }}>
          Select a <span style={{ color: "#7c3aed" }}>Trip</span>
        </h2>

        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            marginTop: "1rem",
            width: "100%",
            maxWidth: "1000px",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            fontSize: "1rem",
            textAlign: "center",
          }}
        />

        <div style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          width: "100%",
          maxWidth: "900px",
        }}>
          {filteredDestinations.map((destination, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                //cursor: "pointer",
                width: '100%',
                maxWidth: "500px",
                minWidth: '300px',
                transition: "border 0.3s ease-in-out"
                /*border: selectedLocation === destination.name ? "3px solid #7c3aed" : "3px solid transparent",*/
              }}
              onClick={() => setSelectedLocation(destination.name)}
            >
              <img src={destination.image_url} onError={(e) => (e.target.src = Paris)} alt={destination.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <div style={{ padding: "1rem", textAlign: "center", width: "100%" }}>
                <p style={{ margin: '0px', fontWeight: "600" }}>{destination.name}</p>
                <p style={{ margin: '0px', color: "gray", fontSize: "0.875rem" }}>{destination.country_name}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "75%", padding: "0.5rem 1rem" }}>
                <FaHeart 
                  style={{ color: favorites[destination.name] ? "red" : "gray", cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(destination.name); }}
                />
                <button
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => { e.stopPropagation(); handleNewTrip(destination); }}
                >
                  New Trip
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedLocation && (
          <p style={{ marginTop: "1rem", fontSize: "1rem", fontWeight: "500", color: "#7c3aed" }}>
            Selected: {selectedLocation}
          </p>
        )}
      </div>
    </div>
    </div>
  );
};

export default VerifyLocation;
