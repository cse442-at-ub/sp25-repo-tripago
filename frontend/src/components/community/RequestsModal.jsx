import React from "react";
import "../../styles/community/RequestsModal.css";

const RequestsModal = ({ isOpen, onClose, type, incomingRequests, sentRequests }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{type === "incoming" ? "Incoming Requests" : "Sent Requests"}</h2>

        {type === "incoming" ? (
          <ul className="requests-list">
            {incomingRequests.map((req) => (
              <li key={req.id}>
                {req.name}
                <div>
                  <button className="approve-btn">Approve</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="requests-list">
            {sentRequests.map((req) => (
              <li key={req.id}>
                {req.name} <span className={`status ${req.status.toLowerCase()}`}>{req.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RequestsModal;
