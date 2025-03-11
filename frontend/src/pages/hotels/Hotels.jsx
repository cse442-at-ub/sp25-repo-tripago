// export default Hotels;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // Hardcoded hotel data. In the future, we will get this data from the API
  const hotels = [
    {
      name: "Courtyard by Marriott Paris Charles de Gaulle Central Airport",
      distance: 0.5,
      location: "Le Marais, Paris, France",
      rating: 5,
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
      distance: 2.1,
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
      distance: 8.5,
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

  const [sortOption, setSortOption] = useState("Distance");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 3;
  const [freeBreakfastOnly, setFreeBreakfastOnly] = useState(false);

  // **Filter hotels by Free Breakfast**
  let filteredHotels = freeBreakfastOnly
    ? hotels.filter((hotel) => hotel.freeBreakfast)
    : [...hotels];

  // **Sorting Logic**
  const handleSortSelection = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  if (sortOption === "Price (low to high)") {
    filteredHotels.sort((a, b) => a.bestPrice - b.bestPrice);
  } else if (sortOption === "Price (high to low)") {
    filteredHotels.sort((a, b) => b.bestPrice - a.bestPrice);
  } else if (sortOption === "Hotel class") {
    filteredHotels.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === "Distance") {
    filteredHotels.sort((a, b) => a.distance - b.distance);
  }

  // **Pagination Logic**
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  return (
    <div className="hotels-page">
      <div className="top-section">
        <div className="content-container">
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
            {currentHotels.length > 0 ? (
              currentHotels.map((hotel, index) => (
                <HotelCard key={index} hotel={hotel} />
              ))
            ) : (
              <p>No hotels available with free breakfast.</p>
            )}
          </div>
          <div className="pagination-container">
            <p>
              Showing {indexOfFirstHotel + 1} -{" "}
              {Math.min(indexOfLastHotel, filteredHotels.length)} of{" "}
              {filteredHotels.length} results
            </p>

            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {"<"}
              </button>

              {Array.from({
                length: Math.ceil(filteredHotels.length / hotelsPerPage),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      prev + 1,
                      Math.ceil(filteredHotels.length / hotelsPerPage)
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(filteredHotels.length / hotelsPerPage)
                }
              >
                {">"}
              </button>
            </div>
          </div>
          <p className="powered-by">
            Powered by{" "}
            <a href="https://amadeus.com" target="_blank">
              Amadeus
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
