import React from "react";
import "../../styles/hotels/SortModal.css"; 

const SortModal = ({ setIsSortModalOpen, setSortOption }) => {
  const handleSortSelection = (option) => {
    setSortOption(option); // Update selected sort option
    setIsSortModalOpen(false); // Close modal
  };

  return (
    <div className="modal-overlay">
      <div className="sort-modal">
        <button className="close-button" onClick={() => setIsSortModalOpen(false)}>✖</button>
        <h2>Sort by</h2>
        <div className="sort-options">
          {["Price (low to high)", "Price (high to low)", "Hotel class", "Distance", "Review score"].map((option, index) => (
            <label key={index} className="sort-option-item">
              <input type="radio" name="sort" onChange={() => handleSortSelection(option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortModal;
