import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import '../../styles/trip/NewDestination.css'

const NewDestination = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSearch = () => {
    // Future: Call Travel Recommendations API here
    console.log("Searching for:", destination);
  };

  return (
    <div className="new-trip-container">
      <h2 className="trip-header">
        Tell us your dream destination, or let us pick one for you!
      </h2>

      {/* Enter a destination */}
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
      <p className="recommendation-header">I'm not sure, but I'm looking for...</p>
      <div className="recommendation-list">
        {["Relaxation", "Culture", "Adventure", "Nature", "Choose for me", "Recommendations"].map(
          (category, index) => (
            <div key={index} className="recommendation-item">
              <span className="category-text">{category}</span>
              <span className="arrow">&gt;</span>
            </div>
          )
        )}
      </div>
    </div>
    </div>
  );
};

export default NewDestination;

