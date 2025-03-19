import React, { useEffect, useState } from "react";
import "../../styles/community/FriendsModal.css"

const FriendsModal = ({ isOpen, onClose, user, location, imageUrl, comment, isFriend}) => {
  const [comments, setComments] = useState([
    { id: 1, user: "Emily", text: "This looks amazing! I want to visit too!" },
    { id: 2, user: "Michael", text: "Hope you had a great time!" },
  ]);
  const [newComment, setNewComment] = useState("");
 
  if (!isOpen) return null;

    // Handle comment submission
    const handleAddComment = () => {
      if (newComment.trim() === "") return; // Prevent empty comments
  
      const newCommentObj = {
        id: comments.length + 1,
        user: "You", // Replace with actual logged-in user later
        text: newComment,
      };
  
      setComments([...comments, newCommentObj]);
      setNewComment(""); // Reset input field
    };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>
          <span className="bold">{user}'s</span> trip to{" "}
          <span className="highlight">{location}</span>.
        </h2>
        <p className="trip-comment">"{comment}"</p>
        
        <div className="modal-image-container">
          <img src={imageUrl} alt={location} className="modal-image" />
          <p className="trip-location">Downtown {location}</p>
        </div>

        {!isFriend ? (
          <div className="friends-restriction">
            <p>You must be friends to view the itinerary and comments.</p>
            <button className="send-request-btn">Send Friend Request</button>
          </div>
        ) : (
          /* If friends, show itinerary (In future, we will grab this information from db, maybe) */
          <>
          <div className="itinerary-section">
            <h3>Itinerary</h3>
            <ul>
              <li><b>Friday, January 24th:</b> Arrive at the Marriott, Beach sunset, Dinner at Surfside Taphouse</li>
              <li><b>Saturday, January 25th:</b> Explore downtown, Visit museums</li>
              <li><b>Sunday, January 26th:</b> Departure</li>
            </ul>
          </div>

         <div className="comments-section">
  <h3>Comments</h3>
  <div className="comments-list">
    {comments.map((c) => (
      <div key={c.id} className="comment">
        <span className="comment-user">{c.user}:</span> {c.text}
      </div>
    ))}
  </div>

  {/* Add New Comment */}
  <div className="add-comment">
    <input
      type="text"
      placeholder="Write a comment..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
      className="comment-input"
    />
    <button className="comment-btn" onClick={handleAddComment}>Post</button>
  </div>
</div>
         </>
        )}
      </div>
    </div>
  );
};

export default FriendsModal;
