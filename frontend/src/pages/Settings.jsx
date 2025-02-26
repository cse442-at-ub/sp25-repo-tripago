import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/Settings.css'
import Sidebar from "../components/Sidebar.jsx";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Sidebar /> */}

      <b>Settings frontend has loaded.</b>
    </>
  )
}

export default Settings