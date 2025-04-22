import React, { useEffect, useState } from "react";
import "../../styles/dm/DirectMessage.css";
import boy from "../../assets/avatars/boy.png";
import girl from "../../assets/avatars/girl.png";
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
import { useNavigate } from "react-router-dom";

const dummyChats = [
  {
    name: "Jane",
    emoji: "💕",
    time: "5mins",
    message: "Hello are you home?",
    unread: 2,
    image: girl,
  },
  {
    name: "Leslie",
    emoji: "🫸",
    time: "3:00PM",
    message: "Yes, I will be available tomorrow...",
    unread: 3,
    image: girl,
  },
  {
    name: "Dianne",
    emoji: "😍",
    time: "1:35PM",
    message: "Nice performance today dear!",
    unread: 0,
    image: girl,
  },
  {
    name: "Hawkins",
    time: "Yesterday",
    message: "Can we talk now?",
    unread: 0,
    image: boy,
  },
  {
    name: "Williamson",
    time: "Monday",
    message: "It's my pleasure",
    unread: 0,
    image: boy,
  },
  {
    name: "Jerome",
    time: "Wednesday",
    message: "Nice to meet you",
    unread: 0,
    image: boy,
  },
  {
    name: "Brooklyn",
    time: "3/10/22",
    message: "Would you rather...",
    unread: 0,
    image: girl,
  },
];

const DirectMessages = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 680;

      setIsMobile(isNowMobile);
    };

    handleResize(); // Run on first load
    window.addEventListener("resize", handleResize); // Watch for resizes

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Hamburger toggle for mobile */}
      {isMobile && (
        <MobileSidebarToggle
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* Sidebar: always visible on desktop, toggled on mobile */}
      <Sidebar isOpen={!isMobile || isSidebarOpen} />

      <div className="direct-messages-container">
        <h2 className="header">Chats</h2>
        <input className="dm-search-bar" type="text" placeholder="Search" />

        <div className="chat-list">
          {dummyChats.map((chat, index) => (
            <div
              className="chat-item"
              key={index}
              onClick={() =>
                navigate(`/messages/${encodeURIComponent(chat.name)}`, {
                  state: { image: chat.image }
                })
              }
            >
              <img className="chat-avatar" src={chat.image} alt={chat.name} />
              <div className="chat-details">
                <div className="chat-header">
                  <span className="chat-name">
                    {chat.name}
                    {chat.emoji && ` ${chat.emoji}`}
                  </span>
                  <span className="chat-time">{chat.time}</span>
                </div>
                <div className="chat-message">{chat.message}</div>
              </div>
              {chat.unread > 0 && (
                <div className="unread-badge">{chat.unread}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DirectMessages;
