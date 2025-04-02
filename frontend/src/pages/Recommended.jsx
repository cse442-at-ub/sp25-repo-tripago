import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Paris from "../assets/paris.jpg";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "../styles/recommended.css";

const VerifyLocation = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [destinations, setDestinations] = useState([]);
  const [error, setError] = useState(null);
  const [imagesFetched, setImagesFetched] = useState(false); // Flag to ensure images are fetched only once

  useEffect(() => {
    if (destinations.length != 0) return;
    const fetchDestinations = async () => {
      try {
        //const response = await fetch("http://localhost/tripago/getRecommendations.php?category=Recommendations");
        const response = await fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/getRecommendations.php?category=Recommendations`)

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setDestinations(data.data || []);
        //console.log(data.data[0]);
        //for (let i = 0; i < data.data.length; i++ ) {
          //console.log(data);
          //const t = {
            //name: data.data.name,
            //image_url: Paris
          //}
          //destinations.push(t);
          //destinations[i].name = data.data[i].name;
        //}
        //console.log(destinations);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        //setError("Error fetching destinations");
        //alert("Error getting cities!");
      }
    };

    fetchDestinations();
  }, []);


  // Fetch images ONCE after destinations are retrieved
  useEffect(() => {
    if (destinations.length === 0 || imagesFetched) return; // Prevent multiple calls
    const fetchImages = async () => {
      try {
        const updatedDestinations = await Promise.all(
          destinations.map(async (destination) => {
            //const response = await fetch(`http://localhost/tripago/pexelsSearch.php?query=${destination.name}`);
            const response = await fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/pexelsSearch.php?query=${destination.name}`);

            if (!response.ok) {
              throw new Error("Failed to fetch image");
            }

            const data = await response.json();
            destination.image_url = data.photos[0]?.src.large;
            //console.log(data);
            //return { ...destination, image_url: data.photos[0]?.src.large || Paris };
            return { ...destination};
          })
        );

        setDestinations(updatedDestinations);
        setImagesFetched(true); // Prevents re-fetching images
        console.log(destinations);
      } catch (err) {
        console.error("Error retrieving images:", err);
        //alert("Error retrieving image URLs.");
      }
    };

    fetchImages();
  }, [destinations]); // Runs once after destinations update

/*
  useEffect(() => {
    //fetch("/CSE442/2025-Spring/cse-442aj/backend/api/recommended.php")
    //fetch("http://localhost/tripago/recommended.php")
      //.then((res) => res.json())
      //.then((data) => setDestinations(data))
      //.catch((err) => console.error("Error fetching destinations:", err));
    const fetchDestinations = async () => {
      const response = fetch(`http://localhost/tripago/getRecommendations.php?category=Recommendations`)
        .then((res) => {
          try {
            //const response = fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/getRecommended.php`);
            //const response = fetch(`http://localhost/tripago/getRecommendations.php?category=Recommendations`);
          
            if (!res.ok) {
              throw new Error("Failed to fetch recommendations");
            }
          
            const data = res.json();
            setDestinations(data.data || [])
          } catch (err) {
            //setError(err.message);
            //console.log(data);
            alert("Error getting cities!");
          }
        })
        .then(() => {
          const fetchImages = async () => {
          for (var i = 0; i < destinations.length; i++) {
            try {
              const response = await fetch(`http://localhost/tripago/pexelsSearch.php?query=${destinations[i]}`);
              
              if (!response.ok) {
                throw new Error("Failed to fetch recommendations");
              }
        
              const data = await response.json();
              destinations.image_url = data.photos.src.small;
            } catch (err) {
              //setError(err.message);
              console.log(result);
              alert("error retrieving image url.");
            }
          }
        }
        fetchImages();
      })
      .catch((err) => console.error("Error fetching destinations:", err));
      }
      fetchDestinations();
    })
      
      /*try {
        //const response = fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/getRecommended.php`);
        const response = fetch(`http://localhost/tripago/getRecommendations.php?category=Recommendations`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
  
        const data = response.json();
        setDestinations(data.data || []);
      } catch (err) {
        //setError(err.message);
        //console.log(data);
        alert("Error getting cities!");
      }*/

        /*
      const fetchDestinations = async () => {
        try {
          const response = await fetch(`http://localhost/tripago/getRecommendations.php?category=Recommendations`);
    
          if (!response.ok) {
            throw new Error("Failed to fetch recommendations");
          }
    
          const data = await response.json();
          setDestinations(data.data || []);
        } catch (err) {
          //setError(err.message);
          console.log(result);
          alert("Error adding trip.");
        }
        
        for (var i = 0; i < destinations.length; i++) {
          try {
            const response = await fetch(`http://localhost/tripago/pexelsSearch.php?query=${destinations[i]}`);
            
            if (!response.ok) {
              throw new Error("Failed to fetch recommendations");
            }
      
            const data = await response.json();
            destinations.image_url = data.photos.src.small;
          } catch (err) {
            //setError(err.message);
            console.log(result);
            alert("error retrieving image url.");
          }
        }
      };

      fetchDestinations();
  }, []); */

  

  /*
  const fetchDestinations = async () => {
    try {
      const response = await fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/amadeus/destinations/getRecommended.php`);

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setDestinations(data.data || []);
    } catch (err) {
      //setError(err.message);
      console.log(result);
      alert("Error adding trip.");
    }
  };
*/
  const handleNewTrip = async (destination) => {
    //try {
      //fetch("http://localhost/tripago/recommended.php", {
      /*const response = await fetch("/CSE442/2025-Spring/cse-442aj/backend/api/recommended.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city_name: destination.city_name,
          country_name: destination.country_name,
          image_url: destination.image_url
        }),
      });*/

      localStorage.setItem(
        "selectedTrip",
        JSON.stringify({ name: destination.name, cityCode:destination.iataCode, newTrip: true })
      );
      navigate("/profile");
     
      /*
      const result = await response.json();
      if (result.success) {
        alert("Trip added successfully!");
      } else {
        console.log(result);
        alert("Error adding trip.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to add trip.");
    } */
  };

  const filteredDestinations = destinations.filter(destination =>
    //destination.city_name.toLowerCase().includes(searchQuery.toLowerCase())
    destination.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFavorite = (name) => {
    setFavorites(prev => ({ ...prev, [name]: !prev[name] }));
    console.log(destinations);
  };

  return (
    <div style={{display: 'flex', width:'100%', height: '100vh', textAlign: 'left'}}>
      <Sidebar username="Jane" />
      <Navbar />
    <div style={{ paddingTop: '5rem', paddingBottom: '10rem', display: 'flex', flexWrap: 'wrap', height: '600vh', backgroundColor: '#f3f4f6', width: '100%' }}>
      
      <div class="card_positions">
        <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#374151", marginTop: "2rem" }}>
          Select a <span style={{ color: "#7c3aed" }}>Trip</span>
        </h2>

        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            marginTop: "1rem",
            width: "100%",
            maxWidth: "1000px",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            fontSize: "1rem",
            textAlign: "center",
          }}
        />

        <div style={{
          marginTop: "2rem",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
          width: "100%",
          maxWidth: "900px",
        }}>
          {filteredDestinations.map((destination, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                overflow: "hidden",
                //cursor: "pointer",
                width: '100%',
                maxWidth: "500px",
                minWidth: '300px',
                transition: "border 0.3s ease-in-out"
                /*border: selectedLocation === destination.name ? "3px solid #7c3aed" : "3px solid transparent",*/
              }}
              onClick={() => setSelectedLocation(destination.name)}
            >
              <img src={destination.image_url} onerror={`this.onerror=null; this.src=${Paris};`} alt={destination.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <div style={{ padding: "1rem", textAlign: "center", width: "100%" }}>
                <p style={{ margin: '0px', fontWeight: "600" }}>{destination.name}</p>
                <p style={{ margin: '0px', color: "gray", fontSize: "0.875rem" }}>{destination.country_name}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "75%", padding: "0.5rem 1rem" }}>
                <FaHeart 
                  style={{ color: favorites[destination.name] ? "red" : "gray", cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(destination.name); }}
                />
                <button
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => { e.stopPropagation(); handleNewTrip(destination); }}
                >
                  New Trip
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedLocation && (
          <p style={{ marginTop: "1rem", fontSize: "1rem", fontWeight: "500", color: "#7c3aed" }}>
            Selected: {selectedLocation}
          </p>
        )}
      </div>
    </div>
    </div>
  );
};

export default VerifyLocation;
