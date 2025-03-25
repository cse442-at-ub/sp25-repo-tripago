import { useState } from "react";
import "../../styles/community/Community.css";
import paris from "../../assets/paris.jpg";
import sandiego from "../../assets/sandiego.jpg";
import FriendsModal from "../../components/community/FriendsModal.jsx";
import RequestsModal from "../../components/community/RequestsModal.jsx";
import axios from 'axios'


const trips = [
  {
    id: 1,
    user: "John",
    location: "San Diego",
    comment: "One of my favorite vacations I’ve been on!",
    imageUrl: sandiego,
  },
  {
    id: 2,
    user: "Emily",
    location: "Paris",
    comment: "Had the best croissants ever!",
    imageUrl: paris,
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const friendsList = ["John"]; //  Assume user is only friends with John
  const [modalType, setModalType] = useState(null);

  const isFriend = selectedTrip
    ? friendsList.includes(selectedTrip.user)
    : false;
  // Open modal with selected trip
  const handleViewMore = (trip) => {
    setSelectedTrip(trip);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTrip(null);
  };

  const incomingRequests = [
    { id: 1, name: "Anna" },
    { id: 2, name: "Michael" },
  ];

  const sentRequests = [
    { id: 1, name: "Sophia", status: "Pending" },
    { id: 2, name: "David", status: "Accepted" },
    { id: 3, name:"Joe", status: "pending"}
  ];


  const handleSend = async(e) => {

    e.preventDefault();
    console.log("Search term:", searchTerm);
    setSearchTerm("");

    

    try {
      const response = await axios.post("/CSE442/2025-Spring/cse-442aj/romanTest/backend/api/sendFriendRequest.php",{ searchTerm: searchTerm },{
        headers:{
          'Content-Type':'application/json'
        }
      })
      const result = response.data
      console.log("Send reponse: ",response.data);
      if (result.success){
        alert(result.message);
      } else {
        alert(result.message);
      }

    }catch(error){
      console.log("Error during search: ");

       if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
           console.error("Server responded with:", error.response.data);
    console.error("Status code:", error.response.status);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.error("No response received. Request:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request:", error.message);
  }
  console.error("Original error:", error); // Log the full error for debugging.
    }
  }

  return (
    <div className="community-container">
      {/* Top Section */}
      <div className="community-top">
        <div className="find-friends">
          <label className="find-friends-label">Find Friends</label>
          <input
            type="text"
            placeholder="Search by email"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        <button style={{ marginLeft: '10px' }} onClick={handleSend}>Send</button> 
        </div>
        {/* <div className="requests-list">
          <div className="incoming-requests">
            <h3>Incoming Requests</h3>
            <ul>
              <li>
                Anna
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
              <li>
                Michael
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="requests-list">
          <div className="incoming-requests">
            <h3>Sent Requests</h3>
            <ul>
              <li>
                Anna
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
              <li>
                Michael
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div> */}
          {/* Requests Section */}
          <div className="requests-section">
          <h3>Requests</h3>
          <button className="view-requests-btn" onClick={() => setModalType("incoming")}>
            View Incoming Requests
          </button>
          <button className="view-requests-btn" onClick={() => setModalType("sent")}>
            View Sent Requests
          </button>
        </div>
      </div>

      <div className="community-bottom">
        {/* Main Section: List of Trips */}
        <div className="trip-list">
          <h3>Discover Friends</h3>
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card">
              {/* Left Side: Text & Buttons */}
              <div className="trip-info">
                <h2>
                  <span className="bold">{trip.user}'s</span> trip to{" "}
                  <span className="highlight">{trip.location}</span>.
                </h2>
                <p className="trip-comment">"{trip.comment}"</p>
                {/* Hide "Send Request" button if already friends */}
                {!friendsList.includes(trip.user) && (
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
                  alt={trip.location}
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
      />
        {/* Requests Modal */}
        <RequestsModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType}
        incomingRequests={incomingRequests}
        sentRequests={sentRequests}
      />
    </div>

  );
};

export default Community;
