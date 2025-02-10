const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Workshop", "Conference", "Meetup", "Webinar", "Other"],
    required: true,
  },
  maxAttendees: {
    type: Number,
    required: true,
    default: 100, // Default max attendees
  },
  imageUrl: {
    type: String, // URL of the event image
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Event", EventSchema);
