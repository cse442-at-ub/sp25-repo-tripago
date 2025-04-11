import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import "../../styles/trip/TripCollaborators.css";

const TripCollaborators = ({ tripId, firstName, lastName }) => {
  const [showInput, setShowInput] = useState(false);
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);

  const handleAddCollaborator = async () => {
    setError("");
    if (!username.trim()) return;

    console.log("2 Username sent in is: ", username);
    console.log("2 tripID is: ", tripId);

    try {
      const res = await fetch(
        "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/addCollaborator.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId, username, firstName, lastName }),
        }
      );

      const data = await res.json();
      if (data.success) {
        console.log("username added is", username)
        setInvitedUsers((prev) => [...prev, { username }]);
        console.log("invitedUsers is", invitedUsers)

        setError("");
        setUsername("");

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1300);

        
      } else {
        setError(data.message || "Failed to add collaborator.");
      }
    } catch (err) {
      console.error("Add collaborator error:", err);
      setError("Something went wrong. Try again.");
    }
  };

  const handleRemoveInvite = async (usernameToRemove) => {
    try {
      const res = await fetch(
        "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/removeCollaborator.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId, username: usernameToRemove }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setInvitedUsers((prev) =>
          prev.filter((u) => u.username !== usernameToRemove)
        );
        setShowRemoved(true);
        setTimeout(() => setShowRemoved(false), 1300);
      } else {
        console.error("Failed to remove invite:", data.message);
      }
    } catch (err) {
      console.error("Remove collaborator error:", err);
    }
  };

  return (
    <div className="collaborator-wrapper">
      <button
        className="collaborator-btn"
        onClick={() => setShowInput((prev) => !prev)}
      >
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
              Send Invite
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
         
         {invitedUsers.length > 0 && (
        <div className="invited-list">
          {invitedUsers.map((u, i) => (
            <div key={i} className="invited-user">
              You invited {u.username}.
              <button
                className="invited-remove-btn"
                onClick={() => handleRemoveInvite(u.username)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
        </div>
      )}

    

      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal-content send-req-modal-content">
            Invite sent successfully
          </div>
        </div>
      )}

      {showRemoved && (
        <div className="modal-overlay">
          <div className="modal-content send-req-modal-content">
            Invite removed successfully
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCollaborators;
