import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import "./Profile.css"
function Profile({  onLogout}) {
  const [user, setUser] = useState({ name: "", email: "" });
  const [events, setEvents] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setNewName(res.data.name);
      } catch (error) {
        alert("Error fetching profile");
      }
    };
    fetchUser();

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      try {
        const userRes = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const eventsRes = await axios.get("http://localhost:5000/api/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(eventsRes.data);
      } catch (error) {
        alert("Error fetching profile data");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        "http://localhost:5000/api/auth/profile",
        { name: newName, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setUser({ ...user, name: newName });
      setNewPassword("");
    } catch (error) {
      alert("Error updating profile");
    }
  };

  const handleLogout = () => {
    onLogout(); 
    navigate("/"); 
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Profile Update Form */}
      <form className="profile-form" onSubmit={handleUpdate}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit" className="profile-button">
          Update Profile
        </button>
      </form>

      <h3>My Events</h3>
      {events.length === 0 ? (
        <p>You have not created any events.</p>
      ) : (
        <ul className="profile-event-list">
          {events.map((event) => (
            <li key={event._id} className="profile-event-card">
              <h2>{event.title}</h2>
              <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Logout Button */}
      <Button text="Logout" onClick={handleLogout} className="profile-logout" />
    </div>
  );
}

export default Profile;