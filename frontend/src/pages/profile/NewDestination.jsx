import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/trip/NewDestination.css";

const NewDestination = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);
  
    if (value.length < 2) {
      setSuggestions([]);
      return;
    }
  
    try {
      const res = await fetch(`http://localhost:8000/api/amadeus/destinations/searchCities.php?keyword=${encodeURIComponent(value)}`);
      const data = await res.json();
  
      const cities = data.data.map((loc) => ({
        name: loc.name,
        iataCode: loc.iataCode,
        country: loc.address?.countryName || "",
      }));
  
      setSuggestions(cities);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

  // Handles when a category (e.g., "Relaxation") is clicked
  const handleCategoryClick = async (category) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/amadeus/destinations/getRecommendations.php?category=${encodeURIComponent(
          category
        )}`
      );

      // Add this to debug the raw response:
      const text = await response.text();
      console.log("Raw response:", text);

      try {
        const data = JSON.parse(text);
        if (!data || !data.data) throw new Error("No recommendations found");
      
        navigate("/loading-screen", {
          state: {
            headerText: "Scanning the map for your ideal getaway",
            redirectTo: "/profile/accept-reject",
            recommendations: data.data,
          },
        });
      } catch (err) {
        console.error("Error parsing response:", err);
      }

    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert("Something went wrong while fetching recommendations.");
    }
  };

  return (
    <div className="new-trip-container">
      <h2 className="trip-header">
        Tell us your dream destination, or let us pick one for you!
      </h2>

      {/* Enter a destination manually */}
      <div className="destination-input-container">
        <p className="destination-link">I have a destination in mind.</p>
        <div className="destination-input-wrapper">
          <FaMapMarkerAlt className="location-icon" />
          <input
            type="text"
            placeholder="Enter city, country"
            value={destination}
            onChange={handleDestinationChange}
            className="destination-input"
          />
        </div>
      </div>

      {/* Recommendation Categories */}
      <div className="recommendation-list-container">
        <p className="recommendation-header">
          I'm not sure, but I'm looking for...
        </p>
        <div className="recommendation-list">
          {[
            "Relaxation",
            "Culture",
            "Adventure",
            "Nature",
            "Choose for me",
            "Recommendations",
          ].map((category, index) => (
            <div
              key={index}
              className="recommendation-item"
              onClick={() => handleCategoryClick(category)}
            >
              <span className="category-text">{category}</span>
              <span className="arrow">&gt;</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewDestination;
