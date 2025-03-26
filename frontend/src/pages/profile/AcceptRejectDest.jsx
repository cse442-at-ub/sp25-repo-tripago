import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fallbackImg from '../../assets/paris.jpg';
import '../../styles/trip/AcceptRejectDest.css';

const AcceptRejectDest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];

  const category = location.state?.category || 'default';

  const [name, setName] = useState(""); 
  const [city, setCity] = useState(""); 
  const [countryCode, setCountryCode] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const COUNTRY_MAP = {
    US: "United States",
    FR: "France",
    CA: "Canada",
    JP: "Japan",
    IT: "Italy",
    BR: "Brazil",
    GB: "United Kingdom",
    ES: "Spain"
  };

  const getCountryName = (code) => COUNTRY_MAP[code] || code;

  useEffect(() => {
    if (recommendations.length > 0 && category) {
      const storageKey = `lastIndex-${category}`;
      const lastIndexStr = localStorage.getItem(storageKey);
      const lastIndex = lastIndexStr ? parseInt(lastIndexStr, 10) : -1;
  
      const nextIndex = (lastIndex + 1) % recommendations.length;
      const nextCity = recommendations[nextIndex];
  
      console.log(`Category: ${category}`);
      console.log(`Last Index: ${lastIndex}`);
      console.log(`Next Index: ${nextIndex}`);
      console.log(`City picked: ${nextCity.name}`);
  
      localStorage.setItem(storageKey, nextIndex.toString());
  
      const cityName = nextCity.name;
      const country = nextCity.countryCode;
  
      setCity(cityName);
      setName(cityName);
      setCountryCode(country);
      setIsImageLoaded(false);
  
      const fetchImage = async () => {
        try {
          const query = `${cityName} travel`;
          const searchURL = `http://localhost:8000/api/images/pexelsSearch.php?query=${encodeURIComponent(query)}`;
          const res = await fetch(searchURL);
          const data = await res.json();
          const photo = data.photos?.[0]?.src?.large || null;
  
          if (photo) {
            setImageUrl(photo);
          } else {
            setImageUrl(fallbackImg);
          }
        } catch (err) {
          console.error("Failed to load image from Pexels:", err);
          setImageUrl(fallbackImg);
        } finally {
          setIsImageLoaded(true);
        }
      };
  
      fetchImage();
    }
  }, [recommendations, category]);
  

  return (
    <div className="accept-reject-container">
      <h2>
        How does a trip to <span className="destination-name">{city}</span> sound?
      </h2>

      {isImageLoaded ? (
        <img
          src={imageUrl || fallbackImg}
          alt={name}
          className="destination-image"
        />
      ) : (
        <div className="loading-spinner" style={{ margin: "20px auto" }}>
          Loading image...
        </div>
      )}

      <button
        className="accept-button"
        onClick={() =>
          navigate("/profile", {
            state: {
              name: city,
              countryCode,
            },
          })
        }
      >
        Sounds great!
      </button>

      <p
        className="reject-text"
        onClick={() => navigate('/profile/new-destination')}
      >
        I want something else.
      </p>
    </div>
  );
};

export default AcceptRejectDest;
