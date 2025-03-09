import React, { useState } from "react";
import HotelCard from "../../components/hotel/HotelCard";
import "../../styles/hotels/Hotels.css";
import Hotel1 from "../../assets/Hotel1.png";
import Hotel2 from "../../assets/Hotel2.png";
import Hotel3 from "../../assets/Hotel3.png";
import backArrow from "../../assets/arrow-left.png";
import search from "../../assets/Search.png";
import SortModal from "../../components/hotel/SortModal";

const Hotels = () => {
  const [sortOption, setSortOption] = useState("Distance");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSortSelection = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const [freeBreakfastOnly, setFreeBreakfastOnly] = useState(false); // Filter state


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

    // Filter hotels based on Free Breakfast selection
  const filteredHotels = freeBreakfastOnly
  ? hotels.filter((hotel) => hotel.freeBreakfast)
  : hotels;

  return (
    <div className="hotels-page">
      <div className="top-section">
        <div className="content-container">
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
      </div>

      <div className="lower-section">
        <div className="content-container">
          {/* Filters */}
          <div className="filters filters-sort">
            {/* Free Breakfast Filter */}
            {/* <div className="free-breakfast-container">Free Breakfast</div> */}
                        {/* Free Breakfast Filter Button */}
            <button 
              className={`free-breakfast-button ${freeBreakfastOnly ? "active" : ""}`}
              onClick={() => setFreeBreakfastOnly(!freeBreakfastOnly)}
            >
              Free Breakfast
            </button>

            {/* Sort Dropdown */}
            <div className="dropdown">
              <button
                className="dropbtn sort-dropbtn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Sort by<span className="sort-option">{sortOption} ▼</span>
              </button>
              {isDropdownOpen && (
                <div className="dropdown-content sort-dropdown-content">
                  {[
                    "Price (low to high)",
                    "Price (high to low)",
                    "Hotel class",
                    "Distance",
                    "Review score",
                  ].map((option, index) => (
                    <a
                      href="#"
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSortSelection(option);
                      }}
                    >
                      {option}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {/* <div className="hotels-list">
            {hotels.map((hotel, index) => (
              <HotelCard key={index} hotel={hotel} />
            ))}
          </div> */}

          <div className="hotels-list">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => <HotelCard key={index} hotel={hotel} />)
            ) : (
              <p>No hotels available with free breakfast.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hotels;
