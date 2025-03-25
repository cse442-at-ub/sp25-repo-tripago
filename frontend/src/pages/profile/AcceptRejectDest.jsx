import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fallbackImg from '../../assets/paris.jpg';
import '../../styles/trip/AcceptRejectDest.css';

const AcceptRejectDest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];
  
  const [city, setCity] = useState("Paris"); // fallback
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false); //  New flag


  useEffect(() => {
    if (recommendations.length > 0) {
      // Ensure recommended city is random
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      const randomRecommendation = recommendations[randomIndex];
      const cityName = randomRecommendation?.name || "Paris";
  
      console.log("🎲 Random city picked:", cityName);
      setCity(cityName);
      setIsImageLoaded(false); // Reset loading state

      // Fetch image for the city
      const fetchImage = async () => {
        try {
          const query = `${cityName} travel`; 
          const searchURL = `http://localhost:8000/api/images/pexelsSearch.php?query=${encodeURIComponent(query)}`;
          const res = await fetch(searchURL);
          const data = await res.json();
          console.log("Pexels response:", data);
          const photo = data.photos?.[0]?.src?.large || null;
          console.log("Extracted photo URL:", photo);
          if (photo) {
            setImageUrl(photo);
          }
          else {
            console.warn("No photo found for:", cityName);
          }
          setIsImageLoaded(true);
        } catch (err) {
          console.error("Failed to load image from Pexels:", err);
          setImageUrl(fallbackImg); // fallback in error
          setIsImageLoaded(true);
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
      
      {isImageLoaded ? (
      <img
        src={imageUrl || fallbackImg} alt={city} className="destination-image"
      />
    ) : (
      <div className="loading-spinner" style={{ margin: "20px auto" }}>Loading image...</div>
    )}

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
