import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TripHeader from "../../components/trip/TripHeader.jsx";
import TripDetails from "../../components/trip/TripDetails.jsx";
import ShareTripButton from "../../components/trip/ShareTripButton.jsx";
import "../../styles/Profile.css";
import airplaneIllustration from "../../assets/airplane.svg";

const Profile = () => {
  const [user] = useState({
    firstName: "Jane",
    lastName: "Doe",
    username: "Jane",
  });

  const location = useLocation();
  const incomingDestination = location.state || null;

  const [trip, setTrip] = useState({
    name: "",
    countryCode: "",
    startDate: "",
    endDate: "",
    picture: airplaneIllustration,
    days: [],
    budget: { amount: 0, expenses: [] },
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // const [showModal, setShowModal] = useState(() => {
  //   return !!incomingDestination;
  // });
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
      let tripData = null;
  
      // 1. Use incomingDestination if available
      if (incomingDestination?.name) {
        tripData = {
          name: incomingDestination.name,
          countryCode: incomingDestination.countryCode || "",
          startDate: new Date().toISOString().slice(0, 10),
          endDate: null,
        };
      } else {
        // 2. Else, fetch most recent trip from backend
        try {
          const res = await fetch("/CSE442/2025-Spring/cse-442aj/backend/api/trips/getLatestTrip.php");
          const data = await res.json();
          if (data.success) {
            tripData = {
              name: data.trip.city_name,
              countryCode: data.trip.country_name || "",
              startDate: data.trip.start_date,
              endDate: data.trip.end_date,
            };
          } else {
            console.warn("No trip found in DB");
            return;
          }
        } catch (err) {
          console.error("Error fetching latest trip:", err);
          return;
        }
      }
  
      // 3. Get image and set trip
      const image = await fetchTripImage(tripData.name);
      setTrip({
        ...tripData,
        picture: image,
        days: [],
        budget: { amount: 0, expenses: [] },
      });

      // if (!tripData.startDate || !tripData.endDate) {
      //   setShowModal(true);
      // }
    };
  
    loadTrip();
  }, [incomingDestination]);
  

  return (
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

                    const endpoint =
                      updatedTrip.startDate && updatedTrip.endDate
                        ? "updateTripDates.php"
                        : "saveTrip.php";

                    fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/trips/${endpoint}`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        city_name: updatedTrip.name,
                        country_name: updatedTrip.countryCode || "",
                        start_date: updatedTrip.startDate,
                        end_date: updatedTrip.endDate,
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (!data.success) {
                          console.error("Failed to save trip:", data.message);
                        } else {
                          console.log("Trip saved/updated successfully!");
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
          />

          <TripDetails trip={trip} setShowModal={setShowModal} />
          {trip && <ShareTripButton />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
