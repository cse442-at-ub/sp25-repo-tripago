import React, { useState } from "react";
import { FaComments } from "react-icons/fa";

const DiscussionBar = ({ tripId }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      // You'll implement backend chat later
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div className={`discussion-bar ${open ? "open" : "collapsed"}`}>
      <div className="discussion-header" onClick={() => setOpen(!open)}>
        <FaComments /> {open ? "Discussion" : ""}
      </div>
      {open && (
        <div className="discussion-body">
          <div className="messages-placeholder">
            {/* You'll eventually render messages here */}
            <p>No messages yet. Start the conversation!</p>
          </div>
          <div className="discussion-input">
            <input
              type="text"
              placeholder="Type your suggestions here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionBar;
