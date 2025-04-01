import React from "react";
import "../../styles/hotels/HotelCard.css";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from 'prop-types';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const HotelCard = ({ hotel }) => {
  const position = [hotel.geoCode.latitude, hotel.geoCode.longitude]

  return (
    <div className="hotel-card">
      {/* Hotel Map */}
      <div className="hotel-map">
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: "150px", width: "150px", borderRadius: "8px" }}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
        </MapContainer>
      </div>

      {/* Hotel Info */}
      <div className="hotel-info">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location">{hotel.distance} miles from {hotel.location}</p>

        {/* Star Rating */}
        <div className="star-rating">
          {"★".repeat(hotel.rating)}{"☆".repeat(5 - hotel.rating)}
        </div>
      </div>

      {/* Price + CTA */}
      <div className="hotel-cta">
        <p className="best-price">${hotel.bestPrice}</p>
        {hotel.freeBreakfast && <p className="free-breakfast">Free breakfast</p>}
        <button className="modal-button">Select Deal</button>
      </div>
    </div>
  );
};

export default HotelCard;
