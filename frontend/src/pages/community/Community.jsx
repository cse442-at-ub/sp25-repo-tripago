import { useState } from "react";
import "../../styles/community/Community.css";
import paris from "../../assets/paris.jpg";
import sandiego from "../../assets/sandiego.jpg";
import FriendsModal from "../../components/community/FriendsModal";

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

    // Open modal with selected trip
    const handleViewMore = (trip) => {
        setSelectedTrip(trip);
      };
    
      // Close modal
      const handleCloseModal = () => {
        setSelectedTrip(null);
      };

  return (
    <div className="community-container">
      {/* Top Section */}
      <div className="community-top">
        <div className="find-friends">
          <label className="find-friends-label">Find Friends</label>
          <input
            type="text"
            placeholder="Search by name"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="requests-list">
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
                <button className="send-request-btn">Send Request</button>
                <button className="view-more-btn" onClick={() => handleViewMore(trip)}>View More</button>
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
        onClose={handleCloseModal}
        user={selectedTrip?.user}
        location={selectedTrip?.location}
        imageUrl={selectedTrip?.imageUrl}
        comment={selectedTrip?.comment}
      />

    </div>
  );
};

export default Community;
