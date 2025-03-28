import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/trip/NewDestination.css";
import traveler from '../../assets/tripagoTraveler.png'
import suitcase from '../../assets/tripagoSuitcase.png'

const NewDestination = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
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
        `/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/searchCities.php?keyword=${encodeURIComponent(
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

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Only proceed if Enter is pressed and not already in input
      if (e.key === 'Enter' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        validateAndNavigate();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [destination]);

  const validateAndNavigate = () => {
    if (destination.trim().length === 0) return;

    localStorage.removeItem("trip");
    const [cityName, countryNameRaw] = destination.split(",").map(s => s.trim());
    const countryCode = countryNameRaw || "";

    // Check if this matches any suggestion
    const isValid = suggestions.some(suggestion => 
      `${suggestion.name}, ${getCountryName(suggestion.countryCode)}`.toLowerCase() === 
      destination.toLowerCase()
    );

    if (isValid || confirm("This destination wasn't found in our suggestions. Continue anyway?")) {
      navigate("/profile", {
        state: {
          name: cityName,
          countryCode
        },
      });
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
    return CITY_COUNTRY_MAP[normalizedCity] || "";
  }
  

  // Handles when a category (e.g., "Relaxation") is clicked
  const handleCategoryClick = async (category) => {
    localStorage.removeItem("trip"); 

    try {
      const response = await fetch(
        `/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/getRecommendations.php?category=${encodeURIComponent(
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
            category,
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
  
      <h2 className="trip-header">
        Tell us your dream destination, or let us pick one for you!
      </h2>
  
      <p className="recommendation-header">I have a destination in mind.</p>
      <div className="destination-input-wrapper" style={{ position: "relative" }}>
        <FaMapMarkerAlt className="location-icon" />
        <input
        ref={inputRef}
          type="text"
          placeholder="Enter city, country"
          value={destination}
          onChange={handleDestinationChange}
          className="destination-input"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              validateAndNavigate();
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
