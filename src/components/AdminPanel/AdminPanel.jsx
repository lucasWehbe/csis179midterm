import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Card, Form } from 'react-bootstrap';
import GeofenceService from '../../Services/GeofenceService';
import UserService from '../../Services/UserServices';
import './AdminPanel.css'
import { io } from 'socket.io-client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXN3ZWhiZSIsImEiOiJjbTNnMDhkaGEwMTN1MnFyN2ltMGc1ejRiIn0.cOzwOqFY17zlxz1Bgf4BXQ';


const AdminPanel = () => {
  // State for geofence and user management
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [geofences, setGeofences] = useState([]);
  const [users, setUsers] = useState([]);

  // Selected geofence and user
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Geofence Form States
  const [geofenceName, setGeofenceName] = useState('');
  const [geofenceLatitude, setGeofenceLatitude] = useState('');
  const [geofenceLongitude, setGeofenceLongitude] = useState('');
  const [geofenceRadius, setGeofenceRadius] = useState('');

  // User Form States
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState('');


  const [trackedUsers, setTrackedUsers] = useState(new Set());
  const [userLocations, setUserLocations] = useState({});
  const [socket, setSocket] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))?.user_id;

  // Map references
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({}); // Store markers for each user

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [35.6089856, 33.9345408], // Lebanon coordinates
      zoom: 12
    });

    map.current.on('load', () => {
      console.log('Map loaded');
      setMapLoaded(true);
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);


  const createMarkerElement = (userId) => {
    const el = document.createElement('div');
    el.className = 'custom-marker';
    el.innerHTML = `
      <div class="marker-content">
          <div class="marker-pin"></div>
          <div class="marker-label">User ${userId}</div>
      </div>
  `;
    return el;
  };


  // Update markers when user locations change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    Object.entries(userLocations).forEach(([userId, location]) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([location.lng, location.lat])
        .addTo(map.current);

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <strong>User ${userId}</strong><br/>
            Last Update: ${new Date(location.lastUpdate).toLocaleTimeString()}
        `);
      marker.setPopup(popup);
      markers.current[userId] = marker;
    });
  }, [userLocations]);


  // Socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:4000');

    newSocket.on('connect', () => {
      console.log('Admin connected to socket');
      newSocket.emit('register', { role: 'admin' });
    });

    newSocket.on('location-update', (data) => {
      console.log('Location update received:', data); // Log incoming data
      if (data.location?.lat && data.location?.lng) {
        setUserLocations((prev) => ({
          ...prev,
          [data.userId]: { ...data.location, lastUpdate: new Date() },
        }));
      } else {
        console.warn('Invalid location data:', data);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });


    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserService.getAll();
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    // Listen for the list of tracked users
    socket.on('current-tracked-users', (trackedUserIds) => {
      console.log('Received tracked users:', trackedUserIds);
      setTrackedUsers(new Set(trackedUserIds)); // Update state
    });

    // Cleanup listener on unmount
    return () => {
      socket.off('current-tracked-users');
    };
  }, [socket]);

  useEffect(() => {
    console.log('Tracked Users State:', trackedUsers);
}, [trackedUsers]);


  // Track User
  const handleTrackUser = async (targetUserId) => {
    if (!socket) return;
  
    // Check if the user is already tracked
    const isCurrentlyTracked = trackedUsers.has(targetUserId);
  
    try {
      if (isCurrentlyTracked) {
        // Stop tracking the user
        socket.emit('stop-tracking', { targetUserId });
  
        // Remove the marker and update state
        if (markers.current[targetUserId]) {
          markers.current[targetUserId].remove();
          delete markers.current[targetUserId];
        }
  
        setTrackedUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(targetUserId);
          return newSet;
        });
  
        setUserLocations((prev) => {
          const updatedLocations = { ...prev };
          delete updatedLocations[targetUserId];
          return updatedLocations;
        });
      } else {
        // Start tracking the user
        socket.emit('start-tracking', { targetUserId });
  
        setTrackedUsers((prev) => new Set(prev).add(targetUserId));
      }
    } catch (error) {
      console.error(`Error ${isCurrentlyTracked ? 'stopping' : 'starting'} tracking:`, error);
    }
  };
  


  // Fetch data
  const fetchGeofences = async () => {
    try {
      const response = await GeofenceService.getAll();
      setGeofences(response.data.geofences);
    } catch (error) {
      console.error('Error fetching geofences:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await UserService.getAll();
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Delete functions
  const handleDeleteGeofence = async (id) => {
    try {
      await GeofenceService.remove(id);
      setGeofences(geofences.filter((geofence) => geofence.geofence_id !== id));
    } catch (error) {
      console.error('Error deleting geofence:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await UserService.remove(id);
      setUsers(users.filter((user) => user.user_id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Modal toggles
  const handleGeofenceModal = () => {
    if (!showGeofenceModal) {
      clearGeofenceForm(); // Reset form on open
    }
    setShowGeofenceModal(!showGeofenceModal);
  };

  const handleOpenCreateGeofence = () => {
    setSelectedGeofence(null); // Clear any selected geofence
    handleAddGeofence();
    setShowGeofenceModal(true); // Open the modal
  };


  const handleUserModal = () => {
    if (!showUserModal) {
      clearUserForm(); // Reset form on open
    }
    setShowUserModal(!showUserModal);
  };

  // Edit handlers
  const handleEditGeofence = (geofence) => {
    setSelectedGeofence(geofence);
    setGeofenceName(geofence.geofence_name);
    setGeofenceLatitude(geofence.geofence_latitude);
    setGeofenceLongitude(geofence.geofence_longitude);
    setGeofenceRadius(geofence.geofence_radius);
    setShowGeofenceModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setUserName(user.user_username);
    setUserEmail(user.user_email);
    setUserPhone(user.user_phone);
    setUserRole(user.user_role);
    setShowUserModal(true);
  };

  const handleAddGeofence = () => {
    setGeofenceName('');
    setGeofenceLatitude('');
    setGeofenceLongitude('');
    setGeofenceRadius('');
    setShowGeofenceModal(true);
  };


  // Form submit handlers
  const handleGeofenceFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const geofenceData = {
        name: geofenceName,
        latitude: geofenceLatitude,
        longitude: geofenceLongitude,
        radius: geofenceRadius,
      };

      if (selectedGeofence) {
        await GeofenceService.update(selectedGeofence.geofence_id, geofenceData);
      }

      fetchGeofences();
      handleGeofenceModal();
    } catch (error) {
      console.error('Error saving geofence:', error);
    }
  };

  const handleCreateGeofence = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.user_id;
    try {
      const newGeofence = {
        user_id: userId,
        name: geofenceName,
        latitude: geofenceLatitude,
        longitude: geofenceLongitude,
        radius: geofenceRadius,
      };

      await GeofenceService.create(newGeofence);
      fetchGeofences(); // Refresh the geofences list
      setShowGeofenceModal(false); // Close the modal
      setGeofenceName(''); // Clear form fields
      setGeofenceLatitude('');
      setGeofenceLongitude('');
      setGeofenceRadius('');
    } catch (error) {
      console.error('Error creating geofence:', error);
    }
  };


  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        user_username: userName,
        user_email: userEmail,
        user_phone: userPhone,
        user_role: userRole,
      };

      if (selectedUser) {
        await UserService.update(selectedUser.user_id, payload);
      } else {
        await UserService.create(payload);
      }

      fetchUsers();
      handleUserModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Clear form data
  const clearGeofenceForm = () => {
    setGeofenceName('');
    setGeofenceLatitude('');
    setGeofenceLongitude('');
    setGeofenceRadius('');
    setSelectedGeofence(null);
  };

  const clearUserForm = () => {
    setUserName('');
    setUserEmail('');
    setUserPhone('');
    setUserRole('');
    setSelectedUser(null);
  };

  const renderUserActions = (user) => {
    const canBeTracked = trackedUsers.has(String(user.user_id));
    const isActivelyTracked = Boolean(userLocations[user.user_id]); // User is actively tracked if we have their location
  
    return (
      <div className="d-flex flex-column">
        <div className="action-buttons mb-2">
          <Button
            variant="outline-warning"
            className="admin-btn me-2"
            onClick={() => handleEditUser(user)}
          >
            <i className="fas fa-edit me-1"></i>Edit
          </Button>
          <Button
            variant="outline-danger"
            className="admin-btn me-2"
            onClick={() => handleDeleteUser(user.user_id)}
          >
            <i className="fas fa-trash-alt me-1"></i>Delete
          </Button>
          <Button
            variant={isActivelyTracked ? "success" : "primary"}
            className="admin-btn"
            onClick={() => handleTrackUser(user.user_id)}
            disabled={!canBeTracked}
            title={!canBeTracked ? "User cannot be tracked at this time" : ""}
          >
            <i className={`fas ${isActivelyTracked ? "fa-broadcast-tower" : "fa-location-arrow"} me-1`}></i>
            {isActivelyTracked ? "Stop Tracking" : "Track"}
          </Button>
        </div>
  
        {/* Location Information */}
        {userLocations[user.user_id] && (
          <div className="location-info bg-light p-2 rounded mt-2">
            <small>
              <div>Last Known Location:</div>
              <div>Lat: {userLocations[user.user_id].lat.toFixed(6)}</div>
              <div>Lng: {userLocations[user.user_id].lng.toFixed(6)}</div>
              <div className="text-muted">
                Updated: {new Date(userLocations[user.user_id].lastUpdate).toLocaleTimeString()}
              </div>
            </small>
          </div>
        )}
      </div>
    );
  };
  
  



  useEffect(() => {
    fetchGeofences();
    fetchUsers();
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-page-container">
        <div className="admin-header">
          <h1 className="admin-header-text">Admin Dashboard</h1>
        </div>

        <div className="container">
          {/* Geofence Management Section */}
          <Card className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <i className="fas fa-map-marker-alt me-2"></i>
                Geofence Management
              </h2>
            </div>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="admin-table geofence-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Radius (m)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {geofences.length > 0 ? (
                      geofences.map((geofence) => (
                        <tr key={geofence.geofence_id}>
                          <td>{geofence.geofence_name}</td>
                          <td>{geofence.geofence_latitude}</td>
                          <td>{geofence.geofence_longitude}</td>
                          <td>{geofence.geofence_radius}</td>
                          <td>
                            <div className="action-buttons">
                              <Button
                                variant="outline-warning"
                                className="admin-btn"
                                onClick={() => handleEditGeofence(geofence)}
                              >
                                <i className="fas fa-edit me-1"></i>Edit
                              </Button>
                              <Button
                                variant="outline-danger"
                                className="admin-btn"
                                onClick={() => handleDeleteGeofence(geofence.geofence_id)}
                              >
                                <i className="fas fa-trash-alt me-1"></i>Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-3">No Geofences Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="add-button-container">
                <Button
                  variant="primary"
                  className="admin-btn"
                  onClick={handleOpenCreateGeofence}
                >
                  <i className="fas fa-plus me-2"></i>Add New Geofence
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* User Management Section */}
          <Card className="admin-card">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <i className="fas fa-users me-2"></i>
                User Management
              </h2>
            </div>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <table className="admin-table user-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.user_id}>
                          <td>{user.user_username}</td>
                          <td>{user.user_email}</td>
                          <td>{user.user_phone}</td>
                          <td>
                            <span className={`role-badge role-badge-${user.user_role}`}>
                              {user.user_role}
                            </span>
                          </td>
                          <td>{renderUserActions(user)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-3">No Users Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Geofence Modal */}
        <Modal show={showGeofenceModal} onHide={() => {
          setShowGeofenceModal(false);
          clearGeofenceForm();
        }} centered className="admin-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedGeofence ? 'Edit Geofence' : 'Add New Geofence'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={selectedGeofence ? handleGeofenceFormSubmit : handleCreateGeofence}>
              <Form.Group className="mb-3">
                <Form.Label>Geofence Name</Form.Label>
                <Form.Control
                  type="text"
                  value={geofenceName}
                  onChange={(e) => setGeofenceName(e.target.value)}
                  placeholder="Enter geofence name"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={geofenceLatitude}
                  onChange={(e) => setGeofenceLatitude(e.target.value)}
                  placeholder="Enter latitude"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={geofenceLongitude}
                  onChange={(e) => setGeofenceLongitude(e.target.value)}
                  placeholder="Enter longitude"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Radius (meters)</Form.Label>
                <Form.Control
                  type="number"
                  value={geofenceRadius}
                  onChange={(e) => setGeofenceRadius(e.target.value)}
                  placeholder="Enter radius"
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowGeofenceModal(false);
                    clearGeofenceForm();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {selectedGeofence ? 'Update' : 'Create'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Fixed User Modal */}
        <Modal show={showUserModal} onHide={() => {
          setShowUserModal(false);
          clearUserForm();
        }} centered className="admin-modal">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedUser ? 'Edit User' : 'Add New User'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleUserFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  required
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Form.Select>
              </Form.Group>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowUserModal(false);
                    clearUserForm();
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {selectedUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>


        {/* Map Section */}
        <Card className="admin-card mt-4">
          <div className="admin-card-header">
            <h2 className="admin-card-title">
              <i className="fas fa-map-marker-alt me-2"></i>Live Tracking Map
            </h2>
          </div>
          <Card.Body>
            <div ref={mapContainer} className="admin-map" />
          </Card.Body>
        </Card>

      </div>
    </div>
  );
};

export default AdminPanel;