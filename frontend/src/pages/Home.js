import React from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { useState } from "react";
import AuthModal from "../components/AuthModal";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const isLoggedIn = localStorage.getItem("token") !== null;
  return (
    <div className="body">

      <div className="container">
        <h1>Plan, Manage & Elevate Your Events</h1>
        <p>
          Welcome to the ultimate Event Management Platform! Organize, track, and manage events 
          seamlessly with our powerful tools. Whether it's a corporate meeting, a wedding, or a 
          community gathering, we've got you covered.
        </p>

      </div>
    </div>
  );
}

export default Home;
