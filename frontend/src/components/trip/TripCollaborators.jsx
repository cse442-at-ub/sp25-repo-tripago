import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import '../../styles/trip/TripCollaborators.css'

const TripCollaborators = ({ tripId }) => {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");

  const handleAddCollaborator = async () => {
    if (!username.trim()) return;

    try {
      const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/addCollaborator.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, username }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Collaborator added!");
        setUsername("");
      } else {
        alert(data.message || "Failed to add collaborator.");
      }
    } catch (err) {
      console.error("Add collaborator error:", err);
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
            />
            <button className="collab-add-btn" onClick={handleAddCollaborator}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCollaborators;
