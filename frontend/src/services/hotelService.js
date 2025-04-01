const API_BASE_URL = "/CSE442/2025-Spring/cse-442aj/sambackend/api/amadeus/hotels";

// Haversine formula to calculate distance between two points
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distanceKm = R * c;
  const distanceMiles = distanceKm * 0.621371; // Convert km to miles
  return distanceMiles.toFixed(1); // Return distance in miles with 1 decimal place
}

// Function to format location name properly
export function formatLocationName(name) {
  return name
    .split(' ')
    .map(word => {
      if (word.length <= 2) return word.toUpperCase(); // Keep short words (like "OF", "LA") uppercase
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

// Function to search locations
export async function searchLocations(query) {
  if (query.length < 3) return [];

  try {
    const response = await fetch(
      `${API_BASE_URL}/locations.php?keyword=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    
    if (data.success) {
      return data.data.data || [];
    } else {
      console.error("Location search failed:", data.error);
      return [];
    }
  } catch (err) {
    console.error("Error searching locations:", err);
    return [];
  }
}

// Function to search hotels and their offers
export async function searchHotels(searchLocation, checkInDate, checkOutDate, adults, rooms) {
  if (!searchLocation || !checkInDate || !checkOutDate) {
    throw new Error("Please select a location and dates");
  }

  try {
    // First get hotels in the city
    const hotelsResponse = await fetch(
      `${API_BASE_URL}/hotels.php?cityCode=${searchLocation.iataCode}`
    );
    const hotelsData = await hotelsResponse.json();
    console.log("hotelsData", hotelsData);

    if (!hotelsData.success) {
      throw new Error(hotelsData.error || "Failed to fetch hotels");
    }

    const hotelsList = hotelsData.data.data || [];
    console.log("hotelsList", hotelsList);
    
    // Then get offers for these hotels
    const hotelIds = hotelsList.map(h => h.hotelId).join(",");
    let offersMap = {};
    
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
      
      console.log("offersData", offersData);
      if (offersData.success) {
        // Create a map of hotelId to offer
        console.log("offersData.data.data", offersData.data.data);
        (offersData.data.data || []).forEach(offer => {
          console.log("offer", offer);
          offersMap[offer.hotel.hotelId] = offer;
        });
      }
    }

    return {
      hotels: hotelsList,
      offers: offersMap
    };
  } catch (err) {
    throw new Error(err.message || "Error searching hotels");
  }
} 