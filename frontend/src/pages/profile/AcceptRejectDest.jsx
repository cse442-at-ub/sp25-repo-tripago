// import React from 'react';
// import '../../styles/trip/AcceptRejectDest.css';
// import paris from '../../assets/paris.jpg';
// import { useNavigate } from 'react-router-dom';

// const AcceptRejectDest = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="accept-reject-container">
//       <h2>
//         How does a trip to <span className="destination-name">Paris</span> sound?
//       </h2>
      
//       <img src={paris} alt="Paris" className="destination-image" />
      
//       <button className="accept-button" onClick={() => navigate('/profile')}>Sounds great!</button>
      
//       <p className="reject-text" onClick={() => navigate('/profile/new-destination')}>I want something else.</p>
//     </div>
//   );
// };

// export default AcceptRejectDest;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../styles/trip/AcceptRejectDest.css';

const AcceptRejectDest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];
  
  const [city, setCity] = useState("Paris"); // fallback
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (recommendations.length > 0) {
      const topRecommendation = recommendations[0];
      const cityName = topRecommendation?.name || "Paris";
      setCity(cityName);

      // Fetch image for the city
      const fetchImage = async () => {
        try {
          const res = await fetch(`http://localhost/backend/api/images/pexelsSearch.php?query=${encodeURIComponent(cityName)}`);
          const data = await res.json();
          const photo = data.photos?.[0]?.src?.large || null;
          if (photo) {
            setImageUrl(photo);
          }
        } catch (err) {
          console.error("Failed to load image from Pexels:", err);
        }
      };
      fetchImage();
    }
  }, [recommendations]);

  return (
    <div className="accept-reject-container">
      <h2>
        How does a trip to <span className="destination-name">{city}</span> sound?
      </h2>
      
      <img
        src={imageUrl || require('../../assets/paris.jpg')}
        alt={city}
        className="destination-image"
      />
      
      <button className="accept-button" onClick={() => navigate('/profile')}>
        Sounds great!
      </button>
      
      <p className="reject-text" onClick={() => navigate('/profile/new-destination')}>
        I want something else.
      </p>
    </div>
  );
};

export default AcceptRejectDest;
