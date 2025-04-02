import React from "react";
import "../../styles/hotels/HotelCard.css";
import { encode } from "html-entities";

const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card">
      {/* Hotel Image */}
      <img src={hotel.image} alt={encode(hotel.name)} className="hotel-image" />

      {/* Hotel Info */}
      <div className="hotel-info">
        <h3 className="hotel-name">{encode(hotel.name)}</h3>
        <p className="hotel-location">{encode(hotel.distance)} from {encode(hotel.location)}</p>

        {/* Star Rating */}
        <div className="star-rating">
          {"★".repeat(hotel.rating)}{"☆".repeat(5 - hotel.rating)}
        </div>
        <p className="hotel-reviews">(({encode(String(hotel.reviews))} ratings)</p>

        {/* Price Info */}
        <div className="price-details">
          <p>{encode(hotel.platform1)}: <span className="price">${encode(String(hotel.price1))}</span></p>
          <p>{encode(hotel.platform2)}: <span className="price">${encode(String(hotel.price2))}</span></p>
        </div>
      </div>

      {/* Price + CTA */}
      <div className="hotel-cta">
        <p className="best-price">${encode(String(hotel.bestPrice))}</p>
        {hotel.freeBreakfast && <p className="free-breakfast">Free breakfast</p>}
        <button className="modal-button">View Deal</button>
      </div>
    </div>
  );
};

export default HotelCard;
