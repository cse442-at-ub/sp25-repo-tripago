import { useState } from "react";
import PropTypes from "prop-types";
import Accordion from "../Accordion";
import { useNavigate } from "react-router-dom";
import "../../styles/trip/TripDetails.css";
import { FaEdit, FaTimes } from "react-icons/fa";

const Itinerary = ({ trip }) => {
  const generateDayAccordions = () => {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const dayAccordions = [];

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i + 1);

      const dateString = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      const dayActivities =
        trip.days && trip.days[i] ? trip.days[i].activities : [];

      dayAccordions.push(
        <Accordion key={i} title={dateString}>
          <div className="day-content">
            {dayActivities && dayActivities.length > 0 ? (
              <div className="activities-list">
                {dayActivities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-header">
                      <h3>{activity.name}</h3>
                    </div>
                    {activity.time && (
                      <p className="activity-time">Open {activity.time}</p>
                    )}
                    {activity.description && (
                      <p className="activity-description">
                        {activity.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No activities planned yet.</p>
            )}
            <div className="activity-controls">
              <input
                type="text"
                placeholder="Enter location"
                className="location-input"
              />
              <button className="add-activity-btn">+ Add activity</button>
            </div>
          </div>
        </Accordion>
      );
    }

    return dayAccordions;
  };

  return (
    <div className="itinerary-container">
      {trip.startDate == null || trip.endDate == null ? (
        <div className="no-dates-selected">
          <div>
            <p>
              Looks like you haven&apos;t selected the dates for your trip yet.
            </p>
            <p>Get started below.</p>
          </div>

          <div className="plan-trip-create-section">
            <button className="add-dates-btn">+ Add trip dates</button>
            <p className="create-for-me-text">Create the sections for me.</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="hotel-details">
            <h3>Hotel Details:</h3>
            <div className="hotel-status">
              <p className="no-hotel-message">
                Looks like you haven&apos;t booked a hotel yet for this trip.
              </p>
              <button className="find-hotel-btn">+ Find a hotel</button>
            </div>
          </div>
          <div className="days-container">{generateDayAccordions()}</div>
        </div>
      )}
    </div>
  );
};

const Budgeting = ({ trip }) => {
  const [budget, setBudget] = useState(trip.budget?.amount);
  const [expenses, setExpenses] = useState(trip.budget?.expenses);
  const [showModal, setShowModal] = useState(false);

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const isOverBudget = totalExpenses > budget;

  const handleEditBudget = () => {
    const newBudget = prompt("Enter new budget amount:", budget);
    if (newBudget && !isNaN(newBudget)) {
      setBudget(Number(newBudget));
    }
  };

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };

  return (
    <div className="budgeting-container">
      <div className="budget-info">
        <div className="budget-header">
          <h2>Budgeting</h2>
          <button className="edit-budget-btn" onClick={handleEditBudget}>
            <FaEdit /> Edit budget
          </button>
        </div>

        <div className="budget-overview">
          <div className="budget-amount">${budget}</div>
          <div className="budget-spent">
            You spent ${totalExpenses}
            {isOverBudget && (
              <div className="budget-warning">
                <span className="warning-icon">ⓘ</span>
                You&apos;ve exceeded your budget.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="expenses-section">
        <h3>Expenses</h3>
        <button onClick={() => setShowModal(true)}>+ Add expense</button>
        <div className="expenses-list">
          {expenses.map((expense, index) => (
            <div key={index} className="expense-item">
              <div className="expense-details">
                <div className="expense-icon">
                  {expense.category.toLowerCase().includes("flight")
                    ? "✈️"
                    : expense.category.toLowerCase().includes("hotel")
                    ? "🏨"
                    : expense.category.toLowerCase().includes("food")
                    ? "🍽️"
                    : "💰"}
                </div>
                <p>{expense.category}</p>
              </div>
              <p>${expense.amount}</p>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          onSave={handleAddExpense}
        />
      )}
    </div>
  );
};

const ExpenseModal = ({ onClose, onSave }) => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!category || !amount || isNaN(parseFloat(amount))) {
      alert("Please enter valid expense details");
      return;
    }

    onSave({
      category,
      amount: parseFloat(amount),
    });

    onClose();
  };

  const handleAmountChange = (e) => {
    // Only allow numbers and decimal points
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-close" onClick={onClose}>
            <FaTimes />
          </span>
          <h3>
            Add <span className="modal-highlight">Expense</span>
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <select
            className="modal-dropdown"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Flight">Flight</option>
            <option value="Hotel">Hotel</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Activities">Activities</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            className="modal-input"
            placeholder="Amount ($)"
            value={amount}
            onChange={handleAmountChange}
            required
          />

          <button type="submit" className="modal-button">
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
};

const TripDetails = ({ trip }) => {
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState("itinerary");

  return (
    <div className="trip-details">
      {trip ? (
        // if trip is selected
        <div className="trips-status">
          <div className="title-container divider">
            <h2>
              Your trip to{" "}
              <span className="title-accent">{trip.location}.</span>
            </h2>
            <p>Select a different trip</p>
          </div>
          <div className="itin-budget-container">
            <p
              className={`itin-budget-tab ${
                currentTab === "itinerary" && "active"
              }`}
              onClick={() => setCurrentTab("itinerary")}
            >
              Itinerary
            </p>
            <p
              className={`itin-budget-tab ${
                currentTab === "budgeting" && "active"
              }`}
              onClick={() => setCurrentTab("budgeting")}
            >
              Budgeting
            </p>
          </div>

          <div className="tab-content">
            {currentTab === "itinerary" && <Itinerary trip={trip} />}
            {currentTab === "budgeting" && <Budgeting trip={trip} />}
          </div>
        </div>
      ) : (
        // if NO trip is selected
        <div className="trips-status">
          <h2 className="divider trip-status-pad">
            Looks like you don&apos;t have any trips scheduled yet.
          </h2>
          <p>Get started below.</p>

          <button
            className="plan-trip-btn"
            onClick={() => navigate("/new-trip")}
          >
            Plan my trip
          </button>
        </div>
      )}
    </div>
  );
};

const tripProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  days: PropTypes.arrayOf(
    PropTypes.shape({
      activities: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          time: PropTypes.string,
          description: PropTypes.string,
        })
      ),
    })
  ),
  budget: PropTypes.shape({
    amount: PropTypes.number.isRequired,
    expenses: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ),
  }),
});

TripDetails.propTypes = {
  trip: tripProps,
};
Itinerary.propTypes = {
  trip: tripProps,
};
Budgeting.propTypes = {
  trip: tripProps,
};
ExpenseModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TripDetails;
