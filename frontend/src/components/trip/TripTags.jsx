import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../../styles/TripTags.css';

const TripTags = ({ tripId, isInvitee }) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [tripId]);

  const fetchTags = async () => {
    try {
      const res = await fetch(`/CSE442/2025-Spring/cse-442aj/sambackend/api/trips/getTripTags.php?trip_id=${tripId}`);
      const data = await res.json();
      if (data.success) {
        setTags(data.tags);
      }
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  const handleAddTag = async () => {
    if (!inputValue.trim()) return;
    
    const newTag = inputValue.trim();
    const updatedTags = [...tags, newTag];
    
    try {
      const res = await fetch('/CSE442/2025-Spring/cse-442aj/sambackend/api/trips/updateTripTags.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripId,
          tags: updatedTags
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setTags(updatedTags);
        setInputValue('');
      }
    } catch (err) {
      console.error('Failed to add tag:', err);
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    
    try {
      const res = await fetch('/CSE442/2025-Spring/cse-442aj/sambackend/api/trips/updateTripTags.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trip_id: tripId,
          tags: updatedTags
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setTags(updatedTags);
      }
    } catch (err) {
      console.error('Failed to remove tag:', err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  if (!tripId) return null;

  return (
    <div className="trip-tags">
      <div className="tags-header">
        <h3>Trip Tags</h3>
        {!isInvitee && (
          <button 
            className="edit-tags-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done' : 'Edit Tags'}
          </button>
        )}
      </div>

      <div className="tags-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            {isEditing && !isInvitee && (
              <button 
                className="remove-tag"
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditing && !isInvitee && (
        <div className="add-tag">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a tag..."
            maxLength={20}
          />
          <button onClick={handleAddTag}>Add</button>
        </div>
      )}
    </div>
  );
};

TripTags.propTypes = {
  tripId: PropTypes.number,
  isInvitee: PropTypes.bool
};

export default TripTags; 