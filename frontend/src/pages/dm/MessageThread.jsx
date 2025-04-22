import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../../styles/dm/MessageThread.css";
import Van from "../../assets/Van.png";

const MessageThread = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const navigate = useNavigate();
  const location = useLocation();
  const avatar = location.state?.image;
  const email = location.state?.email;

  const [showDummyMessages, setShowDummyMessages] = React.useState(true);

  const dummyMessages = showDummyMessages
    ? [
        { sender: "them", text: "Hey! Are you there?", time: "3:01 PM" },
        { sender: "me", text: "Yep! Just got back home.", time: "3:03 PM" },
        {
          sender: "them",
          text: "Did you check the trip plan?",
          time: "3:04 PM",
        },
        {
          sender: "me",
          text: "I did. Looks amazing. We should book it.",
          time: "3:05 PM",
        },
        { sender: "them", text: "Awesome, let’s lock it in.", time: "3:06 PM" },
      ]
    : [];

  return (
    <div className="message-thread-container">
      <div className="message-thread-header">
        <button className="dm-back-button" onClick={() => navigate(-1)}>
          ←
        </button>
        <img src={avatar} alt={name} className="thread-avatar" />
        <h2
          className="thread-name"
          onClick={() =>
            navigate(`/traveler-profile/${encodeURIComponent(email)}`)
          }
        >
          {decodedName}
        </h2>
      </div>

      <button
        className="toggle-view-button"
        onClick={() => setShowDummyMessages((prev) => !prev)}
      >
        {showDummyMessages ? "Show Empty State" : "Show Messages"}
      </button>

      <div className="message-bubble-list">
        {dummyMessages.length === 0 ? (
          <div className="thread-empty-state">
            <img
              src={Van}
              alt="Van illustration"
              className="thread-empty-image"
            />
            <p className="thread-empty-title">No messages yet</p>
            <p className="thread-empty-sub">
              Start the conversation with {decodedName.split(" ")[0]}
            </p>
          </div>
        ) : (
          dummyMessages.map((msg, i) => (
            <div
              key={i}
              className={`message-bubble ${
                msg.sender === "me" ? "from-me" : "from-them"
              }`}
            >
              <div className="bubble-text">{msg.text}</div>
              <div className="bubble-time">{msg.time}</div>
            </div>
          ))
        )}
      </div>

      <div className="message-input-container ">
        <input className="message-input" placeholder="Type a message..." />
        <button className="collab-add-btn">Send</button>
      </div>
    </div>
  );
};

export default MessageThread;
