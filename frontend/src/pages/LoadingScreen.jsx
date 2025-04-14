import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { encode } from "html-entities";
import { searchLocations, searchHotels } from "../services/hotelService";
import "../styles/LoadingScreen.css";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { headerText, redirectTo, recommendations, hotels } =
    location.state || {
      headerText: "Loading...",
      redirectTo: "/",
      recommendations: null,
      hotels: null,
    };

  useEffect(() => {
    async function doLoad() {
      // If we are going to the hotels page, we need to fetch the location and hotels from amadeus
      if (redirectTo === "/browse-hotels" && hotels) {
        try {
          // Step 1: Get location from amadeus
          console.log("getting location from amadeus");
          const locations = await searchLocations(hotels.location);
          const locationMatch =
            locations.find((loc) => loc.name === hotels.location) ||
            locations[0];
          console.log("locationMatch", locationMatch);

          // Step 2: Get hotels from amadeus
          console.log("getting hotels from amadeus");
          const results = await searchHotels(
            locationMatch,
            hotels.checkIn,
            hotels.checkOut,
            hotels.adults,
            hotels.rooms
          );
          console.log("hotels from amadeus", results);

          console.log("In LoadingScreen, before nav to hotels page, tripId and fromInvite: ",location.state?.tripId,  location.state?.fromInvite)

          // Step 3: Navigate to hotels page with results
          navigate(redirectTo, {
            state: {
              location: locationMatch,
              searchResults: results,
              checkIn: hotels.checkIn,
              checkOut: hotels.checkOut,
              tripId: location.state?.tripId,
              fromInvite: location.state?.fromInvite,
            },
          });
        } catch (error) {
          console.error("Error fetching hotels:", error);
          navigate("/browse-hotels", {
            state: {
              error: error.message,
              tripId: location.state?.tripId,
              fromInvite: location.state?.fromInvite,
            },
          });
        }
        // If we are not going to the hotels page, we just navigate to the page after timeout
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
    }

    doLoad();
  }, [navigate, redirectTo, recommendations, hotels]);

  return (
    <div className="loading-screen">
      <h2>{headerText}</h2>
      <div className="loading-spinner"></div>
      <p>This may take a while...</p>
      <p className="powered-by">
        Powered by{" "}
        <a href="https://amadeus.com" target="_blank">
          Amadeus
        </a>
      </p>
      <button className="loading-cancel" onClick={() => navigate(-1)}>
        ✖
      </button>
    </div>
  );
};

export default LoadingScreen;
