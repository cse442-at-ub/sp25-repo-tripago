// export default Hotels;
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import HotelCard from "../../components/hotel/HotelCard";
import "../../styles/hotels/Hotels.css";
import searchIcon from "../../assets/Search.png";
import calendarIcon from "../../assets/calendar.png";
import locationIcon from "../../assets/location.png";
import profileIcon from "../../assets/profile.png";
import bedIcon from "../../assets/bed.png";
import TravelersModal from "../../components/hotel/TravelersModal";

const API_BASE_URL = "/CSE442/2025-Spring/cse-442aj/sambackend/api/amadeus/hotels";

const Hotels = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Search form state
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || "");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [focusedLocationIndex, setFocusedLocationIndex] = useState(-1);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const locationInputRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const initialSearchDone = useRef(false);

  // Function to format location name properly
  const formatLocationName = (name) => {
    return name
      .split(' ')
      .map(word => {
        if (word.length <= 2) return word.toUpperCase(); // Keep short words (like "OF", "LA") uppercase
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target) &&
        !locationInputRef.current.contains(event.target)
      ) {
        setIsLocationDropdownOpen(false);
        setFocusedLocationIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for location dropdown
  const handleLocationKeyDown = (e) => {
    if (!isLocationDropdownOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsLocationDropdownOpen(true);
        setFocusedLocationIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        setFocusedLocationIndex(prev => 
          prev < locationResults.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        break;
      case "ArrowUp":
        setFocusedLocationIndex(prev => prev > 0 ? prev - 1 : -1);
        e.preventDefault();
        break;
      case "Enter":
        if (focusedLocationIndex >= 0 && focusedLocationIndex < locationResults.length) {
          const location = locationResults[focusedLocationIndex];
          handleLocationSelect(location);
        }
        e.preventDefault();
        break;
      case "Escape":
        setIsLocationDropdownOpen(false);
        setFocusedLocationIndex(-1);
        e.preventDefault();
        break;
      default:
        break;
    }
  };

  // Function to search locations
  const searchLocations = async (query) => {
    if (query.length < 3) return;

    setIsSearchingLocation(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/locations.php?keyword=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      
      if (data.success) {
        const results = data.data.data || [];
        setLocationResults(results);
        return results;
      } else {
        console.error("Location search failed:", data.error);
        return [];
      }
    } catch (err) {
      console.error("Error searching locations:", err);
      return [];
    } finally {
      setIsSearchingLocation(false);
    }
  };

  // Handle URL parameters on mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    
    if (locationParam && !initialSearchDone.current) {
      initialSearchDone.current = true;
      
      // Search for the location
      searchLocations(locationParam).then(results => {
        if (results.length > 0) {
          // Find exact match or use first result
          const exactMatch = results.find(
            loc => loc.name.toLowerCase() === locationParam.toLowerCase()
          ) || results[0];
          
          handleLocationSelect(exactMatch);
        }
      });
    }
  }, [searchParams]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationQuery(location.name);
    setIsLocationDropdownOpen(false);
    setFocusedLocationIndex(-1);
    setLocationResults([]);
    
    // Update URL search params
    setSearchParams(params => {
      params.set('location', location.name);
      return params;
    });
  };

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setLocationQuery(value);
    setSelectedLocation(null);
    
    // Remove location from URL params when input is cleared
    setSearchParams(params => {
      params.delete('location');
      return params;
    });
    
    // Clear previous timeout if it exists
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (value.length < 3) {
      setLocationResults([]);
      setIsLocationDropdownOpen(false);
      setIsSearchingLocation(false);
      return;
    }

    setIsSearchingLocation(true);
    setIsLocationDropdownOpen(true);

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 500);
  };

  // Hotel results state
  const [hotels, setHotels] = useState([]);
  const [hotelOffers, setHotelOffers] = useState({});
  const [isLoadingHotels, setIsLoadingHotels] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);

  // UI state
  const [sortOption, setSortOption] = useState("Distance");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 3;
  const [freeBreakfastOnly, setFreeBreakfastOnly] = useState(false);

  // Search for hotels when location is selected
  const searchHotels = async () => {
    if (!selectedLocation || !checkInDate || !checkOutDate) {
      setError("Please select a location and dates");
      return;
    }

    setError(null);
    setHotels([]);
    setHotelOffers({});

    try {
      // First get hotels in the city
      setIsLoadingHotels(true);
      const hotelsResponse = await fetch(
        `${API_BASE_URL}/hotels.php?cityCode=${selectedLocation.iataCode}`
      );
      const hotelsData = await hotelsResponse.json();

      if (!hotelsData.success) {
        throw new Error(hotelsData.error || "Failed to fetch hotels");
      }

      const hotelsList = hotelsData.data.data || [];
      setHotels(hotelsList);

      // Then get offers for these hotels
      setIsLoadingOffers(true);
      const hotelIds = hotelsList.map(h => h.hotelId).join(",");
      if (hotelIds) {
        const offersResponse = await fetch(
          `${API_BASE_URL}/hotel_offers.php?` + new URLSearchParams({
            hotelIds,
            checkInDate,
            checkOutDate,
            adults: adults.toString(),
            rooms: rooms.toString()
          })
        );
        const offersData = await offersResponse.json();

        if (offersData.success) {
          // Create a map of hotelId to offer
          const offersMap = {};
          (offersData.data.data || []).forEach(offer => {
            offersMap[offer.hotel.hotelId] = offer;
          });
          setHotelOffers(offersMap);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error("Error searching hotels:", err);
    } finally {
      setIsLoadingHotels(false);
      setIsLoadingOffers(false);
    }
  };

  // Filter and sort hotels
  let filteredHotels = [...hotels];
  
  if (freeBreakfastOnly) {
    filteredHotels = filteredHotels.filter(hotel => {
      const offer = hotelOffers[hotel.hotelId];
      return offer?.offers?.[0]?.amenities?.includes("BREAKFAST");
    });
  }

  // Sorting logic
  const handleSortSelection = (option) => {
    setSortOption(option);
    setIsDropdownOpen(false);
  };

  if (sortOption === "Price (low to high)") {
    filteredHotels.sort((a, b) => {
      const priceA = hotelOffers[a.hotelId]?.offers?.[0]?.price?.total || 0;
      const priceB = hotelOffers[b.hotelId]?.offers?.[0]?.price?.total || 0;
      return priceA - priceB;
    });
  } else if (sortOption === "Price (high to low)") {
    filteredHotels.sort((a, b) => {
      const priceA = hotelOffers[a.hotelId]?.offers?.[0]?.price?.total || 0;
      const priceB = hotelOffers[b.hotelId]?.offers?.[0]?.price?.total || 0;
      return priceB - priceA;
    });
  } else if (sortOption === "Hotel class") {
    filteredHotels.sort((a, b) => b.rating - a.rating);
  } else if (sortOption === "Distance") {
    filteredHotels.sort((a, b) => {
      const distanceA = parseFloat(a.distance) || 0;
      const distanceB = parseFloat(b.distance) || 0;
      return distanceA - distanceB;
    });
  }

  // Pagination logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(indexOfFirstHotel, indexOfLastHotel);

  return (
    <div className="hotels-page">
      <div className="top-section">
        <div className="content-container">
          <div className="search-bar">
            {/* Location Input */}
            <div className="input-wrapper">
              <label htmlFor="location-input">Where</label>
              <div className="input-container">
                <img src={locationIcon} alt="" className="input-icon" aria-hidden="true" />
                <input
                  id="location-input"
                  ref={locationInputRef}
                  type="text"
                  role="combobox"
                  aria-expanded={isLocationDropdownOpen}
                  aria-controls="location-listbox"
                  aria-activedescendant={
                    focusedLocationIndex >= 0
                      ? `location-option-${focusedLocationIndex}`
                      : undefined
                  }
                  value={locationQuery}
                  onChange={handleLocationInputChange}
                  onKeyDown={handleLocationKeyDown}
                  onFocus={() => {
                    if (locationResults.length > 0) {
                      setIsLocationDropdownOpen(true);
                    }
                  }}
                  placeholder="Enter a city"
                  autoComplete="off"
                />
                {isLocationDropdownOpen && (
                  <div 
                    ref={locationDropdownRef}
                    id="location-listbox"
                    role="listbox"
                    className="location-dropdown"
                    aria-label="Location suggestions"
                  >
                    {isSearchingLocation ? (
                      <div className="location-loading">
                        <div className="loading-dots">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                      </div>
                    ) : locationResults.length > 0 ? (
                      locationResults.map((location, index) => (
                        <div
                          id={`location-option-${index}`}
                          key={location.iataCode}
                          role="option"
                          aria-selected={focusedLocationIndex === index}
                          className={`location-option ${
                            focusedLocationIndex === index ? "focused" : ""
                          }`}
                          onClick={() => handleLocationSelect(location)}
                          onMouseEnter={() => setFocusedLocationIndex(index)}
                        >
                          <div className="location-name">{formatLocationName(location.name)}</div>
                          <div className="location-details">
                            {formatLocationName(location.address.cityName)}, {location.address.countryCode}
                            {location.subType === "AIRPORT" && " (Airport)"}
                          </div>
                        </div>
                      ))
                    ) : locationQuery.length >= 3 ? (
                      <div className="location-no-results">
                        No locations found
                      </div>
                    ) : (
                      <div className="location-hint">
                        Enter at least 3 characters to search
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Check-in Date Input */}
            <div className="input-wrapper">
              <label>Check-in</label>
              <div className="input-container">
                <img src={calendarIcon} alt="Calendar" className="input-icon" />
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Check-out Date Input */}
            <div className="input-wrapper">
              <label>Check-out</label>
              <div className="input-container">
                <img src={calendarIcon} alt="Calendar" className="input-icon" />
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                />
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
              <div 
                className="search-container"
                onClick={searchHotels}
                style={{ cursor: 'pointer' }}
              >
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
          {error && <div className="error-message">{error}</div>}
          
          {/* Filters */}
          {hotels.length > 0 && (
            <div className="filters filters-sort">
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
          )}

          {/* Loading States */}
          {(isLoadingHotels || isLoadingOffers) && (
            <div className="loading-message">
              {isLoadingHotels ? "Loading hotels..." : "Loading prices..."}
            </div>
          )}

          {/* Hotel List */}
          <div className="hotels-list">
            {currentHotels.length > 0 ? (
              currentHotels.map((hotel) => {
                const offer = hotelOffers[hotel.hotelId];
                const hotelData = {
                  ...hotel,
                  name: hotel.name,
                  location: `${hotel.address.cityName}, ${hotel.address.countryCode}`,
                  rating: parseInt(hotel.rating),
                  reviews: hotel.reviews || 0,
                  bestPrice: offer?.offers?.[0]?.price?.total,
                  freeBreakfast: offer?.offers?.[0]?.amenities?.includes("BREAKFAST"),
                  image: hotel.media?.[0]?.uri || null,
                };
                
                return <HotelCard key={hotel.hotelId} hotel={hotelData} />;
              })
            ) : !isLoadingHotels && !isLoadingOffers ? (
              <p>No hotels available with the current filters.</p>
            ) : null}
          </div>

          {/* Pagination */}
          {filteredHotels.length > 0 && (
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
          )}
          
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
