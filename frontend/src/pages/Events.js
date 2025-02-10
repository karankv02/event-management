import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";
import "./Events.css"; 
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import CreateEventModal from "../components/CreateEventModal";

const socket = io("http://localhost:5000");

function Events() {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "", location: "" });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.id : null; 
  // Fetch events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
        setFilteredEvents(res.data); // Initialize filteredEvents with all events
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();

    // Listen for real-time updates
    socket.on("newEvent", (event) => {
      setEvents((prevEvents) => [...prevEvents, event]);
    },[]);

    socket.on("eventUpdated", (updatedEvent) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event))
      );
    });

    return () => {
      socket.off("newEvent");
      socket.off("eventUpdated");
    };
  }, []);

  const handleEventCreated = (newEvent) => {
    setEvents([newEvent, ...events]); // ✅ Add new event to the list
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:5000/api/events", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewEvent({ title: "", description: "", date: "", location: "" });
    } catch (error) {
      alert("Failed to create event");
    }
  };

  // Function to filter events
  useEffect(() => {
    console.log("Applying filter:", filter);
    console.log("Selected Date:", selectedDate);
    console.log("All Events:", events);
    let updatedEvents = [...events];

    if (filter === "joined") {
      updatedEvents = updatedEvents.filter((event) => event.attendees.includes(userId)); //  Correct check for joined events
    } else if (filter === "upcoming") {
      updatedEvents = updatedEvents.filter((event) => new Date(event.date) > new Date());
    } else if (filter === "past") {
      updatedEvents = updatedEvents.filter((event) => new Date(event.date) < new Date());
    }

    if (selectedDate) {
      updatedEvents = updatedEvents.filter(
        (event) => new Date(event.date).toISOString().split("T")[0] === selectedDate
      );
    }
    console.log("Filtered Events:", updatedEvents);
    setFilteredEvents(updatedEvents);
  }, [filter, selectedDate, events, userId]);

  // RSVP to an Event
  const handleRSVP = async (eventId) => {
    const token = localStorage.getItem("token"); //  Move token inside the function
    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/rsvp`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
            // Update UI after RSVP
            setEvents((prevEvents) =>
              prevEvents.map((event) =>
                event._id === eventId
                  ? { ...event, attendees: [...event.attendees, userId] } // Simulating new attendee
                  : event
              )
            );
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  

  return (
    <div>

    <div className="container">
      <h1>Events</h1>
      <button className="event-btn" onClick={() => setShowEventModal(true)}>Create Event</button>
      

      {/* Filter Options */}
      <div className="filter-container">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("joined")} className={filter === "joined" ? "active" : ""}>Joined</button>
        <button onClick={() => setFilter("upcoming")} className={filter === "upcoming" ? "active" : ""}>Upcoming</button>
        <button onClick={() => setFilter("past")} className={filter === "past" ? "active" : ""}>Past</button>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      {/* Event List */}
      <ul className="event-list">
        {filteredEvents.length === 0 ? (
          <p>No events found.</p>
        ) : (
          filteredEvents.map((event) => (
            <li key={event._id} className="event-card">
              <h2>{event.title}</h2>
              <p ><strong>Created By:</strong> {event.createdBy?.name || "Unknown"}</p>
              <p><strong>Date:</strong> {new Date(event.date).toDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Attendees:</strong> {event.attendees.length} {/* ✅ Real-time count */}</p>
              <Link to={`/events/${event._id}`} className="button">View Details</Link>
              {!event.attendees.includes(userId) && (
                <button onClick={() => handleRSVP(event._id)} className="button">Join Event</button>
              )}
            </li>
          ))
        )}
      </ul>
       {/* Create Event Modal */}
      <CreateEventModal isOpen={showEventModal} onClose={() => setShowEventModal(false)} onEventCreated={handleEventCreated} /> 
    </div>
    </div>
  );
}

export default Events;
