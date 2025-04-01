// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "../styles/LoadingScreen.css"; // Make sure your styles are set up

// const LoadingScreen = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get values from navigate()
//   const { headerText, redirectTo } = location.state || {
//     headerText: "Loading...",
//     redirectTo: "/",
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       navigate(redirectTo); // Navigate after 5 seconds
//     }, 4000);
    
//     return () => clearTimeout(timer); // Cleanup
//   }, [navigate, redirectTo]);

//   return (
//     <div className="loading-screen">
//       <h2>{headerText}</h2>
//       <div className="loading-spinner"></div>
//       <p>This may take a while...</p>
//       <button className="loading-cancel" onClick={() => navigate(-1)}>✖</button>
//     </div>
//   );
// };

// export default LoadingScreen;

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { searchLocations, searchHotels } from "../services/hotelService";
import "../styles/LoadingScreen.css";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { headerText, redirectTo, recommendations, hotels } = location.state || {
    headerText: "Loading...",
    redirectTo: "/",
    recommendations: null,
    hotels: null
  };

  useEffect(() => {
    const fetchData = async () => {
      if (redirectTo === "/browse-hotels" && hotels) {
        try {
          // const { searchLocation, checkInDate, checkOutDate, adults, rooms } = searchParams;
          console.log("getting location");
          const locations = await searchLocations(hotels.location);
          const locationMatch = locations.find(
            loc => loc.name.toLowerCase() === hotels.location.toLowerCase()
          ) || locations[0];
          console.log("locationMatch", locationMatch);
          console.log("getting hotels", hotels);
          const results = await searchHotels(locationMatch, hotels.checkIn, hotels.checkOut, hotels.adults, hotels.rooms);
          console.log("results", results);
          navigate(redirectTo, { state: { location: locationMatch, searchResults: results, checkIn: hotels.checkIn, checkOut: hotels.checkOut } });
        } catch (error) {
          console.error("Error fetching hotels:", error);
          navigate("/browse-hotels", { state: { error: error.message } });
        }
      } else {
        // Original timer-based navigation for other routes
        const timer = setTimeout(() => {
          if (recommendations) {
            navigate(redirectTo, { state: { recommendations } });
          } else {
            navigate(redirectTo);
          }
        }, 4000);
        return () => clearTimeout(timer);
      }
    };

    fetchData();
  }, [navigate, redirectTo, recommendations, hotels]);

  return (
    <div className="loading-screen">
      <h2>{headerText}</h2>
      <div className="loading-spinner"></div>
      <p>This may take a while...</p>
      <button className="loading-cancel" onClick={() => navigate(-1)}>✖</button>
    </div>
  );
};

export default LoadingScreen;
