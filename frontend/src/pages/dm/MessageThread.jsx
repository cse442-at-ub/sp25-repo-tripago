import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/dm/MessageThread.css";
import boy from "../../assets/avatars/boy.png";
import girl from "../../assets/avatars/girl.png";
import { useNavigate } from "react-router-dom";

const dummyMessages = [
  { sender: "them", text: "Hey! Are you there?", time: "3:01 PM" },
  { sender: "me", text: "Yep! Just got back home.", time: "3:03 PM" },
  { sender: "them", text: "Did you check the trip plan?", time: "3:04 PM" },
  { sender: "me", text: "I did. Looks amazing. We should book it.", time: "3:05 PM" },
  { sender: "them", text: "Awesome, let’s lock it in.", time: "3:06 PM" }
];

const MessageThread = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const avatar = name === "Brooklyn" || name === "Hawkins" || name === "Williamson" ? boy : girl;

  return (
    <div className="message-thread-container">
      <div className="message-thread-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <img src={avatar} alt={name} className="thread-avatar" />
        <h2 className="thread-name">{name}</h2>
      </div>

      <div className="message-bubble-list">
        {dummyMessages.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${msg.sender === "me" ? "from-me" : "from-them"}`}
          >
            <div className="bubble-text">{msg.text}</div>
            <div className="bubble-time">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <input
          className="message-input"
          placeholder="Type a message..."
        />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};

export default MessageThread;
