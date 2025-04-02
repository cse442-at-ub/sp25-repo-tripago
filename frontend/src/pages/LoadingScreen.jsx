import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LoadingScreen.css";

const LoadingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { headerText, redirectTo, recommendations } = location.state || {
    headerText: "Loading...",
    redirectTo: "/",
    recommendations: null
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // Only pass recommendations if they exist
      if (recommendations) {
        navigate(redirectTo, { state: { recommendations } });
      } else {
        navigate(redirectTo);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, recommendations]);

  return (
    <div className="loading-screen">
      <h2>{headerText}</h2>
      <div className="loading-spinner"></div>
      <p>This may take a while...</p>
      <p className="powered-by">
            Powered by{" "}
            <a href="https://amadeus.com" target="_blank">
              Amadeus
            </a>
      </p>
      <button className="loading-cancel" onClick={() => navigate(-1)}>✖</button>
    </div>
  );
};

export default LoadingScreen;
