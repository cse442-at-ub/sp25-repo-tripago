// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaMapMarkerAlt } from "react-icons/fa";
// import '../../styles/trip/NewDestination.css'

// const NewDestination = () => {
//   const navigate = useNavigate();
//   const [destination, setDestination] = useState("");

//   const handleDestinationChange = (e) => {
//     setDestination(e.target.value);
//   };

//   const handleSearch = () => {
//     // Future: Call Travel Recommendations API here
//     console.log("Searching for:", destination);
//   };

//   const handleCategoryClick = () => {
//     navigate("/loading-screen", {
//       state: {
//         headerText: "Scanning the map for your ideal getaway",
//         redirectTo: "/profile/accept-reject",
//       },
//     });
//   };

//   return (
//     <div className="new-trip-container">
//       <h2 className="trip-header">
//         Tell us your dream destination, or let us pick one for you!
//       </h2>

//       {/* Enter a destination */}
//       <div className="destination-input-container">
//         <p className="destination-link">I have a destination in mind.</p>
//         <div className="destination-input-wrapper">
//           <FaMapMarkerAlt className="location-icon" />
//           <input
//             type="text"
//             placeholder="Enter city, country"
//             value={destination}
//             onChange={handleDestinationChange}
//             className="destination-input"
//           />
//         </div>
//       </div>

//       {/* Recommendation Categories */}
//       <div className="recommendation-list-container">
//       <p className="recommendation-header">I'm not sure, but I'm looking for...</p>
//       <div className="recommendation-list">
//         {["Relaxation", "Culture", "Adventure", "Nature", "Choose for me", "Recommendations"].map(
//           (category, index) => (
//             <div key={index} className="recommendation-item" onClick={handleCategoryClick}>
//               <span className="category-text">{category}</span>
//               <span className="arrow">&gt;</span>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//     </div>
//   );
// };

// export default NewDestination;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import "../../styles/trip/NewDestination.css";

const NewDestination = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");

  const handleDestinationChange = (e) => {
    setDestination(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", destination);
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

      // const data = await response.json();

      // if (data?.data) {
      //   navigate("/loading-screen", {
      //     state: {
      //       headerText: "Scanning the map for your ideal getaway",
      //       redirectTo: "/profile/accept-reject",
      //       recommendations: data.data, // pass recommendations to next screen
      //     },
      //   });
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
  
      // } 
      // else {
      //   alert("No recommendations found. Please try a different category.");
      // }
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
