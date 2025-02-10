import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EventDetails.module.css";

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get logged-in user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user?._id);

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRSVP = async (eventId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/rsvp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update UI after RSVP
      setEvent((prevEvent) => ({
        ...prevEvent,
        attendees: [...prevEvent.attendees, "newUser"], // Simulating new attendee
      }));
    } catch (error) {
      alert(error.response?.data?.msg || "Error joining event");
    }
  };


  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event deleted successfully!");
      navigate("/events"); // Redirect to events page
    } catch (error) {
      alert("Error deleting event");
    }
  };

  const handleUpdate = () => {
    navigate(`/edit-event/${id}`); // Redirect to event edit page (you'll need to create this)
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className={styles.eventDetailsContainer}>
      {event.imageUrl && (
        <img src={event.imageUrl} alt="Event" className={styles.eventImage} />
      )}
      <h2 className={styles.eventDetailsTitle}>{event.title}</h2>
      <p className={styles.eventDetailsInfo}>
        <strong>Created By:</strong> {event.createdBy?.name || "Unknown"}
      </p>
      
      <p className={styles.eventDetailsInfo}><strong>Category:</strong> {event.category}</p>
      <p className={styles.eventDetailsInfo}><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
      <p className={styles.eventDetailsInfo}><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
      <p className={styles.eventDetailsInfo}><strong>Location:</strong> {event.location}</p>
      <p className={styles.eventDetailsDescription}><strong>Description:</strong> {event.description}</p>
      <p className={styles.eventDetailsAttendees}><strong>Attendees:</strong> {event.attendees.length} / {event.maxAttendees}</p>
      <button onClick={() => handleRSVP(event._id)} className={styles.eventButton}>Join Event</button>

      {/* Show Delete and Update Buttons Only for the Creator */}
      {userId === event.createdBy?._id && (
        <div className={styles.creatorActions}>
          <button onClick={handleUpdate} className={styles.updateButton}>Edit Event</button>
          <button onClick={handleDelete} className={styles.deleteButton}>Delete Event</button>
        </div>
      )}
    </div>
  );
}

export default EventDetails;
