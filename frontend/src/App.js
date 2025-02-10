import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import logo from "./assets/logo.png";
import "./App.css"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false); // ✅ Reset auth state immediately
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <img className="logo" src={logo}/>
      <Navbar isAuthenticated={isAuthenticated} onAuthSuccess={handleAuthSuccess} />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/login" />} />
        <Route path="/events/:id" element={<EventDetails />} /> {/*  Individual Event Page */}
        <Route path="/profile" element={isAuthenticated ? <Profile onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
