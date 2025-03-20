// import React, { useState } from 'react';
// import '../../styles/user/UserProfile.css';
// import UserAvatar from '../../assets/UserAvatar.png';
// import parisPicture from "../../assets/paris.jpg";
// import charlestonPicture from "../../assets/charleston.jpg";
// import plane from "../../assets/plane.png";
// import house from "../../assets/house.png";
// import car from "../../assets/car.png";

// const trips = [
//   {
//     id: 1,
//     destination: "Paris",
//     dates: "1/24 - 1/27",
//     price: "$1,358",
//     imageUrl: parisPicture,
//   },
//   {
//     id: 2,
//     destination: "Charleston",
//     dates: "1/24 - 1/27",
//     price: "$1,030",
//     imageUrl: charlestonPicture,
//   },
// ];



// const UserProfile = () => {
//   const [user] = useState({
//     firstName: "Jane",
//     lastName: "Doe",
//     username: "Jane",
//   });
  
//   return (
//     <div className="profile-container">
//       {/* User Profile Section */}
//       <div className="profile-header">
//         <img src={UserAvatar} alt="User Avatar" className="profile-avatar" />
//        <h2 className="profile-name">Jane Doe</h2>
//         <a href="/settings/profile-details" className="edit-name-btn">Edit Name</a> 
    
//       </div>

//       {/* All Trips Header */}
//       <div className="trips-header">
//         <h3>All Trips</h3>
//         <button className="start-trip-btn">Start new trip</button>
//       </div>

//       {/* Trip Cards */}
//       <div className="trips-container">
//         {trips.map((trip) => (
//           <div key={trip.id} className="trip-card">
//             {/* View Button */}
//             <button className="view-button">View</button>

//             {/* Trip Info */}
//             <div className="trip-info">
//               <h4 className="trip-destination">{trip.destination}</h4>
//               <p className="trip-dates">{trip.dates}</p>
              
//               {/* Bottom Row: Icons + Price */}
//               <div className="trip-bottom-row">
//                 <div className="trip-icons">
//                   <img src={plane} alt="Plane" className="icon" />
//                   <img src={house} alt="House" className="icon" />
//                   <img src={car} alt="Car" className="icon" />
//                 </div>
//                 <p className="trip-price">{trip.price}</p>
//               </div>
//             </div>

//             {/* Trip Image */}
//             <img src={trip.imageUrl} alt={trip.destination} className="trip-image" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;


import React, { useState } from "react";
import "../../styles/user/UserProfile.css";
import UserAvatar from "../../assets/UserAvatar.png";
import parisPicture from "../../assets/paris.jpg";
import charlestonPicture from "../../assets/charleston.jpg";
import plane from "../../assets/plane.png";
import house from "../../assets/house.png";
import car from "../../assets/car.png";

// Sample trip data
const tripsData = [
  { id: 1, destination: "Paris", dates: "1/24 - 1/27", price: 1358, imageUrl: parisPicture },
  { id: 2, destination: "Charleston", dates: "1/24 - 1/27", price: 1030, imageUrl: charlestonPicture },
  { id: 3, destination: "Charleston", dates: "1/24 - 1/27", price: 1030, imageUrl: charlestonPicture },
];

// Sample friends data
const friendsData = ["Alice Johnson", "Michael Smith", "Samantha Lee"];

const UserProfile = () => {
  const [user] = useState({
    firstName: "Jane",
    lastName: "Doe",
    username: "Jane",
  });

  const [bucketList, setBucketList] = useState([]);
  const [newDestination, setNewDestination] = useState("");
  const [sortBy, setSortBy] = useState(""); // Sorting option
  const [trips, setTrips] = useState(tripsData);

  // Handle adding a destination to the bucket list
  const addDestination = () => {
    if (newDestination.trim()) {
      setBucketList([...bucketList, newDestination]);
      setNewDestination("");
    }
  };

  // Sort trips by selected criteria
  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortBy(value);

    let sortedTrips = [...trips];
    if (value === "date") {
      sortedTrips.sort((a, b) => new Date(b.dates) - new Date(a.dates));
    } else if (value === "price") {
      sortedTrips.sort((a, b) => a.price - b.price);
    }

    setTrips(sortedTrips);
  };

  return (
    <div className="profile-container">
      <div className="user-profile-main-content">
      {/* User Profile Section */}
      <div className="profile-header">
        <img src={UserAvatar} alt="User Avatar" className="profile-avatar" />
        <h2 className="profile-name">Jane Doe</h2>
        <a href="/settings/profile-details" className="edit-name-btn">Edit Name</a>
      </div>

      {/* Travel Bucket List */}
      <div className="bucket-list">
        <h3>Travel Bucket List</h3>
        <ul>
          {bucketList.length === 0 ? <p>No destinations added yet.</p> : 
            bucketList.map((place, index) => <li key={index}>{place}</li>)
          }
        </ul>
        <div className="add-destination">
          <input
            type="text"
            value={newDestination}
            onChange={(e) => setNewDestination(e.target.value)}
            placeholder="Add a new destination..."
          />
          <button onClick={addDestination} className="add-btn">Add</button>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="trip-stats">
        <h3>Trip Stats</h3>
        <p>Total Trips Taken: {trips.length}</p>
        <p>Countries Visited: {new Set(trips.map(trip => trip.destination)).size}</p>
        <p>Miles Traveled: 4,500 mi</p> {/* Placeholder */}
      </div>

      {/* Friends List */}
      <div className="friends-list">
        <h3>Friends</h3>
        <ul>
          {friendsData.map((friend, index) => (
            <li key={index}>{friend}</li>
          ))}
        </ul>
      </div>

      {/* All Trips Header with Sorting */}
      <div className="trips-header">
        <h3>All Trips</h3>
        <button className="start-trip-btn">Start new trip</button>
        <div className="sort-options">
          <label>Sort By: </label>
          <select value={sortBy} onChange={handleSortChange}>
            <option value="">Select</option>
            <option value="date">Date (Newest → Oldest)</option>
            <option value="price">Price (Lowest → Highest)</option>
          </select>
        </div>
      </div>

      {/* Trip Cards */}
      <div className="trips-container">
        {trips.map((trip) => (
          <div key={trip.id} className="trip-card">
            {/* View Button */}
            <button className="view-button">View</button>

            {/* Trip Info */}
            <div className="trip-info">
              <h4 className="trip-destination">{trip.destination}</h4>
              <p className="trip-dates">{trip.dates}</p>

              {/* Bottom Row: Icons + Price */}
              <div className="trip-bottom-row">
                <div className="trip-icons">
                  <img src={plane} alt="Plane" className="icon" />
                  <img src={house} alt="House" className="icon" />
                  <img src={car} alt="Car" className="icon" />
                </div>
                <p className="trip-price">${trip.price}</p>
              </div>
            </div>

            {/* Trip Image */}
            <img src={trip.imageUrl} alt={trip.destination} className="trip-image" />
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default UserProfile;
