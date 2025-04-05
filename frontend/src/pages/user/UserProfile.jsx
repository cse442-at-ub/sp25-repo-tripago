// import React, { useEffect, useState } from "react";
// import "../../styles/user/UserProfile.css";
// import UserAvatar from "../../assets/UserAvatar.png";
// import { useNavigate } from "react-router-dom";
// import { FaEdit } from "react-icons/fa";
// import Sidebar from "../../components/Sidebar";
// import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
// import { encode } from "html-entities";

// // Hardcoded friends data
// const friendsData = ["Alice Johnson", "Michael Smith", "Samantha Lee"];

// const UserProfile = () => {
//   const [user, setUser] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     profilePic: UserAvatar,
//   });

//   const [friends, setFriends] = useState([]);

//   const [stats, setStats] = useState({
//     totalTrips: 0,
//     countriesVisited: 0,
//   });

//   const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);

//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const res = await fetch(
//           "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/users/getUserInfo.php",
//           {
//             credentials: "include",
//           }
//         );
//         const data = await res.json();
//         console.log("User data received:", data);

//         if (data.success) {
//           setUser({
//             firstName: data.user.first_name,
//             lastName: data.user.last_name,
//             email: data.user.email,
//             profilePic: data.user.user_image_url || UserAvatar,
//           });
//         } else {
//           console.warn("Could not fetch user info:", data.message);
//         }
//       } catch (err) {
//         console.error("Failed to fetch user:", err);
//       }
//     };

//     fetchUserInfo();

//     const fetchStats = async () => {
//       try {
//         const res = await fetch(
//           "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/getTripStats.php",
//           {
//             credentials: "include",
//           }
//         );
//         const data = await res.json();
//         if (data.success) {
//           setStats({
//             totalTrips: data.totalTrips,
//             countriesVisited: data.countriesVisited,
//           });
//         } else {
//           console.error("Failed to fetch stats:", data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       }
//     };

//     fetchStats();

//     const fetchFriends = async () => {
//       try {
//         const res = await fetch(
//           "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/getFriends.php",
//           {
//             credentials: "include",
//           }
//         );
//         const data = await res.json();
//         if (data.success) {
//           setFriends(data.friends);
//         } else {
//           console.warn("Failed to fetch friends:", data.message);
//         }
//       } catch (err) {
//         console.error("Error fetching friends:", err);
//       }
//     };

//     fetchFriends();

//     const fetchBucketList = async () => {
//       try {
//         const res = await fetch(`/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/getBucketList.php?email=${email}`);
//         const data = await res.json();
//         if (data.success) {
//           setBucketList(data.bucketList);
//         }
//       } catch (err) {
//         console.error("Failed to fetch bucket list:", err);
//       }
//     };
    
//     fetchBucketList();

//     const handleResize = () => {
//       const isNowMobile = window.innerWidth <= 480;
//       console.log(
//         "Window width:",
//         window.innerWidth,
//         "| isMobile:",
//         isNowMobile
//       );

//       setIsMobile(isNowMobile);
//       console.log("is mobile: ", isNowMobile);
//     };

//     handleResize(); // Run on first load
//     window.addEventListener("resize", handleResize); // Watch for resizes

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const [isHovered, setIsHovered] = useState(false);

//   // Handle image selection and save to localStorage
//   const handleImageChange = async (event) => {
//     console.log("Trying to handle image change...");
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const res = await fetch(
//         "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/users/uploadUserImage.php",
//         {
//           method: "POST",
//           body: formData,
//           credentials: "include",
//         }
//       );

//       const data = await res.json();
//       console.log("Data recieved on image change: ", data);

//       if (data.success) {
//         console.log("Success recieved in image change.");
//         setUser((prev) => ({
//           ...prev,
//           profilePic: `${data.imageUrl}?t=${Date.now()}`, // prevents browser cache
//         }));
//         const tempUser = user.imageUrl;
//         console.log("temp user is:", tempUser);
//       } else {
//         console.error("Upload failed:", data.message);
//       }
//     } catch (err) {
//       console.error("Image upload error:", err);
//     }
//   };

//   const [bucketList, setBucketList] = useState([]);
//   const [newDestination, setNewDestination] = useState("");

//   // Handle adding a destination to the bucket list
//   const addDestination = async () => {
//     if (!newDestination.trim()) return;
  
//     try {
//       const response = await fetch(
//         "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/addToBucketList.php",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: email, // from useParams()
//             destination: newDestination.trim(),
//           }),
//         }
//       );
  
//       const result = await response.json();
  
//       if (result.success) {
//         setBucketList((prev) => [...prev, newDestination.trim()]);
//         setNewDestination("");
//       } else {
//         alert("Failed to add destination: " + result.message);
//       }
//     } catch (error) {
//       console.error("Error adding destination:", error);
//       alert("Something went wrong while adding the destination.");
//     }
//   };  

//   const navigate = useNavigate();

//   return (
//     <>
//       {/* Hamburger toggle for mobile */}
//       {isMobile && (
//         <MobileSidebarToggle
//           isOpen={isSidebarOpen}
//           toggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
//         />
//       )}

//       {/* Sidebar: always visible on desktop, toggled on mobile */}
//       {console.log("send to sidebar: ", !isMobile || isSidebarOpen)}
//       <Sidebar isOpen={!isMobile || isSidebarOpen} />
//       <div className="profile-container">
//         {/* User Profile Section */}
//         <div className="profile-header user-profile-section">
//           {/* Profile Picture Upload */}
//           <label
//             htmlFor="profile-pic-upload"
//             className="profile-pic-label"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <img
//               src={user.profilePic}
//               alt="User Avatar"
//               className="profile-avatar"
//             />
//           </label>
//           <input
//             type="file"
//             id="profile-pic-upload"
//             accept="image/*"
//             onChange={handleImageChange}
//             style={{ display: "none" }} // Hide input field
//           />
//           <p className="update-text">Click image to update</p>

//           <div className="header-info">
//             <h1>
//               {encode(user.firstName)} {encode(user.lastName)}
//             </h1>

//             <button
//               className="edit-name-btn"
//               onClick={() => navigate("/settings/profile-details")}
//             >
//               <FaEdit /> Edit Name
//             </button>
//           </div>
//         </div>

//         {/* View All Trips Section */}
//         <div className="view-all-trips user-profile-section">
//           <div className="view-all-trips-section">
//             <h3>Trips</h3>
//             <button
//               className="view-all-trips-btn"
//               onClick={() => navigate("/all-trips")}
//             >
//               View Your Trips →
//             </button>
//           </div>
//         </div>

//         {/* Travel Bucket List */}
//         <div className="bucket-list user-profile-section">
//           <h3>Travel Bucket List</h3>
//           <ul>
//             {bucketList.length === 0 ? (
//               <p>No destinations added yet.</p>
//             ) : (
//               bucketList.map((place, index) => (
//                 <li key={index}>{place}</li>
//               ))
//             )}
//           </ul>
//           <div className="add-destination">
//             <input
//               type="text"
//               value={newDestination}
//               onChange={(e) => setNewDestination(e.target.value)}
//               placeholder="Add a new destination..."
//             />
//             <button onClick={addDestination} className="add-new-dest-btn">
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Trip Stats */}
//         <div className="trip-stats user-profile-section">
//           <h3>Trip Stats</h3>
//           <p>Total Trips Taken: {stats.totalTrips}</p>
//           <p>Countries Visited: {stats.countriesVisited}</p>
//         </div>

//         {/* Friends List */}
//         <div className="friends-list user-profile-section">
//           <h3>Friends</h3>
//           <ul>
//             {friends.length === 0 ? (
//               <p>You have no friends yet.</p>
//             ) : (
//               friends.map((friend, index) => (
//                 <li key={index}>{encode(friend)}</li>
//               ))
//             )}
//           </ul>
//           <p
//             onClick={() => navigate("/community")}
//             className="find-new-friends-p"
//           >
//             Find new friends in the Community tab →
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserProfile;
import React, { useEffect, useState } from "react";
import "../../styles/user/UserProfile.css";
import UserAvatar from "../../assets/UserAvatar.png";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import Sidebar from "../../components/Sidebar";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";
import { encode } from "html-entities";

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePic: UserAvatar,
  });

  const [friends, setFriends] = useState([]);
  const [stats, setStats] = useState({
    totalTrips: 0,
    countriesVisited: 0,
  });
  const [bucketList, setBucketList] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/users/getUserInfo.php", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("User data received:", data);

        if (data.success) {
          setUser({
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            email: data.user.email,
            profilePic: data.user.user_image_url || UserAvatar,
          });
        } else {
          console.warn("Could not fetch user info:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!user.email) return;

    const fetchStats = async () => {
      try {
        const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/getTripStats.php", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setStats({
            totalTrips: data.totalTrips,
            countriesVisited: data.countriesVisited,
          });
        } else {
          console.error("Failed to fetch stats:", data.message);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchFriends = async () => {
      console.log("Getting friends")
      try {
        const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/getFriends.php", {
          credentials: "include",
        });
        const data = await res.json();
        console.log("Response from getting friends is: ", data)

        if (data.success) {
          setFriends(data.friends);
        } else {
          console.warn("Failed to fetch friends:", data.message);
        }
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    const fetchBucketList = async () => {
      try {
        const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/getBucketList.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });
        const data = await res.json();
        if (data.success) {
          setBucketList(data.bucketList);
        }
      } catch (err) {
        console.error("Failed to fetch bucket list:", err);
      }
    };

    fetchStats();
    fetchFriends();
    fetchBucketList();
  }, [user.email]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/users/uploadUserImage.php", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setUser((prev) => ({
          ...prev,
          profilePic: `${data.imageUrl}?t=${Date.now()}`,
        }));
      } else {
        console.error("Upload failed:", data.message);
      }
    } catch (err) {
      console.error("Image upload error:", err);
    }
  };

  const addDestination = async () => {
    if (!newDestination.trim()) return;

    try {
      const response = await fetch("/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/community/addToBucketList.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          destination: newDestination.trim(),
        }),
      });

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
          <label
            htmlFor="profile-pic-upload"
            className="profile-pic-label"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <img
              src={user.profilePic}
              alt="User Avatar"
              className="profile-avatar"
            />
          </label>
          <input
            type="file"
            id="profile-pic-upload"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
          <p className="update-text">Click image to update</p>
          <div className="header-info">
            <h1>
              {encode(user.firstName)} {encode(user.lastName)}
            </h1>
            <button
              className="edit-name-btn"
              onClick={() => navigate("/settings/profile-details")}
            >
              <FaEdit /> Edit Name
            </button>
          </div>
        </div>

        <div className="view-all-trips user-profile-section">
          <div className="view-all-trips-section">
            <h3>Trips</h3>
            <button
              className="view-all-trips-btn"
              onClick={() => navigate("/all-trips")}
            >
              View Your Trips →
            </button>
          </div>
        </div>

        <div className="bucket-list user-profile-section">
          <h3>Travel Bucket List</h3>
          <ul>
            {bucketList.length === 0 ? (
              <p>No destinations added yet.</p>
            ) : (
              bucketList.map((place, index) => (
                <li key={index}>{place}</li>
              ))
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

        <div className="trip-stats user-profile-section">
          <h3>Trip Stats</h3>
          <p>Total Trips Taken: {stats.totalTrips}</p>
          <p>Countries Visited: {stats.countriesVisited}</p>
        </div>

        <div className="friends-list user-profile-section">
          <h3>Friends</h3>
          <ul>
            {friends.length === 0 ? (
              <p>You have no friends yet.</p>
            ) : (
              friends.map((friend, index) => (
                <li key={index}>{encode(friend.first_name)} {encode(friend.last_name)}</li>
              ))
            )}
          </ul>
          <p
            onClick={() => navigate("/community")}
            className="find-new-friends-p"
          >
            Find new friends in the Community tab →
          </p>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
