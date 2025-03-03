import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./App.css";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import NewPassword from "./pages/NewPassword.jsx";
import Profile from "./pages/Profile.jsx";
import StyleGuide from "./pages/StyleGuide.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Settings from "./pages/Settings.jsx";
import SettingsProfileDetails from "./pages/SettingsProfileDetails.jsx";
import SettingsAccessibility from "./pages/SettingsAccessibility.jsx";
import SettingsLanguageAndRegion from "./pages/SettingsLanguageAndRegion.jsx";
import SettingsManagePassword from "./pages/SettingsManagePassword.jsx";
import SettingsRecentActivity from "./pages/SettingsRecentActivity.jsx";
import SettingsMyData from "./pages/SettingsMyData.jsx";
import SettingsTermsOfService from "./pages/SettingsTermsOfService.jsx";
import SettingsPrivacyPolicy from "./pages/SettingsPrivacyPolicy.jsx";

const App = () => {
  return (
    <HashRouter>
      <div className="app-container">
        <Navbar />

      <Routes>
        <Route path="/settings/*" element={<Sidebar />} />
      </Routes>

        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<PasswordReset />} />
            <Route path="/new-password" element={<NewPassword />} />
          <Route path="/style-guide" element={<StyleGuide />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/profile-details" element={<SettingsProfileDetails />} />
          <Route path="/settings/accessibility" element={<SettingsAccessibility />} />
          <Route path="/settings/language-and-region" element={<SettingsLanguageAndRegion />} />
          <Route path="/settings/manage-password" element={<SettingsManagePassword />} />
          <Route path="/settings/recent-activity" element={<SettingsRecentActivity />} />
          <Route path="/settings/my-data" element={<SettingsMyData />} />
          <Route path="/settings/terms-of-service" element={<SettingsTermsOfService />} />
          <Route path="/settings/privacy-policy" element={<SettingsPrivacyPolicy />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;
