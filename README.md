# Geofencing Web App

## Overview
This project is a **Geofencing Web Application** built using **Node.js** and **React.js**. The app tracks the user's location in real-time using the **GPS Watch Position API**. When the user enters or exits predefined geofences, an alert is triggered. Additionally, the app allows the user to send an **SOS alert** to their predefined emergency contacts, delivering their current location via WhatsApp, integrated with a **Google Maps link**.

---

## Features
1. **Real-Time Geolocation Tracking**:
   - Tracks the user's location in real-time using the `watchPosition` API.
   - Sends alerts when the user enters or exits predefined geofences.

2. **SOS Alert**:
   - Allows users to send an SOS alert to emergency contacts.
   - Sends a WhatsApp message via the WhatsApp API, including the user's current location and a Google Maps link.

3. **User Authentication**:
   - Secure login and registration system.
   - Profile management for updating user information.

4. **Emergency Contacts Management**:
   - Add, edit, and delete emergency contacts.

5. **Interactive Map**:
   - Powered by **Mapbox API** for displaying geofences and real-time location tracking.
   - Includes interactive buttons for geofence management and location updates.

6. **Responsive Frontend**:
   - Built using **React.js**, **Bootstrap**, and custom CSS for a professional, user-friendly interface.

7. **Scalable Backend**:
   - Developed with **Node.js** and **Sequelize** for managing the database.
   - Supports user data, geofence definitions, and emergency contact management.

---

## Technologies Used

### Frontend
- **React.js**
- **Bootstrap** for responsive UI
- **CSS** for custom styling
- **Mapbox API** for map functionalities

### Backend
- **Node.js** for server-side logic
- **Sequelize** ORM for database interaction
- **PostgreSQL** as the database

### APIs
- **GPS Watch Position API** for real-time geolocation tracking
- **WhatsApp API** for sending SOS alerts
---

## Setup Instructions

### Prerequisites
- **Node.js** and **npm** installed
- **PostgreSQL** database setup
- API keys for **Mapbox** and **WhatsApp API**

## Usage
**User Registration:**
Users can sign up and log in to access the app.

**Home Page:**
Displays a real-time map with geofences.
Tracks the user’s location and triggers alerts upon geofence entry/exit.

**SOS Alert:**
Click the SOS button to send an emergency alert with location details to all predefined contacts via WhatsApp.

**Manage Profile:**
Users can update their personal details and preferences.

**Emergency Contacts:**
Add, edit, or delete emergency contacts.