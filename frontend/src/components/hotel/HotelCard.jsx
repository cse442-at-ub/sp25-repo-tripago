import React from "react";
import "../../styles/hotels/HotelCard.css";

const HotelCard = ({ hotel }) => {
  return (
    <div className="hotel-card">
      {/* Hotel Image */}
      <img src={hotel.image} alt={hotel.name} className="hotel-image" />

      {/* Hotel Info */}
      <div className="hotel-info">
        <h3 className="hotel-name">{hotel.name}</h3>
        <p className="hotel-location">{hotel.distance} from {hotel.location}</p>

        {/* Star Rating */}
        <div className="star-rating">
          {"★".repeat(hotel.rating)}{"☆".repeat(5 - hotel.rating)}
        </div>
        {/* <p className="hotel-reviews">({hotel.reviews} ratings)</p> */}

        {/* Price Info */}
        {/* <div className="price-details">
          <p><span className="price">${hotel.bestPrice}</span></p>
        </div> */}
      </div>

      {/* Price + CTA */}
      <div className="hotel-cta">
        <p className="best-price">${hotel.bestPrice}</p>
        {hotel.freeBreakfast && <p className="free-breakfast">Free breakfast</p>}
        <button className="modal-button">View Deal</button>
      </div>
    </div>
  );
};

export default HotelCard;
