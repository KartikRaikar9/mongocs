# 🎉 EventSphere – Event Management System

## 📌 Overview

EventSphere is a full-stack web application that allows users to create, manage, and book events seamlessly. It provides a user-friendly dashboard with features like event creation, booking, RSVP tracking, and filtering.

---

## 🚀 Features

### 👤 User Features

* User Signup & Login (secure authentication)
* View all events in a dashboard
* Search and filter events by location
* Sort events by date
* RSVP to events (Going / Interested)
* Mark events as favorites ❤️

---

### 📅 Event Management

* Create new events with:

  * Title
  * Date
  * Location
  * Category
  * Description
  * Image (optional)
* Edit existing events
* Delete events

---

### 🎟️ Booking System

* Book seats for events
* Tracks:

  * Total seats
  * Seats left
* Prevents:

  * Booking past events
  * Overbooking (no seats left)

---

### 🛡️ Validation & Security

* Cannot create events in the past
* Cannot book past events
* Passwords hashed using bcrypt
* Backend validation ensures data integrity

---

## 🛠️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript (Vanilla JS)

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

---

## 📂 Project Structure

```
Event_Management/
│
├── server.js
├── public/
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── script.js
│   ├── auth.js
│   ├── style.css
│   └── auth.css
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone <your-repo-link>
cd Event_Management
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment

Create a `.env` file in the project root:

```
MONGO_URI=mongodb://127.0.0.1:27017/eventDB
```

### 4. Start MongoDB

Make sure MongoDB is running locally:

```
mongodb://127.0.0.1:27017/eventDB
```

### 5. Run the server

```
node server.js
```

### 6. Open in browser

```
http://localhost:5000
```

---

## 📊 Dashboard Features

* Displays:

  * Total events
  * Upcoming events
  * Unique locations
* Responsive UI with modern design
* Dark mode toggle 🌙

---

## ✨ Improvements Implemented

* Fixed login & dashboard connection
* Improved UI alignment and styling
* Added date validation for events
* Disabled invalid bookings
* Cleaned debug logs
* Enhanced user experience

---

## 📌 Future Enhancements

* User-specific booking history
* Admin dashboard
* Event categories filter
* Calendar view
* Email notifications

---

## 👩‍💻 Contributors

* Ramya
* Sanjana

---

## 📜 License

This project is for academic purposes.
