// import React from 'react';
// import '../../styles/user/UserProfile.css'
// import UserAvatar from '../../assets/UserAvatar.png'
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
//   return (
//     <div className="profile-container">
//       {/* User Profile Section */}
//       <div className="profile-header">
//         <img 
//           src={UserAvatar} 
//           alt="User Avatar"
//           className="profile-avatar"
//         />
//         <h2 className="profile-name">Jane Doe</h2>
//         <a href="/settings/profile-details" className="edit-link">Edit Name</a>
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
//             <div className="trip-info">
//               <h4 className="trip-destination">{trip.destination}</h4>
//               <p className="trip-dates">{trip.dates}</p>
//               <div className="trip-icons">
//                 <img src={plane} alt="Plane" className="icon" />
//                 <img src={house} alt="House" className="icon" />
//                 <img src={car} alt="Car" className="icon" />
//               </div>
//               <p className="trip-price">{trip.price}</p>
//             </div>
//             <img src={trip.imageUrl} alt={trip.destination} className="trip-image" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserProfile;

import React from 'react';
import '../../styles/user/UserProfile.css';
import UserAvatar from '../../assets/UserAvatar.png';
import parisPicture from "../../assets/paris.jpg";
import charlestonPicture from "../../assets/charleston.jpg";
import plane from "../../assets/plane.png";
import house from "../../assets/house.png";
import car from "../../assets/car.png";

const trips = [
  {
    id: 1,
    destination: "Paris",
    dates: "1/24 - 1/27",
    price: "$1,358",
    imageUrl: parisPicture,
  },
  {
    id: 2,
    destination: "Charleston",
    dates: "1/24 - 1/27",
    price: "$1,030",
    imageUrl: charlestonPicture,
  },
];

const UserProfile = () => {
  return (
    <div className="profile-container">
      {/* User Profile Section */}
      <div className="profile-header">
        <img src={UserAvatar} alt="User Avatar" className="profile-avatar" />
        <h2 className="profile-name">Jane Doe</h2>
        <a href="/settings/profile-details" className="edit-link">Edit Name</a>
      </div>

      {/* All Trips Header */}
      <div className="trips-header">
        <h3>All Trips</h3>
        <button className="start-trip-btn">Start new trip</button>
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
                <p className="trip-price">{trip.price}</p>
              </div>
            </div>

            {/* Trip Image */}
            <img src={trip.imageUrl} alt={trip.destination} className="trip-image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;

