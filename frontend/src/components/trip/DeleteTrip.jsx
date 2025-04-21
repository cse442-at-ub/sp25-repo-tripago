import React, { useState } from "react";
import axios from "axios";
import { FaRegTrashAlt } from "react-icons/fa";

const DeleteTrip = () => {
  
  const handleDeleteTrip = async () => {

    setVisible(!visible)

  };
  
  const [visible, setVisible] = useState(false);

  return (
    <div className="delete-trip-wrapper">
      {visible &&
        <div className="delete-trip-box">
          Are you sure you want to delete this trip? This action cannot be undone.
          <button className="confirm-delete" onClick={() => handleDeleteTrip()}>Delete</button>
          <button className="cancel-delete" onClick={() => setVisible(!visible)}>Cancel</button>
        </div>
      }
      <button className="delete-trip-button" onClick={() => setVisible(!visible)}>
        <FaRegTrashAlt/>
      </button>
    </div>
  );
};


export default DeleteTrip;
