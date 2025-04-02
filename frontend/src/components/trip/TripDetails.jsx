import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Accordion from "../Accordion";
import { useNavigate } from "react-router-dom";
import "../../styles/trip/TripDetails.css";
import { FaEdit, FaTimes } from "react-icons/fa";

const Itinerary = ({ trip, setShowModal }) => {
  const navigate = useNavigate();
  const generateDayAccordions = () => {
    if (!trip.startDate || !trip.endDate) return [];
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
                value={""} 
                onChange={() => {}} 
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
      {!trip.startDate || !trip.endDate ? (
        <div className="no-dates-selected">
          <div>
            <p>
              Looks like you haven&apos;t selected the dates for your trip yet.
            </p>
            <p>Get started below.</p>
          </div>

          <div className="trip-dates-edit">
            <div className="trip-dates-bar">
              <h3>Trip Dates:</h3>

              <button
                className="edit-budget-btn"
                onClick={() => setShowModal(true)}
              >
                <FaEdit /> Edit dates
              </button>
            </div>
            <div className="days-container">{generateDayAccordions()}</div>
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
              <button
                className="find-hotel-btn"
                onClick={() =>
                  navigate("/loading-screen", {
                    state: {
                      headerText:
                        "Hang on! We’re finding the best hotels for you",
                      redirectTo: "/browse-hotels",
                    },
                  })
                }
              >
                + Find a hotel
              </button>
            </div>
          </div>
          <div className="trip-dates-edit">
            <div className="trip-dates-bar">
            <h3>Trip Dates:</h3>

              <button className="edit-budget-btn" onClick={() => setShowModal(true)}>
            <FaEdit /> Edit dates
          </button>
            </div>
            <div className="days-container">{generateDayAccordions()}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const Budgeting = ({ trip }) => {

  const [budget, setBudget] = useState(trip.budget?.amount ?? 0); // Default to 0
  const [expenses, setExpenses] = useState(trip.budget?.expenses ?? []); // Default to empty list
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  useEffect(() => {
    console.log("Incoming trip.budget.amount in Budgeting:", trip.budget?.amount);
    setBudget(trip.budget?.amount ?? 0);
    console.log("Setting budget to," , trip.budget?.amount ?? 0)
  }, [trip.budget?.amount]);

  useEffect(() => {
    setExpenses(trip.budget?.expenses ?? []);
    console.log("Setting expenses to," , trip.budget?.expenses ?? [])
  }, [trip.budget?.expenses]);  

  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  const isOverBudget = totalExpenses > budget;

  const handleEditBudget = () => {
    setShowBudgetModal(true);
  };

  const handleSaveBudget = async (newBudget) => {
    setBudget(newBudget);
  
    try {
      await fetch("/CSE442/2025-Spring/cse-442aj/backend/api/trips/saveBudgetExpense.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_name: trip.name,
          budget_amount: newBudget, // triggers the update block
        }),
      });
    } catch (err) {
      console.error("Error saving budget amount:", err);
    }
  };

  const handleAddExpense = async (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
  
    try {
      await fetch("/CSE442/2025-Spring/cse-442aj/backend/api/trips/saveBudgetExpense.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city_name: trip.name,
          category: newExpense.category,
          amount: newExpense.amount,
        }),
      });
    } catch (err) {
      console.error("Error saving expense:", err);
    }
  };
  

    // Whenever totalExpenses is updated
    useEffect(() => {
      const loadExpenses = async () => {
        try {
          const res = await fetch(`/CSE442/2025-Spring/cse-442aj/backend/api/trips/getTripExpenses.php?city_name=${encodeURIComponent(trip.name)}`);
          const data = await res.json();
          if (data.success) {
            setExpenses(data.expenses || []);
          } else {
            console.warn("No expenses found:", data.message);
          }
        } catch (err) {
          console.error("Error fetching expenses:", err);
        }
      };
    
      if (trip.name) {
        loadExpenses();
      }
    }, [trip.name]);
    

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
          <div className="budget-amount">${budget.toFixed(2)}</div>
          <div className="budget-spent">
            You spent ${Number(totalExpenses).toFixed(2)}
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
        <button onClick={() => setShowExpenseModal(true)}>+ Add expense</button>
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
              <p>${Number(expense.amount).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {showExpenseModal && (
        <ExpenseModal
          onClose={() => setShowExpenseModal(false)}
          onSave={handleAddExpense}
        />
      )}

      {showBudgetModal && (
        <BudgetModal
          currentBudget={budget}
          onClose={() => setShowBudgetModal(false)}
          onSave={handleSaveBudget}
        />
      )}
    </div>
  );
};

const BudgetModal = ({ currentBudget, onClose, onSave }) => {
  const [amount, setAmount] = useState(currentBudget.toString());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid budget amount");
      return;
    }

    onSave(parseFloat(amount));
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
            Edit <span className="modal-highlight">Budget</span>
          </h3>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="modal-input"
            placeholder="Budget Amount ($)"
            value={amount}
            onChange={handleAmountChange}
            required
          />

          <button type="submit" className="modal-button">
            Save Budget
          </button>
        </form>
      </div>
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

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
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
          <div className="category-buttons-container">
            <button
              type="button"
              className={`category-button ${category === "Flight" && "active"}`}
              onClick={() => handleCategorySelect("Flight")}
            >
              <div className="category-icon">✈️</div>
              <div className="category-label">Flight</div>
            </button>
            <button
              type="button"
              className={`category-button ${category === "Hotel" && "active"}`}
              onClick={() => handleCategorySelect("Hotel")}
            >
              <div className="category-icon">🏨</div>
              <div className="category-label">Hotel</div>
            </button>
            <button
              type="button"
              className={`category-button ${category === "Food" && "active"}`}
              onClick={() => handleCategorySelect("Food")}
            >
              <div className="category-icon">🍽️</div>
              <div className="category-label">Food</div>
            </button>
          </div>

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

const TripDetails = ({ trip, setShowModal }) => {
  const navigate = useNavigate();

  console.log("Trip is:", trip)

  const [currentTab, setCurrentTab] = useState("itinerary");

  return (
    <div className="trip-details">
      {trip.name ? (
        // if trip is selected
        <div className="trips-status">
          <div className="title-container divider">
            <h2>
              Your trip to{" "}
              <span className="title-accent">{trip.name}.</span>
            </h2>
            {/* <p>Select a different trip</p> */}
            <p className="select-different-p" onClick={() => navigate("/all-trips")} style={{ cursor: "pointer", textDecoration: "none"}}>
  Select a different trip
</p>
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
            {currentTab === "itinerary" && (
              <Itinerary trip={trip} setShowModal={setShowModal} />
            )}
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
            className="start-trip-btn-all-trips"
            onClick={() => navigate("/profile/new-destination")}
          >
            Start new trip
          </button>
        </div>
      )}
    </div>
  );
};

const tripProps = PropTypes.shape({
  name: PropTypes.string.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  // location: PropTypes.string.isRequired,
  countryCode: PropTypes.string,
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
  setShowModal: PropTypes.func.isRequired,
};
Itinerary.propTypes = {
  trip: tripProps,
  setShowModal: PropTypes.func.isRequired,
};
Budgeting.propTypes = {
  trip: tripProps,
};
ExpenseModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
BudgetModal.propTypes = {
  currentBudget: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default TripDetails;
