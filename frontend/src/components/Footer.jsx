import React from 'react'
import { useLocation } from "react-router-dom"; 

const Footer = () => {
  const location = useLocation();
  const isBrowseHotelsPage = location.pathname === "/browse-hotels";

  if (isBrowseHotelsPage) {
    return null; // Do not render the footer on the Browse Hotels page
  }

  return (
    <footer className="footer">
      <p>© Copyright 2025 Tripago. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
