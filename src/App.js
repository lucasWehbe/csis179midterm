import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Map from './components/Map/Map';
import Profile from './components/Profile/Profile';
import EmergencyContacts from './components/Contacts/EmergencyContacts';
import AdminPanel from './components/AdminPanel/AdminPanel'; 

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // State to track user role
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Fetch the token from localStorage
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token to extract user info
        setIsAuthenticated(true);
        setUserRole(decodedToken.role); // Set the user's role from the token
      } catch (error) {
        console.error("Invalid token", error);
        setIsAuthenticated(false);
        setUserRole(null);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserRole(decodedToken.role); // Update the role after login
    }
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null); // Clear role on logout
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/");
  };

  return (
    <div>
      {isAuthenticated && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/map">Geofence APP</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`${isNavCollapsed ? "collapse" : ""} navbar-collapse`}
            id="navbarNav"
          >
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/map">Map</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/emergency-contacts">Emergency Contacts</Link>
              </li>
              {userRole === 'admin' && ( // Conditional rendering for admin
                <li className="nav-item">
                  <Link className="nav-link" to="/admin-panel">Admin Panel</Link>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={openLogoutModal}>Logout</button>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/map" element={<Map />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
      </Routes>

      <Modal show={showLogoutModal} onHide={closeLogoutModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to log out?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogoutModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
