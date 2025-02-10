import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import AuthModal from "./AuthModal";

function Navbar({ isAuthenticated, onAuthSuccess }) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openModal = () => {
    console.log("Opening Modal..."); 
    setShowAuthModal(true);
  };

  const closeModal = () => {
    console.log("Closing Modal...");
    setShowAuthModal(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Home</Link>
      {!isAuthenticated && <button className="nav-link" onClick={openModal}>Login / Register</button>}
      {isAuthenticated && <Link to="/events" className="nav-link">Events</Link>}
      {isAuthenticated && <Link to="/profile" className="nav-link">Profile</Link>}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onAuthSuccess={onAuthSuccess} />
    </nav>
  );
}

export default Navbar;
