import React, { useState } from "react";
import HotelCard from "../../components/hotel/HotelCard";
import "../../styles/hotels/Hotels.css";
import Hotel1 from "../../assets/Hotel1.png";
import Hotel2 from "../../assets/Hotel2.png";
import Hotel3 from "../../assets/Hotel3.png";
import backArrow from "../../assets/arrow-left.png";
import searchIcon from "../../assets/search.png";
import calendarIcon from "../../assets/calendar.png";
import locationIcon from "../../assets/location.png";
import profileIcon from "../../assets/profile.png";
import bedIcon from "../../assets/bed.png";
import TravelersModal from "../../components/hotel/TravelersModal";

const Hotels = () => {
  const [sortOption, setSortOption] = useState("Distance");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const handleSortSelection = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  const [freeBreakfastOnly, setFreeBreakfastOnly] = useState(false); // Filter state

  // Hardcoded hotel data. In the future, we will get this data from the API
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

          <div className="search-bar">
            {/* Location Input */}
            <div className="input-wrapper">
              <label>Where</label>
              <div className="input-container">
                <img src={locationIcon} alt="Location" className="input-icon" />
                <input type="text" placeholder="Le Marais, Paris, France" />
              </div>
            </div>

            {/* Check-in Date Input */}
            <div className="input-wrapper">
              <label>Check-in</label>
              <div className="input-container">
                <img src={calendarIcon} alt="Calendar" className="input-icon" />
                <input type="date" />
              </div>
            </div>

            {/* Check-out Date Input */}
            <div className="input-wrapper">
              <label>Check-out</label>
              <div className="input-container">
                <img src={calendarIcon} alt="Calendar" className="input-icon" />
                <input type="date" />
              </div>
            </div>

            {/* Travelers Input */}
            <div className="input-wrapper">
              <label>Travelers</label>
              <div
                className="travelers-container"
                onClick={() => setIsModalOpen(true)}
              >
                <img src={bedIcon} alt="Bed" className="traveler-icon" />
                {rooms}{" "}
                <img src={profileIcon} alt="Person" className="traveler-icon" />{" "}
                {adults + children}
              </div>
            </div>

            {/* Search Button */}
            <div className="input-wrapper">
              {/* <label>Search</label> */}
            <div className="search-container">
              <img src={searchIcon} alt="Search" className="search-icon" />
            </div>
            </div>

            {/* Travelers Modal Component */}
            <TravelersModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              rooms={rooms}
              setRooms={setRooms}
              adults={adults}
              setAdults={setAdults}
              children={children}
              setChildren={setChildren}
            />
          </div>
        </div>
      </div>

      <div className="lower-section">
        <div className="content-container">
          {/* Filters */}
          <div className="filters filters-sort">
            <button
              className={`free-breakfast-button ${
                freeBreakfastOnly ? "active" : ""
              }`}
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

          <div className="hotels-list">
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
              ))
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
