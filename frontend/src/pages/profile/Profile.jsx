import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TripHeader from "../../components/trip/TripHeader.jsx";
import TripDetails from "../../components/trip/TripDetails.jsx";
import ShareTripButton from "../../components/trip/ShareTripButton.jsx";
import "../../styles/Profile.css";
import airplaneIllustration from "../../assets/airplane.svg";
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
import { useNavigate } from 'react-router-dom';

const Profile = () => {

  const [user] = useState({
    firstName: "Jane",
    lastName: "Doe",
    username: "Jane",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);
const [isMobile, setIsMobile] = useState(false);

  // let incomingDestination = location.state || null;
  const incomingDestination = location.state || {};
const isFromLogin = incomingDestination.fromLogin === true;
  console.log("at very top, incomingDest is", incomingDestination)

  const [trip, setTrip] = useState({
    name: "",
    countryCode: "",
    startDate: null,
    endDate: null,
    picture: airplaneIllustration,
    days: [],
    budget: { amount: 0, expenses: [] },
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTripImage = async (cityName) => {
      const cacheKey = `tripImage-${cityName}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) return cached;
  
      try {
        const res = await fetch(
          `/CSE442/2025-Spring/cse-442aj/backend/api/images/pexelsSearch.php?query=${encodeURIComponent(
            cityName
          )} tourism attractions`
        );
        const data = await res.json();
        const img = data.photos?.[0]?.src?.large || airplaneIllustration;
        localStorage.setItem(cacheKey, img);
        return img;
      } catch (err) {
        console.error("Pexels error:", err);
        return airplaneIllustration;
      }
    };
  
    const loadTrip = async () => {
      console.log("LOAD TRIP FUNCTION STARTED!");

      // If user is coming from login page, get latest trip.
      const stored = !isFromLogin ? localStorage.getItem("selectedTrip") : null;

      let tripData = null;
  
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const isNewTrip = parsed.newTrip === true;
  
          tripData = {
            name: parsed.name,
            countryCode: parsed.countryCode || "",
            startDate: parsed.startDate || "",
            endDate: parsed.endDate || "",
          };
  
          let image = parsed.imageUrl || airplaneIllustration;
  
          if (isNewTrip) {
            console.log("Fetching Pexels image for new trip...");
            image = await fetchTripImage(tripData.name);
  
            // Save trip to database
            fetch("/CSE442/2025-Spring/cse-442aj/backend/api/trips/saveTrip.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                city_name: tripData.name,
                country_name: tripData.countryCode || null,
                start_date: null,
                end_date: null,
                image_url: image || "/CSE442/2025-Spring/cse-442aj/backend/uploads/default_img.png",
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                if (!data.success && !data.message.includes("Duplicate")) {
                  console.error("Trip save error:", data.message);
                } else {
                  console.log("Trip saved or already exists");
                }
              })
              .catch((err) => {
                console.error("Failed to save trip:", err);
              });
  
            // Update localStorage to clear the newTrip flag
            localStorage.setItem(
              "selectedTrip",
              JSON.stringify({
                ...tripData,
                imageUrl: image,
                newTrip: false,
              })
            );
          }
  
          setTrip({
            ...tripData,
            picture: image,
            days: [],
            budget: { amount: 0, expenses: [] },
          });
  
          setStartDate(tripData.startDate || null);
          setEndDate(tripData.endDate || null);
        } catch (err) {
          console.warn("Invalid trip data in localStorage.");
        }
      } else {
        // Load latest trip from DB
        try {
          const res = await fetch(
            "/CSE442/2025-Spring/cse-442aj/backend/api/trips/getLatestTrip.php"
          );
          const data = await res.json();
          if (data.success) {
            tripData = {
              name: data.trip.city_name,
              countryCode: data.trip.country_name,
              startDate: data.trip.start_date,
              endDate: data.trip.end_date,
            };
  
            const image = data.trip.image_url || "/CSE442/2025-Spring/cse-442aj/backend/uploads/default_img.png";
  
            setTrip({
              ...tripData,
              picture: image,
              days: [],
              budget: { amount: 0, expenses: [] },
            });
  
            setStartDate(tripData.startDate || null);
            setEndDate(tripData.endDate || null);
          } else {
            console.warn("No trip found in DB.");
          }
        } catch (err) {
          console.error("Error loading latest trip:", err);
        }
      }
  
      if (!tripData?.startDate || !tripData?.endDate) {
        setShowModal(true);
      }

      if (!tripData?.name) {
        setShowModal(false);
      }

    };

    loadTrip();

    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      console.log("Window width:", window.innerWidth, "| isMobile:", isNowMobile);
      setIsMobile(isNowMobile);
    };
  
    handleResize(); // Run on first load
    window.addEventListener("resize", handleResize); // Watch for resizes
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  
   
  }, []);
  

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

    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="profile-content">
          {showModal && (
            <div className="modal-example">
              <div className="modal travel-dates-modal">
                <h3>
                  <span>When</span> are you planning to travel?
                </h3>

                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <div className="travel-dates-modal">
                  <label>End Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    if (!startDate || !endDate) {
                      alert("Please select both start and end dates.");
                      return;
                    }

                    if (new Date(startDate) > new Date(endDate)) {
                      alert("End date cannot be before start date.");
                      return;
                    }

                    const diffTime = Math.abs(
                      new Date(endDate) - new Date(startDate)
                    );
                    const diffDays =
                      Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    const generatedDays = Array.from(
                      { length: diffDays },
                      () => ({
                        activities: [],
                      })
                    );

                    const updatedTrip = {
                      ...trip,
                      startDate,
                      endDate,
                      days: generatedDays,
                      budget: trip.budget || { amount: 0, expenses: [] },
                    };

                    setTrip(updatedTrip);
                    setShowModal(false);

                    const endpoint = "updateTripDates.php";

                    fetch(
                      `/CSE442/2025-Spring/cse-442aj/backend/api/trips/${endpoint}`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          city_name: updatedTrip.name,
                          country_name: updatedTrip.countryCode || null,
                          start_date: updatedTrip.startDate || null,
                          end_date: updatedTrip.endDate || null,
                        }),
                      }
                    )
                      .then((res) => res.json())
                      .then((data) => {
                        if (!data.success) {
                          console.error("Failed to save trip:", data.message);
                        } else {
                          console.log("Trip saved/updated successfully!");
                         
                          localStorage.setItem(
                            "selectedTrip",
                            JSON.stringify({
                              name: updatedTrip.name,
                              countryCode: updatedTrip.countryCode,
                              startDate: updatedTrip.startDate,
                              endDate: updatedTrip.endDate,
                              imageUrl: updatedTrip.picture || "",
                              newTrip: false,
                            })
                          );

                          const checkinglocalSt = localStorage.getItem("selectedTrip")
                          console.log("prrof is: ", checkinglocalSt)


                        }
                      })
                      .catch((err) => {
                        console.error("Error saving trip:", err);
                      });
                  }}
                >
                  Save Dates
                </button>
              </div>
            </div>
          )}

          <TripHeader
            firstName={user.firstName}
            lastName={user.lastName}
            picture={trip?.picture}
            editable={true}
          />

          <TripDetails
            trip={trip}
            setShowModal={setShowModal}
            editable={true}
          />
          {trip && <ShareTripButton />}
          {(trip && (trip.startDate && trip.endDate)) &&
            <div className="cart-buttons">
              <button className="cart-button" onClick={() => navigate("/profile/cart")}>Send to Cart</button>
            </div>
          }
        </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
