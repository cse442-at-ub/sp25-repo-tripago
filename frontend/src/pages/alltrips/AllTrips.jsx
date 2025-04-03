import React, { useEffect, useState } from "react";
import "../../styles/user/UserProfile.css";
import UserAvatar from "../../assets/UserAvatar.png";
import parisPicture from "../../assets/paris.jpg";
import charlestonPicture from "../../assets/charleston.jpg";
import plane from "../../assets/plane.png";
import house from "../../assets/house.png";
import car from "../../assets/car.png";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import MobileSidebarToggle from "../../components/MobileSidebarToggle";
import Sidebar from "../../components/Sidebar";
import { encode } from "html-entities";

const AllTrips = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState(""); // Sorting option
  const [trips, setTrips] = useState([]);
  const [logged, setLogged] = useState([]);
  const [notLogged, setNotLogged] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log("Fetching trips...");

    const fetchTrips = async () => {
      try {
        const res = await fetch(
          "/CSE442/2025-Spring/cse-442aj/backend/api/trips/getAllTrips.php",
          {
            credentials: "include",
          }
        );

        console.log("Response object:", res);

        const data = await res.json();

        console.log("Data returned from PHP:", data);

        if (data.success) {
          console.log("Trips received:", data.trips);
          setTrips(data.trips);

          setLogged(data.trips.filter((trip) => trip.logged == true))
          setNotLogged(data.trips.filter((trip) => trip.logged != true))
        } else {
          console.error("Backend error message:", data.message);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };

    fetchTrips();

    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      console.log(
        "Window width:",
        window.innerWidth,
        "| isMobile:",
        isNowMobile
      );
      setIsMobile(isNowMobile);
    };

    handleResize(); // Run on first load
    window.addEventListener("resize", handleResize); // Watch for resizes

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sort trips by selected criteria
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortBy(value);

    let sortedTrips = [...trips];
    if (value === "date") {
      sortedTrips.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));
    } else if (value === "price") {
      sortedTrips.sort((a, b) => a.price - b.price);
    }

    setTrips(sortedTrips);

    setLogged(sortedTrips.filter((trip) => trip.logged == true))
    setNotLogged(sortedTrips.filter((trip) => trip.logged != true))
  };

  const postToLog = (trip) => {
    
    trip.logged = true

    setLogged(trips.filter((trip) => trip.logged == true))
    setNotLogged(trips.filter((trip) => trip.logged != true))

    // TODO: Change this trip's travel_log column in the database to true
  }

  const removeFromLog = (trip) => {
    
    trip.logged = false

    setLogged(trips.filter((trip) => trip.logged == true))
    setNotLogged(trips.filter((trip) => trip.logged != true))

    // TODO: Change this trip's travel_log column in the database to false
  }

  return (
    <>
      {/* Hamburger toggle for mobile */}
      {isMobile && (
        <MobileSidebarToggle
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* Sidebar: always visible on desktop, toggled on mobile */}
      <Sidebar isOpen={!isMobile || isSidebarOpen} />

      <div className="all-trips-container">
        <div className="user-profile-main-content all-trips-main-content">
          <h3>Browse Your Trips</h3>
          {/* All Trips Header with Sorting */}
          <div className="trips-header">
            <button
              className="start-trip-btn-all-trips"
              onClick={() => navigate("/profile/new-destination")}
            >
              Start new trip
            </button>
            <div className="sort-options">
              <label>Sort By: </label>
              <select value={sortBy} onChange={handleSortChange}>
                <option value="">Select</option>
                <option value="date">Date (Newest → Oldest)</option>
                <option value="price">Price (Lowest → Highest)</option>
              </select>
            </div>
          </div>

          <h3>Private Trips</h3>
          {/* cName changed from trips-container */}
          <div
            className={`trips-container all-trips-trips-container`}
          >
            {notLogged.length === 0 ? (
              <p className="no-trips-message">
                Looks like you have no trips yet. Click the button above to get
                started.
              </p>
            ) : (
              trips.map((trip) => (
                <div key={trip.id} className="at-trip-card">
                  {/* View Button */}
                  <button
                    className="view-button"
                    onClick={() => {
                      const selected = {
                        name: trip.destination,
                        countryCode: "", // optional
                        startDate: trip.start_date,
                        endDate: trip.end_date,
                        imageUrl: trip.image_url || "",
                        hotel: {
                          name: trip.hotel_name,
                          price: trip.hotel_price,
                        },
                      };
                      console.log("When clicking view, we send,");
                      console.log(selected);

                      localStorage.setItem(
                        "selectedTrip",
                        JSON.stringify(selected)
                      );
                      navigate("/profile");
                    }}
                  >
                    View
                  </button>

                  {/* Trip Info */}
                  <div className="trip-info">
                    <h4 className="trip-destination">{encode(trip.destination)}</h4>
                    <p className="trip-dates">{encode(trip.dates)}</p>

                    {/* Bottom Row: Icons + Price */}
                    <div className="trip-bottom-row">
                      <div className="trip-icons">
                        <img src={plane} alt="Plane" className="icon" />
                        <img src={house} alt="House" className="icon" />
                        <img src={car} alt="Car" className="icon" />
                      </div>
                      <p className="trip-price">${trip.price}</p>
                    </div>
                  </div>

                  {/* Trip Image */}
                  <img
                    src={
                      trip.image_url ||
                      "/CSE442/2025-Spring/cse-442aj/backend/uploads/default_img.png"
                    }
                    alt={encode(trip.destination)}
                    className="at-trip-image"
                  />
                </div>
              ))
            )}
          </div>

          <h3>Travel Log</h3>
          {/* cName changed from trips-container */}
          <div
            className={`trips-container all-trips-trips-container`}
          >
            {logged.length === 0 ? (
              <p className="no-trips-message">
                Post trips to your Travel Log by clicking the button on the top left of each trip card.
              </p>
            ) : (
              logged.map((trip) => (
                <div key={trip.id} className="trip-card">

                  {/* Remove from Travel Log Button */}
                  <button
                    className="log-button"
                    onClick={() => removeFromLog(trip)}
                  >
                    Remove from Travel Log
                  </button>

                  {/* View Button */}
                  <button
                    className="view-button"
                    onClick={() => {
                      const selected = {
                        name: trip.destination,
                        countryCode: "", // optional
                        startDate: trip.start_date,
                        endDate: trip.end_date,
                        imageUrl: trip.image_url || "",
                      };
                      console.log("When clicking view, we send,");
                      console.log(selected);

                      localStorage.setItem(
                        "selectedTrip",
                        JSON.stringify(selected)
                      );
                      navigate("/profile");
                    }}
                  >
                    View
                  </button>

                  {/* Trip Info */}
                  <div className="trip-info">
                    <h4 className="trip-destination">encode({trip.destination})</h4>
                    <p className="trip-dates">{trip.dates}</p>

                    {/* Bottom Row: Icons + Price */}
                    <div className="trip-bottom-row">
                      <div className="trip-icons">
                        <img src={plane} alt="Plane" className="icon" />
                        <img src={house} alt="House" className="icon" />
                        <img src={car} alt="Car" className="icon" />
                      </div>
                      <p className="trip-price">${trip.price}</p>
                    </div>
                  </div>

                  {/* Trip Image */}
                  <img
                    src={
                      trip.image_url ||
                      "/CSE442/2025-Spring/cse-442aj/backend/uploads/default_img.png"
                    }
                    alt={encode(trip.destination)}
                    className="at-trip-image"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTrips;
