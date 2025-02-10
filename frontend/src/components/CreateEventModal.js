import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateEventModal.module.css"; 

function CreateEventModal({ isOpen, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "Workshop",
    maxAttendees: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // ✅ Disable scrolling when modal opens
    } else {
      document.body.style.overflow = "auto"; // ✅ Enable scrolling when modal closes
    }

    return () => {
      document.body.style.overflow = "auto"; // ✅ Ensure scrolling is re-enabled on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/events",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onEventCreated(res.data); // ✅ Update event list in Events.js
      onClose(); // ✅ Close modal
    } catch (error) {
      alert(error.response?.data?.msg || "Failed to create event");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>Create Event</h2>
        <form className={styles.eventForm} onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          
          {/* New Fields */}
          <div className={styles.timeFields}>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
          </div>

          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="Workshop">Workshop</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
            <option value="Seminar">Seminar</option>
          </select>

          <input type="number" name="maxAttendees" placeholder="Max Attendees" value={formData.maxAttendees} onChange={handleChange} required />

          <input type="url" name="imageUrl" placeholder="Event Image URL (optional)" value={formData.imageUrl} onChange={handleChange} />

          <button type="submit" className={styles.eventbtn}>Create Event</button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventModal;
