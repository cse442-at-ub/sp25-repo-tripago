import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";

const TripCollaborators = ({ tripId }) => {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");

  const handleAddCollaborator = async () => {
    if (!username.trim()) return;

    try {
      const res = await fetch("/CSE442/2025-Spring/cse-442aj/backend/api/trips/addCollaborator.php", {
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
    <div className="trip-collaborators">
      <button
        className="add-collab-btn"
        onClick={() => setShowInput((prev) => !prev)}
      >
        <FaUserPlus /> Plan with others
      </button>

      {showInput && (
        <div className="collab-input-container">
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleAddCollaborator}>Add</button>
        </div>
      )}
    </div>
  );
};

export default TripCollaborators;
