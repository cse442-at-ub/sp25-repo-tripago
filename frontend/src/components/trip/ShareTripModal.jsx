import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaImage, FaQuoteLeft, FaTrash } from "react-icons/fa";
import "../../styles/trip/ShareTripModal.css";
import axios from 'axios';

const ShareTripModal = ({ onClose, trip }) => {
  const [quote, setQuote] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isShared, setIsShared] = useState(false);
  const modalRef = useRef(null);

  const handleQuoteChange = (e) => {
    setQuote(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const  options  = {

      maxSizeMB: 1,
      
      maxWidthOrHeight: 800,
      
      useWebWorker:  true
      
    };

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

  const handleShare = async () => {

    const formData = new FormData();
    
    formData.set("tripId", trip.id);
    formData.set("caption", quote);
    for (const img of images) {
      formData.append("images[]", img);
    }

    try {

      const response = await axios.post(
        "/CSE442/2025-Spring/cse-442aj/owenbackend/api/trips/saveMemory.php",
        formData,
        {headers:
          {"Content-Type": "multipart/form-data"},
        },
      );

      const data = await response.data;
      console.log("Data recieved after saving memory: ", data);

      if (data.success) {
        console.log("saveMemory form response: ", data.message);
      } else {
        console.error("Saving memory failed: ", data.message);
      }

    } catch(err) {
      console.error("Error saving memory: ", err);
    }

    onClose();
  }

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
            Share A <span className="modal-highlight">Memory</span>
          </h3>
        </div>

        <div className="share-content">
          <div className="quote-section">
            <label htmlFor="trip-quote">
              <FaQuoteLeft /> Caption
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
          <button className="modal-button" onClick={handleShare}>
            Post Trip Memory
          </button>
        </div>
      </div>
    </div>
  );
};

ShareTripModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  trip: PropTypes.object.isRequired,
};

export default ShareTripModal;
