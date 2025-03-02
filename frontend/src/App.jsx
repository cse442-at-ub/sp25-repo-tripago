import { HashRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './App.css'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import NewPassword from "./pages/NewPassword.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Settings from "./pages/Settings.jsx";
import SettingsProfileDetails from "./pages/SettingsProfileDetails.jsx";

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

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/profile-details" element={<SettingsProfileDetails />} />

        </Routes>
      </main>

      <Footer />
    </div>
  </HashRouter>
  )
}

export default App
