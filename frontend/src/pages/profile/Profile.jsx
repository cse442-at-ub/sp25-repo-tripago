import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTrip, setSelectedTrip] = useState(null);

  let incomingDestination = location.state || null;

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
      const tempStored = localStorage.getItem("selectedTrip")
      console.log("right when loading, localStorage has:", tempStored)
      let tripData = null;

      // 1. Check localStorage first (from AllTrips)
      const stored = localStorage.getItem("selectedTrip");
      // if (stored) {
      //   console.log("Fetching from localStorage")
      //   try {
      //     const parsed = JSON.parse(stored);
      //     tripData = {
      //       name: parsed.destination,
      //       countryCode: parsed.country_name || "",
      //       startDate: parsed.start_date || "",
      //       endDate: parsed.end_date || "",
      //       imageUrl: parsed.image_url || null,
      //     };
      //     console.log("Loaded trip from localStorage:", tripData);
      //     localStorage.removeItem("selectedTrip");
      //   } catch (err) {
      //     console.warn("Invalid JSON in localStorage");
      //   }
      // }
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          tripData = {
            name: parsed.name,
            countryCode: parsed.countryCode || "",
            startDate: parsed.startDate || "",
            endDate: parsed.endDate || "",
            imageUrl: parsed.imageUrl || null,
          };
          console.log("Loaded trip from localStorage:", tripData);
          // localStorage.removeItem("selectedTrip");
        } catch (err) {
          console.warn("Invalid JSON in localStorage");
        }
      }


      // console.log(
      //   "incomingDestination when load trip function begins: ",
      //   location.state
      // );
      // const isNewTrip = !!location.state?.name;

      // Else if NewTrip via location.state
      else if (location.state?.name) {
        tripData = {
          name: incomingDestination.name,
          countryCode: incomingDestination.countryCode || "",
          startDate: "", // allow empty
          endDate: "",
        };

        console.log("Sending to saveTrip.php:", {
          city_name: tripData.name,
          country_name: tripData.countryCode,
          start_date: "",
          end_date: "",
        });
        // Immediately save this new trip to DB
        fetch("/CSE442/2025-Spring/cse-442aj/backend/api/trips/saveTrip.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city_name: tripData.name,
            country_name: tripData.countryCode || null,
            start_date: null, // no dates yet
            end_date: null,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.text().then((text) => {
                throw new Error(text);
              });
            }
            return res.json();
          })
          .then((data) => {
            if (!data.success) {
              if (data.message.includes("Duplicate")) {
                // Use data.existing_id to update the existing trip
                console.log("Using existing trip:", data.existing_id);
              } else {
                console.error("Error:", data.message);
              }
            } else {
              console.log("New trip saved:", data.trip_id);
            }
          });

        // Clear the navigation state after using it
        navigate(location.pathname, { replace: true, state: null });
        console.log("Cleared location state");

        console.log(
          "incomingDestination when load trip function ends after change: ",
          incomingDestination
        );
      } else {
        // 2. Else, fetch most recent trip from backend
        console.log("FETCH LATEST TRIP FUNCTION STARTED!");
        try {
          const res = await fetch(
            "/CSE442/2025-Spring/cse-442aj/backend/api/trips/getLatestTrip.php"
          );
          const data = await res.json();
          console.log("API RESPONSE DATA:", data);
          console.log("TRIP OBJECT FROM API:", {
            city: data.trip?.city_name,
            country: data.trip?.country_name,
            start: data.trip?.start_date,
            end: data.trip?.end_date,
          });
          if (data.success) {
            tripData = {
              name: data.trip.city_name,
              countryCode: data.trip.country_name,
              startDate: data.trip.start_date,
              endDate: data.trip.end_date,
            };

            console.log("PROCESSED TRIP DATA:", tripData);
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

      setStartDate(tripData.startDate || null);
      setEndDate(tripData.endDate || null);

      if (!tripData.startDate || !tripData.endDate) {
        setShowModal(true);
      }
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

                    // const endpoint =
                    //   updatedTrip.startDate && updatedTrip.endDate
                    //     ? "updateTripDates.php"
                    //     : "saveTrip.php";

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
