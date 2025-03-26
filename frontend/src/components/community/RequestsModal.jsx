import React from "react";
import "../../styles/community/RequestsModal.css";

const RequestsModal = ({ isOpen, onClose, type, incomingRequests, sentRequests }) => {
  if (!isOpen) return null;

  const approveRequest = async(name) => {
    e.preventDefault();

    //name should have name of person, first and last

    const namesArray = name.split(" ");
    const first_name = namesArray[0];
    const last_name = namesArray[1];

    //associative array to send to backend with first and last name
    const formData = {first_name:first_name,last_name:last_name};

    try {
      //send request to approve request with first and last name
      const response = await axios.post("/CSE442/2025-Spring/cse-442aj/romanTest/backend/api/approveFrndReqst.php",formData,{
        headers:{
          'Content-Type':'application/json'
        }
      })

      
    } catch (error){

      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
     } else if (error.request) {
       console.error("No response received. Request:", error.request);
     } else {  
       console.error("Error setting up the request:", error.message);
     }
       console.error("Original error:", error); // Log the full error for debugging.
    }

  }


  return (
    <div className="request-modal-overlay modal-overlay">
      <div className="request-modal-content modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{type === "incoming" ? "Incoming Requests" : "Sent Requests"}</h2>

        {type === "incoming" ? (
          <ul className="requests-list">
            {incomingRequests.map((req) => (
              <li key={req.id}>
                {req.name}
                <div>
                  <button className="approve-btn"onClick={() => approveRequest(req.name)}>Approve</button>
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
