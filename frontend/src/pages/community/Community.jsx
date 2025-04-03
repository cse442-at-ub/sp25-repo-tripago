import { useEffect, useState } from "react";
import "../../styles/community/Community.css";
import paris from "../../assets/paris.jpg";
import sandiego from "../../assets/sandiego.jpg";
import FriendsModal from "../../components/community/FriendsModal.jsx";
import RequestsModal from "../../components/community/RequestsModal.jsx";
import axios from 'axios'
import Sidebar from "../../components/Sidebar.jsx";
import MobileSidebarToggle from "../../components/MobileSidebarToggle.jsx";

const trips = [
  {
    id: 1,
    user: "John",
    location: "San Diego",
    comment: "One of my favorite vacations I’ve been on!",
    imageUrl: sandiego,
  },
  {
    id: 2,
    user: "Emily",
    location: "Paris",
    comment: "Had the best croissants ever!",
    imageUrl: paris,
  },
];

const Community = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const friendsList = ["John"]; //  Assume user is only friends with John
  const [modalType, setModalType] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 480);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isNowMobile = window.innerWidth <= 480;
      console.log("Window width:", window.innerWidth, "| isMobile:", isNowMobile);
      setIsMobile(isNowMobile);
    };
  
    handleResize(); // Run on first load
    window.addEventListener("resize", handleResize); // Watch for resizes
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isFriend = selectedTrip
    ? friendsList.includes(selectedTrip.user)
    : false;
  // Open modal with selected trip
  const handleViewMore = (trip) => {
    setSelectedTrip(trip);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedTrip(null);
  };

  /*
  const incomingRequests = [
    { id: 1, name: "Anna" },
    { id: 2, name: "Michael" },
  ];
*/

  const [incomingRequests,setIncomingRequests] = useState([]); 

  const [sentRequests, setSentRequests] = useState([]); // Initialize as empty array


  const handleSend = async(e) => {

    e.preventDefault();
    console.log("Search term:", searchTerm);
    setSearchTerm("");
    try {
      const response = await axios.post("/CSE442/2025-Spring/cse-442aj/backend/api/sendFriendRequest.php",{ searchTerm: searchTerm },{
        headers:{
          'Content-Type':'application/json'
        }
      })
      const result = response.data
      console.log("Send reponse: ",response.data);
      if (result.success){
        alert(result.message);
      } else {
        alert(result.message);
      }

    }catch(error){
      console.log("Error during search: ");
       if (error.response) {
         console.error("Server responded with:", error.response.data);
         console.error("Status code:", error.response.status);
         console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request:", error.request);
      } else {  
        console.error("Error setting up the request:", error.message);
      }
        console.error("Original error:", error); // Log the full error for debugging.
    }
  }

  //called when you click "view sent requests" button
  //Will show you requests that you sent
  const getSentRequests = async(e) => {
    
    try {
      console.log("hello!");
      const response = await axios.post("/CSE442/2025-Spring/cse-442aj/romanTest/backend/api/getSentRequests.php",{test:"empty"},{
        headers:{
          'Content-Type':'application/json'
        }
      })

      const result = response.data;

      console.log(result);

      let newSentRequests = []; // Create a new array

      //handle accepted names
      if (result[0].length > 0){
        result[0].forEach((name) => {
          newSentRequests.push({
            id: Date.now() + Math.random(),
            name: name,
            status: "Accepted",
          });
        });
      }
      //handle pending names
      if (result[1].length > 0){
        result[1].forEach((name) => {
          newSentRequests.push({
            id: Date.now() + Math.random(),
            name: name,
            status: "Pending",
          });
        });
      }

      setSentRequests(newSentRequests); // Update sentRequests with the new array

      //result should have a list of lists of names??
    } catch (error){
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
     } else if (error.request) {
       console.error("No response received. Request:", error.request);
     } else {  
       console.error("Error setting up the request:", error.message);
     }
       console.error("Original error:", error); // Log the full error for debugging.
    }

  }

  const getIncomingRequests = async(e) => {

    try {


      const response = await axios.post("/CSE442/2025-Spring/cse-442aj/backend/api/getIncFriends.php",{test:"empty"},{
        headers:{
          'Content-Type':'application/json'
        }
      })

      const result = response.data;
      console.log(result );
      
      let newIncFriends = [];
      
      if (result.length > 0){
        result.forEach((name) => {
          newIncFriends.push({
            id: Date.now() + Math.random(),
            name: name,
          });
        });
      }

      setIncomingRequests(newIncFriends);
      

    } catch (error){
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
     } else if (error.request) {
       console.error("No response received. Request:", error.request);
     } else {  
       console.error("Error setting up the request:", error.message);
     }
       console.error("Original error:", error); // Log the full error for debugging.
    }
  }



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
    <div className="community-container">
      {/* Top Section */}
      <div className="community-top">
        <div className="find-friends">
          <label className="find-friends-label">Find Friends</label>
          <div className="find-friends-inputs">
          <input
            type="text"
            placeholder="Search by email"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        <button style={{ marginLeft: '10px' }} 
        onClick={handleSend}>Send</button> 
        </div>
        </div>
        {/* <div className="requests-list">
          <div className="incoming-requests">
            <h3>Incoming Requests</h3>
            <ul>
              <li>
                Anna
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
              <li>
                Michael
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="requests-list">
          <div className="incoming-requests">
            <h3>Sent Requests</h3>
            <ul>
              <li>
                Anna
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
              <li>
                Michael
                <div>
                  <button className="accept-btn">Accept</button>
                  <button className="reset-btn">Delete</button>
                </div>
              </li>
            </ul>
          </div>
        </div> */}
          {/* Requests Section */}
          <div className="requests-section">
          <h3>Requests</h3>
          <button className="view-requests-btn" onClick={() => {setModalType("incoming"); getIncomingRequests();}}>
            View Incoming Requests
          </button>
          <button className="view-requests-btn" onClick={() => {setModalType("sent"); getSentRequests();}}>
            View Friends
          </button>
        </div>
      </div>

      <div className="community-bottom">
        {/* Main Section: List of Trips */}
        <div className="trip-list">
          <h3>Discover Friends</h3>
          {trips.map((trip) => (
            <div key={trip.id} className="trip-card">
              {/* Left Side: Text & Buttons */}
              <div className="trip-info">
                <h2>
                  <span className="bold">{trip.user}'s</span> trip to{" "}
                  <span className="highlight">{trip.location}</span>.
                </h2>
                <p className="trip-comment">"{trip.comment}"</p>
                {/* Hide "Send Request" button if already friends */}
                {!friendsList.includes(trip.user) && (
                  <button className="send-request-btn">Send Request</button>
                )}
                <button
                  className="view-more-btn"
                  onClick={() => handleViewMore(trip)}
                >
                  View More
                </button>
              </div>

              {/* Right Side: Image */}
              <div className="community-image">
                <img
                  src={trip.imageUrl}
                  alt={trip.location}
                  className="trip-image"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <FriendsModal
        isOpen={selectedTrip !== null}
        onClose={() => setSelectedTrip(null)}
        user={selectedTrip?.user}
        location={selectedTrip?.location}
        imageUrl={selectedTrip?.imageUrl}
        comment={selectedTrip?.comment}
        isFriend={isFriend}
      />
        {/* Requests Modal */}
        <RequestsModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType}
        incomingRequests={incomingRequests}
        setIncomingRequests={setIncomingRequests}
        sentRequests={sentRequests}
      />
    </div>
    </>
  );
};

export default Community;
