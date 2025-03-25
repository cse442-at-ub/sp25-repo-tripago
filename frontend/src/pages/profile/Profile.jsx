import { useState } from "react";
import TripHeader from "../../components/trip/TripHeader.jsx";
import TripDetails from "../../components/trip/TripDetails.jsx";
import ShareTripButton from "../../components/trip/ShareTripButton.jsx";
import "../../styles/Profile.css";
import parisPicture from "../../assets/paris.jpg";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

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
            editable={true}
          />

          <TripDetails
            trip={trip}
            editable={true}
          />

          {trip && <ShareTripButton />}
          {(trip && (trip.startDate && trip.endDate)) &&
            <div className="cart-buttons">
              <button className="cart-button" onClick={() => navigate("/profile/cart")}>Send to Cart</button>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Profile;
