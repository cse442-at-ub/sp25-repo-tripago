import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const DeleteComment = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="delete-comment-wrapper">
      {visible &&
        <div className="delete-comment-box">
          Are you sure you want to delete this comment?
          <button>Yes</button>
          <button>No</button>
        </div>
      }
      <button className="delete-comment-button" onClick={() => setVisible(!visible)}>
        <FaRegTrashAlt/>
      </button>
    </div>
  );
};


export default DeleteComment;
