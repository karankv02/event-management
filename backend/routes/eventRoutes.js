const express = require("express");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const eventRoutes = (io) => {
  // Create an Event
  router.post("/", authMiddleware, async (req, res, next) => {
    try {
      const { title, description, date, startTime, endTime, location, category, maxAttendees, imageUrl } = req.body;

      if (!title || !date || !startTime || !endTime || !category)
        return res.status(400).json({ msg: "Title, Date, Start/End Time, and Category are required!" });

      const event = new Event({
        title,
        description,
        date,
        startTime,
        endTime,
        location,
        category,
        maxAttendees,
        imageUrl,
        createdBy: req.user.id,
      });

      await event.save();
      io.emit("newEvent", event); // ✅ Notify users about new event

      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  });

  return router;
};

// Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name");
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Get Events Created by a Specific User
router.get("/my-events", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Update an Event (Only the Creator Can Update)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    io.emit("eventUpdated", event);
    res.json(event);
  } catch (error) {
    console.error("Update Event Error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Delete an Event (Only the Creator Can Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.toString() !== req.user.id)
      return res.status(403).json({ msg: "Unauthorized" });

    await event.deleteOne();
    res.json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// RSVP to an Event
router.post("/:id/rsvp", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.attendees.includes(req.user.id)) {
      return res.status(400).json({ msg: "You have already joined this event" });
    }

    event.attendees.push(req.user.id);
    await event.save();

    // ✅ Notify all users in real-time about the updated event
    req.app.get("io").emit("eventUpdated", event);

    res.json({ msg: "You have successfully joined the event!", event });
  } catch (error) {
    console.error("RSVP Error:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});


// Get a Single Event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "name email") // ✅ Ensure event creator's details are included
      .populate("attendees", "name email");

    if (!event) return res.status(404).json({ msg: "Event not found" });

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Get Events Created by the Logged-in User
router.get("/my-events", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id });
    res.json(events);
  } catch (error) {
    console.error("Error fetching user events:", error.message);
    res.status(500).json({ msg: "Server Error" });
  }
});


module.exports = eventRoutes;
