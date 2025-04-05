import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/user/UserProfile.css";
import UserAvatar from "../../assets/UserAvatar.png";
import { encode } from "html-entities";
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";

const TravelerProfile = () => {
  const { email } = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    profilePic: UserAvatar,
  });
  const [stats, setStats] = useState({ totalTrips: 0, countriesVisited: 0 });
  const [friends, setFriends] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/getPublicUserInfo.php?email=${email}`);
        const data = await res.json();
        if (data.success) {
          setUser({
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            profilePic: data.user.user_image_url || UserAvatar,
          });
          setStats({
            totalTrips: data.totalTrips,
            countriesVisited: data.countriesVisited,
          });
          setFriends(data.friends);
        }
      } catch (err) {
        console.error("Failed to fetch traveler info:", err);
      }
    };
  
    fetchUserInfo();
  
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      setIsMobile(isNowMobile);
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [email]);
  
  return (
    <>
      {isMobile && (
        <MobileSidebarToggle
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}
      <Sidebar isOpen={!isMobile || isSidebarOpen} />
      <div className="profile-container">
        <div className="profile-header user-profile-section">
          <img
            src={user.profilePic}
            alt="Traveler Avatar"
            className="profile-avatar"
          />
          <div className="header-info">
            <h1>
              {encode(user.firstName)} {encode(user.lastName)}
            </h1>
          </div>
        </div>

        <div className="trip-stats user-profile-section">
          <h3>Trip Stats</h3>
          <p>Total Trips Taken: {stats.totalTrips}</p>
          <p>Countries Visited: {stats.countriesVisited}</p>
        </div>

        <div className="friends-list user-profile-section">
          <h3>Friends</h3>
          <ul>
            {friends.length === 0 ? (
              <p>This traveler has no friends yet.</p>
            ) : (
              friends.map((friend, index) => (
                <li key={index}>{encode(friend.name)}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default TravelerProfile;
