import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/user/UserProfile.css";
import UserAvatar from "../../assets/UserAvatar.png";
import { encode } from "html-entities";
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
import { useNavigate, useParams } from "react-router-dom";

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

  const [bucketList, setBucketList] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const navigate = useNavigate();

  // Handle adding a destination to the bucket list
  const addDestination = async () => {
    if (!newDestination.trim()) return;
  
    try {
      const response = await fetch(
        "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/addToBucketList.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email, // from useParams()
            destination: newDestination.trim(),
          }),
        }
      );
  
      const result = await response.json();
  
      if (result.success) {
        setBucketList((prev) => [...prev, newDestination.trim()]);
        setNewDestination("");
      } else {
        alert("Failed to add destination: " + result.message);
      }
    } catch (error) {
      console.error("Error adding destination:", error);
      alert("Something went wrong while adding the destination.");
    }
  };  

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          `/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/getPublicUserInfo.php?email=${email}`
        );
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

    const fetchBucketList = async () => {
      try {
        const res = await fetch(`/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/getBucketList.php?email=${email}`);
        const data = await res.json();
        if (data.success) {
          setBucketList(data.bucketList);
        }
      } catch (err) {
        console.error("Failed to fetch bucket list:", err);
      }
    };
    
    fetchBucketList();

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
      <button className="back-btn" onClick={() => navigate("/community")}>
  ← Back to Community
</button>


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

        <div className="bucket-list user-profile-section">
          <h3>Travel Bucket List</h3>
          <ul>
            {bucketList.length === 0 ? (
              <p>No destinations added yet.</p>
            ) : (
              bucketList.map((place, index) => <li key={index}>{place}</li>)
            )}
          </ul>
          <div className="add-destination">
            <input
              type="text"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="Add a new destination..."
            />
            <button onClick={addDestination} className="add-new-dest-btn">
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TravelerProfile;
