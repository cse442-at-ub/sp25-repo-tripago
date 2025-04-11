import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import '../../styles/trip/TripCollaborators.css'

const TripCollaborators = ({ tripId, firstName, lastName }) => {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState(""); 
  console.log("In TripCollabs, Username sent in is: ", username)
  console.log("and tripID is: ", tripId)

  const handleAddCollaborator = async () => {
    console.log("Username sent in is: ", username)
    console.log("tripID is: ", tripId)
    setError(""); 
    if (!username.trim()) return;

    console.log("2 Username sent in is: ", username)
    console.log("2 tripID is: ", tripId)

    try {
      const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/addCollaborator.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, username, firstName, lastName}),
      });

      const data = await res.json();
      if (data.success) {
        setError("");
        setUsername("");
      } else {
        setError(data.message || "Failed to add collaborator.");
      }
    } catch (err) {
      console.error("Add collaborator error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="collaborator-wrapper">
      <button className="collaborator-btn" onClick={() => setShowInput(prev => !prev)}>
        <FaUserPlus /> Manage Invites
      </button>

      {showInput && (
        <div className="collaborator-popup">
          <p className="collab-info">
            Share this trip with a friend by entering their username. They’ll be
            able to edit trip details with you!
          </p>
          <div className="collab-input-group">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={error ? "input-error" : ""}
            />
            <button className="collab-add-btn" onClick={handleAddCollaborator}>
              Add
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default TripCollaborators;
