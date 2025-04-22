import React, { useEffect, useState } from "react";
import "../../styles/dm/DirectMessage.css";
import boy from "../../assets/avatars/boy.png";
import girl from "../../assets/avatars/girl.png";
import UserAvatar from "../../assets/UserAvatar.png";
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
import { useNavigate } from "react-router-dom";

const dummyChats = [
  {
    name: "Jane",
    time: "5mins",
    message: "Hello are you home?",
    unread: 2,
    image: girl,
  },
  {
    name: "Leslie",
    time: "3:00PM",
    message: "Yes, I will be available tomorrow...",
    unread: 3,
    image: girl,
  },
  {
    name: "Dianne",
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
  const [friends, setFriends] = useState([]);
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

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(
          "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/getFriends.php",
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        console.log("DM frineds are, ", data);

        if (data.success) {
          setFriends(data.friends);
        } else {
          console.error("Failed to load friends:", data.message);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
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
        <div className="dm-header-container">
          <h2 className="dm-header">Chats</h2>
          <input className="dm-search-bar" type="text" placeholder="Search" />
        </div>

        <div className="chat-list">
          {dummyChats.map((chat, index) => (
            <div
              className="chat-item"
              key={index}
              onClick={() =>
                navigate(`/messages/${encodeURIComponent(chat.name)}`, {
                  state: { image: chat.image || UserAvatar },
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

        {friends.length === 0 ? (
          <div className="dm-empty-state">
            <p>No messages yet.</p>
            <div className="chat-list">
              {friends.map((friend, index) => (
                <div
                  className="chat-item"
                  key={index}
                  onClick={() =>
                    navigate(
                      `/messages/${encodeURIComponent(
                        friend.first_name + " " + friend.last_name
                      )}`,
                      {
                        state: { image: friend.user_image_url || UserAvatar },
                      }
                    )
                  }
                >
                  <img
                    className="chat-avatar"
                    src={
                      friend.user_image_url ? friend.user_image_url : UserAvatar
                    }
                    alt={friend.first_name}
                  />
                  <div className="chat-details">
                    <div className="chat-header">
                      <span className="chat-name">
                        {friend.first_name} {friend.last_name}
                      </span>
                    </div>
                    <div className="chat-message">Start a conversation</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-list">
            {friends.map((friend, index) => (
              <div
                className="chat-item"
                key={index}
                onClick={() =>
                  navigate(
                    `/messages/${encodeURIComponent(
                      friend.first_name + " " + friend.last_name
                    )}`,
                    {
                      state: {
                        image: friend.user_image_url || UserAvatar,
                      },
                    }
                  )
                }
              >
                <img
                  className="chat-avatar"
                  src={friend.user_image_url || UserAvatar}
                  alt={friend.first_name}
                />
                <div className="chat-details">
                  <div className="chat-header">
                    <span className="chat-name">
                      {friend.first_name} {friend.last_name}
                    </span>
                  </div>
                  <div className="chat-message">Start a conversation</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default DirectMessages;
