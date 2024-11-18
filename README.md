# Geolocation-Based Map with Geofencing and SOS Feature

This project is a geolocation-based web application that uses **Mapbox** and **React** to track a user's location, display geofences, and provide an SOS feature for emergencies. It integrates IP-based and GPS-based location tracking, geofence monitoring, and real-time updates.

## Features

- **Map Integration**: Displays a map using Mapbox.
- **Geofence Management**: Fetches and displays geofences from a backend service.
- **Real-Time Location Updates**:
  - Tracks user location via IP (initially) and GPS (continuously).
  - Updates the map with the user's current position.
- **SOS Feature**: Allows users to send their GPS location to emergency contacts.
- **Geofence Alerts**: Notifies users when entering or exiting geofences.
- **Customizable Map**:
  - Dynamic markers for user location and geofences.
  - Zoom and pan controls.

## Technologies Used

- **Frontend**:
  - React.js
  - Mapbox GL JS
  - Bootstrap (for modals and buttons)
  - React Toastify (for notifications)

- **Backend Services**:
  - Geofence Service: Fetches geofences.
  - SOS Service: Sends SOS messages with location data.

- **APIs**:
  - **Mapbox**: For map visualization.
  - **IP API**: For retrieving IP-based location.
  - **Browser Geolocation API**: For real-time GPS tracking.


### Prerequisites
- Node.js and npm installed.
- Mapbox API key.
- Backend services 

