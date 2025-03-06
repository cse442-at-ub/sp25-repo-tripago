import { useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import TripHeader from '../../components/trip/TripHeader.jsx'
import TripDetails from '../../components/trip/TripDetails.jsx'
import "../../styles/Profile.css";
import parisPicture from "../../assets/paris.jpg";

const Profile = () => {
  const [user] = useState({
    firstName: "Jane",
    lastName: "Doe",
    username: "Jane",
  });

  // Test trip
  const [trip] = useState({
    location: "Paris, France",
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    picture: parisPicture,
    days: [
      {
        activities: [
          {
            name: "Eiffel Tower",
            time: "9AM - 6PM",
            description: "Explore the iconic landmark of Paris",
          },
        ],
      },
    ],
    budget: {
      amount: 350,
      expenses: [
        {
          category: "Flights",
          amount: 400,
        },
      ],
    },
  });

  // No trip selected
  // const [trip] = useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="profile-content">
          <TripHeader
            firstName={user.firstName}
            lastName={user.lastName}
            picture={trip?.picture}
          />

          <TripDetails trip={trip} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
