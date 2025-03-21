import React from 'react';
import '../../styles/trip/AcceptRejectDest.css';
import paris from '../../assets/paris.jpg';
import { useNavigate } from 'react-router-dom';

const AcceptRejectDest = () => {
  const navigate = useNavigate();

  return (
    <div className="accept-reject-container">
      <h2>
        How does a trip to <span className="destination-name">Paris</span> sound?
      </h2>
      
      <img src={paris} alt="Paris" className="destination-image" />
      
      <button className="accept-button" onClick={() => navigate('/profile')}>Sounds great!</button>
      
      <p className="reject-text" onClick={() => navigate('/profile/new-destination')}>I want something else.</p>
    </div>
  );
};

export default AcceptRejectDest;
