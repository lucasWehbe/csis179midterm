import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import GeofenceService from '../../Services/GeofenceService';
import SosService from '../../Services/SOSService';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from 'socket.io-client';

mapboxgl.accessToken = 'pk.eyJ1IjoibHVjYXN3ZWhiZSIsImEiOiJjbTNnMDhkaGEwMTN1MnFyN2ltMGc1ejRiIn0.cOzwOqFY17zlxz1Bgf4BXQ';

const Map = () => {
    const [userLocation, setUserLocation] = useState(null);
    const [locationAccuracy, setLocationAccuracy] = useState(null);
    const [locationSource, setLocationSource] = useState('Initializing...');
    const [showSosModal, setShowSosModal] = useState(false);
    const [showGeofenceModal, setShowGeofenceModal] = useState(false);
    const [geofenceName, setGeofenceName] = useState('');
    const [activeGeofences, setActiveGeofences] = useState(new Set());
    const geofencesRef = useRef([]);
    const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const userMarkerRef = useRef(null);
    const gpsMarkerRef = useRef(null);
    const [lastGpsUpdate, setLastGpsUpdate] = useState(0);


    const [socket, setSocket] = useState(null);
    const [isBeingTracked, setIsBeingTracked] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    // Initialize map
    const initializeMap = useCallback(() => {
        if (!mapRef.current || mapInstanceRef.current) return;
    
        // Initialize the map centered on Lebanon (approximately Beirut coordinates)
        const map = new mapboxgl.Map({
            container: mapRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [35.5018, 33.8938], // Beirut coordinates
            zoom: 8 // Zoom level to show most of Lebanon
        });
    
        // Add navigation controls (bottom-right)
        map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    
        map.on('load', async () => {
            console.log('Map loaded');
    
            // Fetch and display geofences
            try {
                const response = await GeofenceService.getAll();
                const geofences = response.data.geofences;
                geofencesRef.current = geofences;
    
                geofences.forEach((geofence) => {
                    const geofenceCenter = [
                        parseFloat(geofence.geofence_longitude),
                        parseFloat(geofence.geofence_latitude)
                    ];
                    const radius = geofence.geofence_radius || 100;
    
                    // Add geofence as a GeoJSON source
                    map.addSource(`geofence-${geofence.geofence_id}`, {
                        type: 'geojson',
                        data: createGeoJSONCircle(geofenceCenter, radius)
                    });
    
                    // Add geofence fill layer
                    map.addLayer({
                        id: `geofence-${geofence.geofence_id}-fill`,
                        type: 'fill',
                        source: `geofence-${geofence.geofence_id}`,
                        paint: {
                            'fill-color': '#DC2626',
                            'fill-opacity': 0.1
                        }
                    });
    
                    // Add geofence border layer
                    map.addLayer({
                        id: `geofence-${geofence.geofence_id}-border`,
                        type: 'line',
                        source: `geofence-${geofence.geofence_id}`,
                        paint: {
                            'line-color': '#DC2626',
                            'line-width': 2,
                            'line-dasharray': [2, 2]
                        }
                    });
    
                    // Add geofence label
                    new mapboxgl.Marker({
                        element: createGeofenceLabel(geofence.geofence_name || 'Geofence')
                    })
                    .setLngLat(geofenceCenter)
                    .addTo(map);
                });
            } catch (error) {
                console.error('Error loading geofences:', error);
                toast.error('Failed to load geofences');
            }
        });
    
        // Listen for map clicks
        map.on('click', (event) => {
            const coords = event.lngLat;
            console.log('Coordinates clicked:', coords);
    
            // Add a marker at the clicked location
            const marker = new mapboxgl.Marker({
                color: '#FF5733'
            })
            .setLngLat([coords.lng, coords.lat])
            .addTo(map);
    
            // Remove marker after 5 seconds
            setTimeout(() => marker.remove(), 5000);
    
            // Display coordinates in a toast
            toast.info(`Coordinates: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`);
        });
    
        mapInstanceRef.current = map;
        return map;
    }, []);

    
    useEffect(() => {
        const newSocket = io('http://localhost:4000');
    
        newSocket.on('connect', () => {
            console.log('User connected to socket');
            setConnectionStatus('connected');
            const userId = JSON.parse(localStorage.getItem('user'))?.user_id;
            if (userId) {
                newSocket.emit('register', { userId, role: 'user' }); // Correctly register the user
            } else {
                console.warn('No userId found in localStorage');
            }
        });
    
        newSocket.on('disconnect', () => {
            console.log('User disconnected from socket');
            setConnectionStatus('Disconnected');
            setIsBeingTracked(false);
        });
    
        newSocket.on('tracking-status', (data) => {
            console.log('Tracking status:', data);
            setIsBeingTracked(data.isTracking);
            setConnectionStatus(data.isTracking ? 'Being Tracked' : 'Connected');
        });
    
        setSocket(newSocket);
    
        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        initializeMap();
    }, [initializeMap]);
    

    // Create a custom marker element with label
    const createCustomMarker = (label, color) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
        `;

        const pin = document.createElement('div');
        pin.style.cssText = `
            width: 24px;
            height: 24px;
            background-color: ${color};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            margin-bottom: 8px;
        `;

        const text = document.createElement('div');
        text.style.cssText = `
            background: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            transform: rotate(0deg);
        `;
        text.textContent = label;

        el.appendChild(pin);
        el.appendChild(text);
        return el;
    };

    // Create geofence label
    const createGeofenceLabel = (name) => {
        const el = document.createElement('div');
        el.className = 'geofence-label';
        el.style.cssText = `
            background: rgba(220, 38, 38, 0.9);
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
        `;
        el.textContent = name;
        return el;
    };

    // Create GeoJSON circle for geofence circle
    const createGeoJSONCircle = (center, radiusInMeters) => {
        const points = 64;
        const km = radiusInMeters / 1000;
        const ret = [];
        const distanceX = km / (111.320 * Math.cos(center[1] * Math.PI / 180));
        const distanceY = km / 110.574;

        let theta, x, y;
        for(let i = 0; i < points; i++) {
            theta = (i / points) * (2 * Math.PI);
            x = distanceX * Math.cos(theta);
            y = distanceY * Math.sin(theta);
            ret.push([center[0] + x, center[1] + y]);
        }
        ret.push(ret[0]);

        return {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates: [ret]
            }
        };
    };

    const calculateDistance = useCallback((point1, point2) => {
        const R = 6371e3;
        const lat1 = point1.lat * (Math.PI / 180);
        const lat2 = point2.lat * (Math.PI / 180);
        const deltaLat = (point2.lat - point1.lat) * (Math.PI / 180);
        const deltaLng = (point2.lng - point1.lng) * (Math.PI / 180);
    
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                 Math.cos(lat1) * Math.cos(lat2) *
                 Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
        return R * c;
    }, []);

    const checkGeofenceProximity = useCallback((location) => {
        const newActiveGeofences = new Set();
    
        geofencesRef.current.forEach((geofence) => {
            const geofenceCenter = {
                lat: parseFloat(geofence.geofence_latitude),
                lng: parseFloat(geofence.geofence_longitude),
            };
            const radius = geofence.geofence_radius || 100;
            const distance = calculateDistance(location, geofenceCenter);
    
            if (distance <= radius) {
                newActiveGeofences.add(geofence.geofence_id);
                
                if (!activeGeofences.has(geofence.geofence_id)) {
                    setGeofenceName(geofence.geofence_name || 'Unnamed Geofence');
                    setShowGeofenceModal(true);
                    toast.info(`Entered geofence: ${geofence.geofence_name}`);
                }
            } else if (activeGeofences.has(geofence.geofence_id)) {
                toast.info(`Exited geofence: ${geofence.geofence_name}`);
            }
        });
    
        setActiveGeofences(newActiveGeofences);
    }, [activeGeofences, calculateDistance]);

    // Update GPS location
    const updateGPSLocation = useCallback((location) => {
        const now = Date.now();
        const updateInterval = 1000; // 1 seconds
    
        if (now - lastGpsUpdate < updateInterval) {
            return; // Skip update if interval hasn't passed
        }
    
        setLastGpsUpdate(now);
    
        if (!mapInstanceRef.current) return;
    
        // Remove old GPS marker if it exists
        if (gpsMarkerRef.current) {
            gpsMarkerRef.current.remove();
        }
    
        // Add new GPS marker (green)
        const gpsMarker = new mapboxgl.Marker({
            color: '#10B981', // Green color
            scale: 0.8,
            element: createCustomMarker('GPS Location', '#10B981')
        })
        .setLngLat([location.lng, location.lat])
        .addTo(mapInstanceRef.current);
    
        gpsMarkerRef.current = gpsMarker;
    
        // Check geofence proximity with new location
        checkGeofenceProximity(location);
    
        setLocationSource('GPS Location Updated');

        if (isBeingTracked && socket?.connected) {
            socket.emit('location-update', {
                userId: userId,
                location: {
                    lat: location.lat,
                    lng: location.lng,
                    accuracy: location.accuracy
                }
            });
        }


    }, [checkGeofenceProximity, lastGpsUpdate, isBeingTracked, socket, userId]);
    

    const handleSos = async () => {
        setShowSosModal(false);
    
        // Check if GPS marker exists
        if (!gpsMarkerRef.current) {
            toast.error('Unable to get your GPS-based location for SOS');
            return;
        }
    
        // Get the GPS marker location
        const gpsMarkerLocation = gpsMarkerRef.current.getLngLat();
    
        console.log('Sending SOS with GPS-based location:', gpsMarkerLocation);
    
        try {
            
            await SosService.send({
                userId,
                coordinates: {
                    latitude: gpsMarkerLocation.lat,
                    longitude: gpsMarkerLocation.lng,
                },
            });
            toast.success('SOS message sent to all emergency contacts with your GPS location.');
        } catch (error) {
            console.error('Error sending SOS message:', error);
            toast.error('Failed to send SOS message.');
        }
    };
    

    // Get GPS location
    useEffect(() => {
        if ('geolocation' in navigator) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const gpsLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
    
                    console.log('Valid GPS Location:', gpsLocation);
                    updateGPSLocation(gpsLocation);
                    setLocationAccuracy(gpsLocation.accuracy);
                },
                (error) => {
                    console.warn('GPS error:', error);
                    setLocationSource('GPS not available');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 5000
                }
            );
    
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [updateGPSLocation]);



    const StatusIndicator = () => (
        <div className="position-absolute top-0 end-0 m-3 p-3 bg-white rounded shadow">
            <div className="d-flex flex-column gap-2">
                {/* Connection Status */}
                <div className="d-flex align-items-center">
                    <div className={`status-dot ${connectionStatus.toLowerCase().replace(' ', '-')}`} />
                    <span className="ms-2">{connectionStatus}</span>
                </div>
                
                {/* Tracking Status */}
                {isBeingTracked && (
                    <div className="alert alert-warning py-1 px-2 mb-0">
                        <small>
                            <i className="fas fa-broadcast-tower me-1"></i>
                            Your location is being tracked
                        </small>
                    </div>
                )}
            </div>
        </div>
    );
    
    

    return (
        <div className="position-relative">
            <div ref={mapRef} style={{ height: '500px' }} />
            <StatusIndicator />
            
            {/* Location Info Panel */}
            <div className="position-absolute top-0 start-0 m-3 p-3 bg-white rounded shadow">
                <h6 className="mb-2">Location Sources:</h6>
                <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center">
                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#10B981' }} className="me-2" />
                        <span>GPS Location (±{Math.round(locationAccuracy || 0)}m)</span>
                    </div>
                    <div className="d-flex align-items-center">
                        <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#DC2626' }} className="me-2" />
                        <span>Geofence Zones</span>
                    </div>
                    <small className="text-muted mt-1">{locationSource}</small>
                </div>
            </div>

            {/* SOS Button */}
            <div className="sos-container">
                <button
                    className="btn btn-danger btn-lg"
                    onClick={() => setShowSosModal(true)}
                    style={{ width: '200px', height: '60px', fontSize: '1.5rem' }}
                >
                    SOS
                </button>
            </div>

            {/* SOS Modal */}
            <Modal show={showSosModal} onHide={() => setShowSosModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>SOS Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to send an SOS message with your location to all emergency contacts?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSosModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleSos}>
                        Send SOS
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Geofence Alert Modal */}
            <Modal show={showGeofenceModal} onHide={() => setShowGeofenceModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Geofence Alert</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You have entered a geofenced area: <strong>{geofenceName}</strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowGeofenceModal(false)}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer 
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};
  
export default Map;