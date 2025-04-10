import React, { useEffect, useState } from "react";
import { FaComments } from "react-icons/fa";
import '../../styles/trip/DiscussionBar.css'

const DiscussionBar = ({ tripId }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/getComments.php?tripId=${tripId}`
      );
      const data = await res.json();
      if (data.success) {
        setComments(data.comments);
      } else {
        console.warn("Failed to fetch comments:", data.message);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open]);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      const res = await fetch(
        "/CSE442/2025-Spring/cse-442aj/angeliqueBackend/api/trips/addComment.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tripId, message }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessage("");
        fetchComments(); // Refresh after sending
      } else {
        alert(data.message || "Failed to send comment.");
      }
    } catch (err) {
      console.error("Send comment error:", err);
    }
  };

  return (
    <div className={`discussion-bar ${open ? "open" : "collapsed"}`}>
      <div className="discussion-header" onClick={() => setOpen(!open)}>
        <FaComments /> {open ? "Discussion" : ""}
      </div>
      {open && (
        <div className="discussion-body">
          <div className="discussion-members">
  <p><strong>Planning with:</strong> Alice, John</p>
</div>
          <div className="messages-placeholder">
            {comments.length === 0 ? (
              <p>No messages yet. Start the conversation!</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="comment">
                  <strong>{c.username}:</strong> {c.comment}
                </div>
              ))
            )}
          </div>
          <div className="discussion-input">
            <input
              type="text"
              placeholder="Type your suggestions here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionBar;
