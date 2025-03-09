import React from "react";
import HotelCard from "../../components/HotelCard";
import "../../styles/hotels/Hotels.css";
import Hotel1 from "../../assets/Hotel1.png";
import Hotel2 from "../../assets/Hotel2.png";
import Hotel3 from "../../assets/Hotel3.png";
import backArrow from "../../assets/arrow-left.png";
import search from "../../assets/Search.png";

const Hotels = () => {
  // Hardcoded hotel data
  const hotels = [
    {
      name: "Courtyard by Marriott Paris Charles de Gaulle Central Airport",
      distance: "0.5 mi",
      location: "Le Marais, Paris, France",
      rating: 4,
      reviews: 740,
      platform1: "Booking.com",
      price1: 179,
      platform2: "Expedia",
      price2: 184,
      bestPrice: 161,
      freeBreakfast: true,
      image: Hotel1,
    },
    {
      name: "Residence Inn by Marriott Paris Charles de Gaulle Central Airport",
      distance: "2.1 mi",
      location: "Le Marais, Paris, France",
      rating: 4,
      reviews: 961,
      platform1: "Booking.com",
      price1: 156,
      platform2: "Expedia",
      price2: 159,
      bestPrice: 154,
      freeBreakfast: false,
      image: Hotel2,
    },
    {
      name: "Mercure Paris Cdg Airport & Convention",
      distance: "8.5 mi",
      location: "Le Marais, Paris, France",
      rating: 3,
      reviews: 1342,
      platform1: "Hotels.com",
      price1: 203,
      platform2: "Expedia",
      price2: 187,
      bestPrice: 203,
      freeBreakfast: true,
      image: Hotel3,
    },
  ];

  return (
    <div className="hotels-page">
      <div className="top-section">
        <div className="hotels-page__header">
          <img src={backArrow} alt="Back" className="back-arrow" />
          <h1 className="hotels-header">Search for hotels</h1>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Le Marais, Paris, France" />
          <input type="date" />
          <input type="date" />
          <input type="text" placeholder="1 room, 2 guests" />
          <img src={search} alt="Search" className="search-icon" />
        </div>
      </div>

      <div className="lower-section">
        {/* Filters */}
        <div className="filters">
          <button>Price</button>
          <button>Hotel Class</button>
          <button>Free Breakfast</button>
        </div>

        {/* Results */}
        <div className="hotels-list">
          {hotels.map((hotel, index) => (
            <HotelCard key={index} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hotels;
