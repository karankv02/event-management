require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");



const app = express();
const server = http.createServer(app); // Create HTTP Server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (Change this for production)
    methods: ["GET", "POST"],
  },
});
app.set("io", io); 


// WebSocket connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes")(io);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// WebSocket Connection
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    console.log(`User joined event: ${eventId}`);
  });

  socket.on("updateEvent", (event) => {
    io.to(event._id).emit("eventUpdated", event);
    console.log("Event Updated:", event);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});
