import { HashRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './App.css'
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

const App = () => {

  return (
    <HashRouter>
    <div className="app-container">
      <Navbar />
      
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <Footer />
    </div>
  </HashRouter>
  )
}

export default App
