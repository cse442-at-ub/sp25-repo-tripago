import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaImage, FaQuoteLeft, FaTrash } from "react-icons/fa";
import "../../styles/trip/ShareTripModal.css";

const ShareTripModal = ({ onClose }) => {
  const [quote, setQuote] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isShared, setIsShared] = useState(false);
  const modalRef = useRef(null);

  /* Email trip */
  const handleChange = (e) => {
    setShareData({ ...shareData, [e.target.name]: e.target.value });
  };

  const [shareData, setShareData] = useState({
    email: "",
    quote: "",
    trip: "",
    userName: ""
  });

  
  const handleEmailSubmit = async () => {
    try {
      const response = await fetch('http://localhost/tripago/send_trip.php', {
      //const response = await fetch('/CSE442/2025-Spring/cse-442aj/backend/api/send_trip.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: shareData.email,
          quote: quote,
          trip: JSON.parse(localStorage.getItem("selectedTrip"))?.name,
          userName: "Jane"
        })
      });
      
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  /*---------------------------------*/

  const handleQuoteChange = (e) => {
    setQuote(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Create preview URLs for the images
    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...newPreviewImages]);

    // Store the actual files
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const updatedPreviewImages = [...previewImages];
    const updatedImages = [...images];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);

    updatedPreviewImages.splice(index, 1);
    updatedImages.splice(index, 1);

    setPreviewImages(updatedPreviewImages);
    setImages(updatedImages);
  };

  const handleShare = () => {
    // TODO: Implement the actual sharing functionality

    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="share-modal" ref={modalRef}>
        <div className="modal-header">
          <h3>
            Share Your <span className="modal-highlight">Trip</span>
          </h3>
        </div>

        <div className="share-content">
          <div className="quote-section">
            <label htmlFor="trip-quote">
              <FaQuoteLeft /> Memorable Quote
            </label>
            <textarea
              id="trip-quote"
              className="quote-input"
              placeholder="Share a memorable moment from your trip..."
              value={quote}
              onChange={handleQuoteChange}
              rows={4}
            />
          </div>

          <div className="image-upload-section">
            <div className="image-header">
              <label htmlFor="trip-images">
                <FaImage /> Trip Photos{" "}
                {images.length > 0 && `(${images.length})`}
              </label>
              <div className="upload-container">
                <input
                  type="file"
                  id="trip-images"
                  className="file-input"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
                <label htmlFor="trip-images" className="upload-button">
                  + Add Photos
                </label>
              </div>
            </div>

            {/* Email trip */}
            <p style={{width: '40%', margin: '0', padding: '0'}} >Send info to another user</p>
            <div style={{width: '100%', display: 'block'}}>
              <input style={{width: '50%', margin: '0'}}
                type="email"
                name="email"
                placeholder="Email address"
                value={shareData.email}
                onChange={handleChange}
                required
              />
              <button onClick={handleEmailSubmit}>
                Send
              </button>
            </div>
            {/* ------------------ */}

            {images.length < 1 && (
              <span className="upload-info">No images selected</span>
            )}

            {previewImages.length > 0 && (
              <div className="image-previews">
                {previewImages.map((src, index) => (
                  <div key={index} className="image-preview-container">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="image-preview"
                    />
                    <div className="image-preview-overlay">
                      <button
                        className="remove-image-btn"
                        onClick={() => removeImage(index)}
                        aria-label="Remove image"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="share-toggle">
            <label className="toggle">
              <input
                type="checkbox"
                checked={isShared}
                onChange={(e) => setIsShared(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span className="toggle-label">
              {isShared ? "Public" : "Private"}
            </span>
          </div>
          <button className="modal-button" onClick={handleShare}>
            Update Trip Memories
          </button>
        </div>
      </div>
    </div>
  );
};

ShareTripModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ShareTripModal;
