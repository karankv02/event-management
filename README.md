# 🎉 Event Management Platform

A full-stack **Event Management Platform** where users can create, join, and manage events in real-time. Built with **MERN Stack (MongoDB, Express, React, Node.js)** and **Socket.io** for real-time updates.

---

## 📌 Features
✔ **User Authentication (Login/Register)**  
✔ **Create, Update & Delete Events** *(Only the creator can modify their events)*  
✔ **RSVP System (Join Events & View Attendees)**  
✔ **Real-Time Updates using Socket.io**  
✔ **Filter Events (Joined, Upcoming, Past, Date-based)**  
✔ **Responsive UI with a Modern Dark Theme**  

---

## 🛠️ Technologies Used
| Frontend | Backend | Database |
|----------|---------|----------|
| React.js (Vite) | Node.js | MongoDB |
| Axios | Express.js | Mongoose |
| React Router | JWT Authentication | Socket.io |

---

## 🚀 Installation & Setup

### 1️⃣ **Clone the Repository**
```bash
git clone https://github.com/yourusername/event-management-platform.git
cd event-management-platform
```
### 2️⃣ **Backend Setup**
```bash
cd backend
npm install
nodemon server.js
```
- Runs on http://localhost:5000
- Uses MongoDB (Ensure MongoDB is running)

### 3️⃣ **Frontend Setup**

```bash
cd frontend
npm install
npm start
```
- Runs on http://localhost:3000
- Uses React.js with Vite

## 🔥 Usage Guide
### 1️⃣ Register & Login
- New users can sign up and will be automatically redirected to login.
- Once logged in, users can create and join events.
### 2️⃣ Creating an Event
- Click "Create Event", fill in details, and submit.
- The event will be instantly visible to all users.
### 3️⃣ Joining an Event
- Click "Join Event" to RSVP.
- Attendee count updates in real-time using Socket.io.
### 4️⃣ Filtering Events
- Filter by All, Joined, Upcoming, Past events.
- Search events by specific date.
### 5️⃣ Deleting Events
- Only the event creator can delete their event.

## 📩 Contact
- Karan Vakkalad: [Karan Vakkalad](https://www.linkedin.com/in/karan-vakkalad-34750b281/)
- GitHub: [Karan k v](https://github.com/karankv02)
- Email: karanvakkalad02@gmail.com