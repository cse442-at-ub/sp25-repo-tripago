// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import fallbackImg from '../../assets/paris.jpg';
// import '../../styles/trip/AcceptRejectDest.css';

// const AcceptRejectDest = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const recommendations = location.state?.recommendations || [];
  
//   const [city, setCity] = useState(""); 
//   // const [name, setName] = useState(""); 
//   const [countryCode, setCountryCode] = useState("");
//   const [imageUrl, setImageUrl] = useState(null);
//   const [isImageLoaded, setIsImageLoaded] = useState(false); //  New flag

//   const COUNTRY_MAP = {
//     US: "United States",
//     FR: "France",
//     CA: "Canada",
//     JP: "Japan",
//     IT: "Italy",
//     BR: "Brazil",
//   };
  
//   function getCountryName(code) {
//     return COUNTRY_MAP[code] || code;
//   }

//   useEffect(() => {
//     if (recommendations.length > 0) {
//       // Ensure recommended city is random
//       const randomIndex = Math.floor(Math.random() * recommendations.length);
//       const randomRecommendation = recommendations[randomIndex];
//       const cityName = randomRecommendation?.name || "";
//       const country = randomRecommendation?.countryCode || "";

  
//       console.log(" Random city picked:", cityName);
//       setCity(cityName);
//       setCountryCode(country);
//       setIsImageLoaded(false); // Reset loading state

//       // Fetch image for the city
//       const fetchImage = async () => {
//         try {
//           const query = `${cityName} travel`; 
//           const searchURL = `http://localhost:8000/api/images/pexelsSearch.php?query=${encodeURIComponent(query)}`;
//           const res = await fetch(searchURL);
//           const data = await res.json();
//           console.log("Pexels response:", data);
//           const photo = data.photos?.[0]?.src?.large || null;
//           console.log("Extracted photo URL:", photo);
//           if (photo) {
//             setImageUrl(photo);
//           }
//           else {
//             console.warn("No photo found for:", cityName);
//           }
//           setIsImageLoaded(true);
//         } catch (err) {
//           console.error("Failed to load image from Pexels:", err);
//           setImageUrl(fallbackImg); // fallback in error
//           setIsImageLoaded(true);
//         }
//       };
//       fetchImage();
//     }
//   }, [recommendations]);

//   return (
//     <div className="accept-reject-container">
//       <h2>
//         How does a trip to <span className="destination-name">{city}</span> sound?
//       </h2>
      
//       {isImageLoaded ? (
//       <img
//         src={imageUrl || fallbackImg} alt={city} className="destination-image"
//       />
//     ) : (
//       <div className="loading-spinner" style={{ margin: "20px auto" }}>Loading image...</div>
//     )}

//       <button className="accept-button" onClick={() => navigate("/profile", {
//       state: {
//         name: city,
// countryCode: countryCode
//       },
//     })
//   }
// >
//         Sounds great!
//       </button>
      
//       <p className="reject-text" onClick={() => navigate('/profile/new-destination')}>
//         I want something else.
//       </p>
//     </div>
//   );
// };

// export default AcceptRejectDest;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fallbackImg from '../../assets/paris.jpg';
import '../../styles/trip/AcceptRejectDest.css';

const AcceptRejectDest = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendations = location.state?.recommendations || [];

  const [name, setName] = useState(""); 
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
    if (recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendations.length);
      const randomRecommendation = recommendations[randomIndex];
      const cityName = randomRecommendation?.name || "";
      const country = randomRecommendation?.countryCode || "";

      console.log("Random city picked:", cityName);
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
            console.warn("No photo found for:", cityName);
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
  }, [recommendations]);

  return (
    <div className="accept-reject-container">
      <h2>
        How does a trip to <span className="destination-name">{name}</span> sound?
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
              name,
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
