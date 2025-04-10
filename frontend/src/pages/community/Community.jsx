import { useEffect, useState } from "react";
import "../../styles/community/Community.css";
import paris from "../../assets/paris.jpg";
import sandiego from "../../assets/sandiego.jpg";
import FriendsModal from "../../components/community/FriendsModal.jsx";
import RequestsModal from "../../components/community/RequestsModal.jsx";
import axios from "axios";
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
import { encode } from "html-entities";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext.jsx";
import UserAvatar from "../../assets/UserAvatar.png";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const [trips, setTrips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [friendsList, setFriendsList] = useState([]); //
  const [modalType, setModalType] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          "/CSE442/2025-Spring/cse-442aj/backend/api/getFriends.php",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success) {
          // Save emails only
          const emails = data.friends.map((friend) => friend.email);
          setFriendsList(emails);
        } else {
          console.warn("Failed to fetch friends:", data.message);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    console.log("Fetching community trips:");

    axios
      .get(
        "/CSE442/2025-Spring/cse-442aj/backend/api/trips/getCommunityTrips.php"
      )
      .then((res) => {
        setTrips(res.data);
        console.log("Community trips generated from db are: ", res.data);
      })
      .catch((err) => {
        console.error("Failed to load trips", err);
      });
  }, []);

  const isFriend = selectedTrip
    ? friendsList.includes(selectedTrip.email)
    : false;
  // Open modal with selected trip
  const handleViewMore = (trip) => {
    setSelectedTrip(trip);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTrip(null);
  };

  const [incomingRequests, setIncomingRequests] = useState([]);

  const [sentRequests, setSentRequests] = useState([]); // Initialize as empty array

  const [searchError, setSearchError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(""); // Hide modal after 2 seconds
      }, 1000);

      return () => clearTimeout(timer); // Cleanup on unmount or if message changes
    }
  }, [successMessage]);

  const handleSend = async (e) => {
    e.preventDefault();
    console.log("Search term:", searchTerm);
    setSearchTerm("");
    setSearchError(""); // reset any previous error
    try {
      const response = await axios.post(
        "/CSE442/2025-Spring/cse-442aj/backend/api/sendFriendRequest.php",
        { searchTerm: searchTerm },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      console.log("Send reponse: ", response.data);
      if (result.success) {
        setSuccessMessage(result.message);
        setSearchError("");
        setSearchTerm("");
      } else {
        setSearchError(result.message);
      }
    } catch (error) {
      console.log("Error during search: ");
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
      console.error("Original error:", error); // Log the full error for debugging.
    }
  };

  //called when you click "view sent requests" button
  //Will show you requests that you sent
  const getSentRequests = async (e) => {
    try {
      console.log("hello!");
      const response = await axios.post(
        "/CSE442/2025-Spring/cse-442aj/backend/api/getSentRequests.php",
        { test: "empty" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      console.log(result);

      let newSentRequests = []; // Create a new array

      //handle accepted names
      if (result[0].length > 0) {
        result[0].forEach((name) => {
          newSentRequests.push({
            id: Date.now() + Math.random(),
            name: name,
            status: "Accepted",
          });
        });
      }
      //handle pending names
      if (result[1].length > 0) {
        result[1].forEach((name) => {
          newSentRequests.push({
            id: Date.now() + Math.random(),
            name: name,
            status: "Pending",
          });
        });
      }

      setSentRequests(newSentRequests); // Update sentRequests with the new array

      //result should have a list of lists of names??
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
      console.error("Original error:", error); // Log the full error for debugging.
    }
  };

  const getIncomingRequests = async (e) => {
    try {
      const response = await axios.post(
        "/CSE442/2025-Spring/cse-442aj/backend/api/getIncFriends.php",
        { test: "empty" },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;
      console.log(result);

      let newIncFriends = [];

      if (result.length > 0) {
        result.forEach((name) => {
          newIncFriends.push({
            id: Date.now() + Math.random(),
            name: name,
          });
        });
      }

      setIncomingRequests(newIncFriends);
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
      console.error("Original error:", error); // Log the full error for debugging.
    }
  };

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
      <div className="community-container">
        {/* Top Section */}
        <div className="community-top">
          <div className="find-friends">
            <label className="find-friends-label">Find Friends</label>

            <div className="find-friends-inputs">
              <input
                type="text"
                placeholder="Search by username"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: searchError ? "0.9px solid red" : undefined }}
              />
              <button style={{ marginLeft: "10px" }} onClick={handleSend}>
                Send
              </button>
              {successMessage && (
                <div className="modal-overlay">
                  <div className="modal-content send-req-modal-content">
                    {successMessage}
                  </div>
                </div>
              )}
            </div>
            {searchError && (
              <p
                style={{
                  color: "red",
                  marginTop: "2px",
                  marginBottom: "2px",
                  fontSize: "0.9em",
                }}
              >
                {searchError}
              </p>
            )}
          </div>
          {/* Requests Section */}
          <div className="requests-section">
            <h3>Requests</h3>
            <button
              className="view-requests-btn"
              onClick={() => {
                setModalType("incoming");
                getIncomingRequests();
              }}
            >
              View Incoming Requests
            </button>
            <button
              className="view-requests-btn"
              onClick={() => {
                setModalType("sent");
                getSentRequests();
              }}
            >
              View Friends
            </button>
          </div>
        </div>

        <div className="community-bottom">
          {/* Main Section: List of Trips */}
          <div className="trip-list">
            <h3>Discover Friends</h3>
            {trips
              .filter((trip) => trip.email !== user?.email)
              .map((trip) => (
                <div key={trip.id} className="trip-card">
                  {/* Left Side: Text & Buttons */}

                  <div className="trip-info">
                    <div className="trip-header">
                      {console.log("default", UserAvatar)}

                      <img
                        src={
                          trip.userImageUrl && trip.userImageUrl.trim() !== ""
                            ? trip.userImageUrl
                            : UserAvatar
                        }
                        onError={(e) => {
                          console.warn("Image failed to load for", trip.user);
                          e.target.onerror = null;
                          e.target.src = UserAvatar;
                        }}
                        alt="User avatar"
                        className="profile-image"
                      />

                      <h2>
                        <span
                          className="bold clickable-name"
                          onClick={() =>
                            navigate(
                              `/traveler-profile/${encodeURIComponent(
                                trip.email
                              )}`
                            )
                          }
                        >
                          {encode(trip.user)}'s
                        </span>{" "}
                        trip to{" "}
                        <span className="highlight">
                          {encode(trip.location)}
                        </span>
                        .
                      </h2>
                    </div>

                    {trip.comment && (
                      <p className="trip-comment">"{encode(trip.comment)}"</p>
                    )}
                    {/* Hide "Send Request" button if already friends */}
                    {!friendsList.includes(trip.email) && (
                      <button className="send-request-btn">Send Request</button>
                    )}
                    <button
                      className="view-more-btn"
                      onClick={() => handleViewMore(trip)}
                    >
                      View More
                    </button>
                  </div>

                  {/* Right Side: Image */}
                  <div className="community-image">
                    <img
                      src={trip.imageUrl}
                      alt={encode(trip.location)}
                      className="trip-image"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <FriendsModal
          isOpen={selectedTrip !== null}
          onClose={() => setSelectedTrip(null)}
          user={selectedTrip?.user}
          location={selectedTrip?.location}
          imageUrl={selectedTrip?.imageUrl}
          comment={selectedTrip?.comment}
          isFriend={isFriend}
          tripId={selectedTrip?.id}
          userEmail={selectedTrip?.email}
          currentUserEmail={user?.email}
        />
        {/* Requests Modal */}
        <RequestsModal
          isOpen={modalType !== null}
          onClose={() => setModalType(null)}
          type={modalType}
          incomingRequests={incomingRequests}
          setIncomingRequests={setIncomingRequests}
          sentRequests={sentRequests}
        />
      </div>
    </>
  );
};

export default Community;
