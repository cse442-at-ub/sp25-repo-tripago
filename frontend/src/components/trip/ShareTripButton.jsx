import { useState } from "react";
import { FaShare } from "react-icons/fa";
import ShareTripModal from "./ShareTripModal";
import "../../styles/trip/ShareTripButton.css";

const ShareTripButton = () => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <button
        className="fixed-share-btn"
        onClick={() => setShowShareModal(true)}
        aria-label="Share Trip"
      >
        Share a Memory <FaShare />
      </button>

      {showShareModal && (
        <ShareTripModal onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
};

export default ShareTripButton;
