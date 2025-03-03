import PropTypes from "prop-types";
import { FaEdit } from "react-icons/fa";
import airplaneIllustration from "../../assets/airplane.svg";
import "../../styles/trip/TripHeader.css";

const TripHeader = ({
  firstName,
  lastName,
  picture = airplaneIllustration,
}) => {
  const isCustomPicture = picture !== airplaneIllustration;

  return (
    <div className="header-content">
      <div className="header-illustration">
        <img
          src={picture}
          alt="Profile Illustration"
          className={`header-image ${isCustomPicture && "custom-picture"}`}
        />
      </div>

      <div className="header-info">
        <h1>
          {firstName} {lastName}
        </h1>

        <button className="edit-name-btn">
          <FaEdit /> Edit Name
        </button>
      </div>
    </div>
  );
};

TripHeader.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  picture: PropTypes.string,
};

export default TripHeader;
