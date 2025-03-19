import React from "react";
import "../../styles/community/FriendsModal.css"

const FriendsModal = ({ isOpen, onClose, user, location, imageUrl, comment }) => {
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
      </div>
    </div>
  );
};

export default FriendsModal;
