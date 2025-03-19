import React, { useEffect, useState } from "react";
import TripDetails from '../../components/trip/TripDetails.jsx'
import "../../styles/community/FriendsModal.css"

const FriendsModal = ({ isOpen, onClose, user, location, imageUrl, comment, isFriend}) => {
 
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>
          <span className="bold">{user}'s</span> trip to{" "}
          <span className="highlight">{location}</span>.
        </h2>
        <p className="trip-comment">"{comment}"</p>
        
        <div className="modal-image-container">
          <img src={imageUrl} alt={location} className="modal-image" />
          <p className="trip-location">Downtown {location}</p>
        </div>

        {!isFriend ? (
          <div className="friends-restriction">
            <p>You must be friends to view the itinerary.</p>
            <button className="send-request-btn">Send Friend Request</button>
          </div>
        ) : (
          /* If friends, show itinerary (In future, we will grab this information from db, maybe) */
          <div className="itinerary-section">
            <h3>Itinerary</h3>
            <ul>
              <li><b>Friday, January 24th:</b> Arrive at the Marriott, Beach sunset, Dinner at Surfside Taphouse</li>
              <li><b>Saturday, January 25th:</b> Explore downtown, Visit museums</li>
              <li><b>Sunday, January 26th:</b> Departure</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsModal;
