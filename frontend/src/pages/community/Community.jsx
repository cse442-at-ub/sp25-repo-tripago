import { useState } from "react";
import "../../styles/community/Community.css";

const trips = [
  {
    id: 1,
    user: "John",
    location: "San Diego",
    comment: "One of my favorite vacations I’ve been on!",
    imageUrl: "https://via.placeholder.com/300", // Replace with actual trip image
  },
  {
    id: 2,
    user: "Emily",
    location: "Paris",
    comment: "Had the best croissants ever!",
    imageUrl: "https://via.placeholder.com/300",
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");

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
        <div className="incoming-requests">
          <h3>Incoming Requests</h3>
          <ul>
            <li>
              Anna <button className="accept-btn">Accept</button>
            </li>
            <li>
              Michael <button className="accept-btn">Accept</button>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Section: List of Trips */}
      <div className="trip-list">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            <h2>
              <span className="bold">{trip.user}'s</span> trip to{" "}
              <span className="highlight">{trip.location}</span>.
            </h2>
            <p className="trip-comment">"{trip.comment}"</p>
            <button className="send-request-btn">Send Request</button>
            <button className="view-more-btn">View More</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
