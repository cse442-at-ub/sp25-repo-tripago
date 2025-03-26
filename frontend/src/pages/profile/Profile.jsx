// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import TripHeader from "../../components/trip/TripHeader.jsx";
// import TripDetails from "../../components/trip/TripDetails.jsx";
// import ShareTripButton from "../../components/trip/ShareTripButton.jsx";
// import "../../styles/Profile.css";
// import parisPicture from "../../assets/paris.jpg";

// const Profile = () => {
//   const [user] = useState({
//     firstName: "Jane",
//     lastName: "Doe",
//     username: "Jane",
//   });

//   const location = useLocation();
//   const incomingDestination = location.state?.destination || null;

//   // const [trip, setTrip] = useState(null);
//   const [trip, setTrip] = useState(() => {
//     const saved = localStorage.getItem("trip");
//     return saved
//       ? JSON.parse(saved)
//       : {
//           location: "Paris, France",
//           startDate: "",
//           endDate: "",
//           picture: parisPicture,
//           days: [],
//           budget: { amount: 0, expenses: [] },
//         };
//   });
//   // const [showModal, setShowModal] = useState(!incomingDestination);
//   const [showModal, setShowModal] = useState(() => {
//     const savedTrip = localStorage.getItem("trip");
//     if (savedTrip) {
//       const trip = JSON.parse(savedTrip);
//       return !trip.startDate || !trip.endDate;
//     }
//     return !!incomingDestination; // Show if coming from new destination
//   });
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);

//   // Fetch image to display and cache it
//   useEffect(() => {
//     if (!incomingDestination) return;

//     const savedTrip = localStorage.getItem("trip");
//     if (savedTrip && JSON.parse(savedTrip).name === incomingDestination.name) {
//       return; // Don't override
//     }

//     const destination = incomingDestination;
//     if (!destination) return;

//     const cached = localStorage.getItem(`tripImage-${destination}`);
//     if (cached) {
//       setTrip({
//         location: destination,
//         startDate: new Date().toISOString().slice(0, 10), // today
//         endDate: null, // to be filled from modal
//         picture: cached,
//         days: [],
//         budget: {
//           amount: 0,
//           expenses: [],
//         },
//       });
//       return;
//     }

//     fetch(
//       `http://localhost:8000/api/images/pexelsSearch.php?query=${encodeURIComponent(
//         destination
//       )}`
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         const img = data.photos?.[0]?.src?.large || null;
//         if (img) {
//           localStorage.setItem(`tripImage-${destination}`, img);
//           setTrip({
//             location: destination,
//             startDate: new Date().toISOString().slice(0, 10),
//             endDate: null, // modal will set this
//             picture: img,
//             days: [],
//             budget: null,
//           });
//         }
//       })
//       .catch((err) => console.error("Pexels error:", err));
//   }, [incomingDestination]);

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-content">
//         <div className="profile-content">
//           {showModal && (
//             <div className="modal-example">
//               <div className="modal travel-dates-modal">
//                 <h3>
//                   <span>When</span> are you planning to travel?
//                 </h3>
//                 <p>You can change this later on!</p>

//                 <label>Start Date:</label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                 />
//                 <div className="travel-dates-modal">

//                 <label>End Date:</label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                 />
//                 </div>

//                 <button
//                   onClick={() => {
//                     if (!startDate || !endDate) {
//                       alert("Please select both start and end dates.");
//                       return;
//                     }

//                     if (new Date(startDate) > new Date(endDate)) {
//                       alert("End date cannot be before start date.");
//                       return;
//                     }

//                     const updatedTrip = {
//                       ...trip,
//                       startDate,
//                       endDate,
//                       budget: trip.budget || { amount: 0, expenses: [] },
//                     };

//                     setTrip(updatedTrip);
//                     localStorage.setItem("trip", JSON.stringify(updatedTrip));
//                     setShowModal(false);
//                   }}
//                 >
//                   Save Dates
//                 </button>
//               </div>
//             </div>
//           )}

//           <TripHeader
//             firstName={user.firstName}
//             lastName={user.lastName}
//             picture={trip?.picture}
//           />

//           <TripDetails trip={trip} setShowModal={setShowModal}/>
//           {trip && <ShareTripButton />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

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
  const incomingDestination = location.state || null;

  const [trip, setTrip] = useState(() => {
    const saved = localStorage.getItem("trip");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Paris",
          countryCode: "FR",
          startDate: "",
          endDate: "",
          picture: parisPicture,
          days: [],
          budget: { amount: 0, expenses: [] },
        };
  });

  const [showModal, setShowModal] = useState(() => {
    const savedTrip = localStorage.getItem("trip");
    if (savedTrip) {
      const trip = JSON.parse(savedTrip);
      return !trip.startDate || !trip.endDate;
    }
    return !!incomingDestination;
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch image to display and cache it
  useEffect(() => {
    if (!incomingDestination?.name) return;

    const savedTrip = localStorage.getItem("trip");
    if (savedTrip && JSON.parse(savedTrip).name === incomingDestination.name) {
      return;
    }

    const destination = incomingDestination;
    const cacheKey = `tripImage-${destination.name}`;

    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setTrip({
        name: destination.name,
        countryCode: destination.countryCode,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: null,
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
        destination.name
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        const img = data.photos?.[0]?.src?.large || parisPicture;
        localStorage.setItem(cacheKey, img);
        setTrip({
          name: destination.name,
          countryCode: destination.countryCode,
          startDate: new Date().toISOString().slice(0, 10),
          endDate: null,
          picture: img,
          days: [],
          budget: {
            amount: 0,
            expenses: [],
          },
        });
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
                    localStorage.setItem("trip", JSON.stringify(updatedTrip));
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

          <TripDetails trip={trip} setShowModal={setShowModal} />
          {trip && <ShareTripButton />}
        </div>
      </div>
    </div>
  );
};

export default Profile;
