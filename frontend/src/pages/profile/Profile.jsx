import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TripHeader from "../../components/trip/TripHeader.jsx";
import TripDetails from "../../components/trip/TripDetails.jsx";
import ShareTripButton from "../../components/trip/ShareTripButton.jsx";
import "../../styles/Profile.css";
import parisPicture from "../../assets/paris.jpg";

const Profile = () => {
  const [user] = useState({
    firstName: "Jane",
    lastName: "Doe",
    username: "Jane",
  });

  const location = useLocation();
  const incomingDestination = location.state?.destination || null;

  const [trip, setTrip] = useState(null);
  const [showModal, setShowModal] = useState(!!incomingDestination);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch image to display and cache it
  useEffect(() => {
    const destination = incomingDestination;
    if (!destination) return;

    const cached = localStorage.getItem(`tripImage-${destination}`);
    if (cached) {
      setTrip({
        location: destination,
        startDate: new Date().toISOString().slice(0, 10), // today
        endDate: "", // to be filled from modal
        picture: cached,
        days: [],
        budget: {
          amount: 0,
          expenses: [],
        },
      });
      return;
    }

    fetch(
      `http://localhost:8000/api/images/pexelsSearch.php?query=${encodeURIComponent(
        destination
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        const img = data.photos?.[0]?.src?.large || null;
        if (img) {
          localStorage.setItem(`tripImage-${destination}`, img);
          setTrip({
            location: destination,
            startDate: new Date().toISOString().slice(0, 10),
            endDate: "", // modal will set this
            picture: img,
            days: [],
            budget: null,
          });
        }
      })
      .catch((err) => console.error("Pexels error:", err));
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

                    setTrip((prev) => ({
                      ...prev,
                      startDate,
                      endDate,
                      // optionally initialize budgeting for safety
                      budget: prev.budget || { amount: 0, expenses: [] },
                    }));

                    setShowModal(false);
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

          <TripDetails trip={trip} />
          {trip && <ShareTripButton />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
