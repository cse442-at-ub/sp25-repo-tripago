import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home.jsx'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import './App.css'
import Login from "./pages/Login.jsx";

const App = () => {

  return (
    <BrowserRouter>
    <div className="app-container">
      <Navbar />
      <main className="content">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

        </Routes>
        
      </main>
      <Footer />
    </div>
  </BrowserRouter>
  )
}

export default App
