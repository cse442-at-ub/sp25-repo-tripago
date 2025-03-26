import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/trip/NewDestination.css";
import traveler from '../../assets/tripagoTraveler.png'
import suitcase from '../../assets/tripagoSuitcase.png'

const NewDestination = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleDestinationChange = async (e) => {
    const value = e.target.value;
    setDestination(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/api/amadeus/destinations/searchCities.php?keyword=${encodeURIComponent(
          value
        )}`
      );
      const data = await res.json();
      console.log();

      const cities = data.data.map((loc) => ({
        name: loc.name,
        iataCode: loc.iataCode,
        countryCode:
          loc.address?.countryCode || loc.address?.CountryCode || "N/A",
      }));

      setSuggestions(cities);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching city suggestions:", err);
    }
  };

  const COUNTRY_MAP = {
    US: "United States",
    FR: "France",
    CA: "Canada",
    JP: "Japan",
    IT: "Italy",
    BR: "Brazil",
    // Add more as needed
  };

  function getCountryName(code) {
    return COUNTRY_MAP[code] || code;
  }

  function getCountryFromCity(city) {
    const normalizedCity = city.toLowerCase();
    const CITY_COUNTRY_MAP = {
      rome: "IT",
      milan: "IT",
      madrid: "ES",
      barcelona: "ES",
      london: "GB",
      paris: "FR",
    };
    return CITY_COUNTRY_MAP[normalizedCity] || "N/A";
  }
  

  // Handles when a category (e.g., "Relaxation") is clicked
  const handleCategoryClick = async (category) => {
    localStorage.removeItem("trip"); 

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
            recommendations: data.data.map((rec) => ({
              name: rec.name,
              countryCode: getCountryFromCity(rec.name),
            })),
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
      {/* Positioned background images */}
     
  
      <h2 className="trip-header">
        Tell us your dream destination, or let us pick one for you!
      </h2>
  
      <p className="recommendation-header">I have a destination in mind.</p>
      <div className="destination-input-wrapper" style={{ position: "relative" }}>
        <FaMapMarkerAlt className="location-icon" />
        <input
          type="text"
          placeholder="Enter city, country"
          value={destination}
          onChange={handleDestinationChange}
          className="destination-input"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && destination.trim().length > 0) {
              e.preventDefault();
              localStorage.removeItem("trip");
              const [cityName, countryName] = destination.split(",").map((s) => s.trim());
              navigate("/profile", {
                state: {
                  name: cityName,
                  countryCode: countryName,
                },
              });
            }
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {suggestions.map((city, idx) => (
              <li
                key={idx}
                className="autocomplete-option"
                onClick={() => {
                  setDestination(
                    `${city.name}, ${getCountryName(city.countryCode)}`
                  );
                  setShowSuggestions(false);
                }}
              >
                {city.name}, {getCountryName(city.countryCode)}
              </li>
            ))}
          </ul>
        )}
      </div>
  
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
      <img src={traveler} alt="Traveler" className="bg-img left-img" />
      <img src={suitcase} alt="Suitcase" className="bg-img right-img" />
    </div>
  );

};

export default NewDestination;
