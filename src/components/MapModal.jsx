import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, message } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';

const MapModal = ({ isOpen, onClose, onLocationSelect }) => {
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);

    // Clear all markers function
    const clearAllMarkers = () => {
        markersRef.current.forEach(marker => {
            if (marker && marker.setMap) {
                marker.setMap(null);
            }
        });
        markersRef.current = [];
        setMarker(null);
    };

    useEffect(() => {
        if (isOpen) {
            if (!map) {
                initializeMap();
            } else {
                // Clear all existing markers
                clearAllMarkers();
                setSelectedLocation(null);

                // Reset map to center of India
                map.setCenter({ lat: 20.5937, lng: 78.9629 });
                map.setZoom(5);
            }
        }
    }, [isOpen, map]);

    const initializeMap = () => {
        // Initialize Google Maps
        const google = window.google;
        if (!google) {
            message.error('Google Maps not loaded');
            return;
        }

        // 1. Define the geographical bounds for India
        const INDIA_BOUNDS = {
            north: 37.0,
            south: 8.0,
            west: 68.0,
            east: 97.0,
        };


        const mapInstance = new google.maps.Map(mapRef.current, {
            center: { lat: 20.5937, lng: 78.9629 }, // Center of India
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            restriction: {
                latLngBounds: INDIA_BOUNDS,
                strictBounds: true, // Set to true to enforce the bounds
            },
        });

        setMap(mapInstance);

        // Add click listener to map
        mapInstance.addListener('click', (event) => {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();

            // Clear all existing markers first
            clearAllMarkers();

            // Add new marker
            const newMarker = new google.maps.Marker({
                position: { lat, lng },
                map: mapInstance,
                draggable: true,
            });

            // Add to markers array
            markersRef.current.push(newMarker);
            setMarker(newMarker);
            setSelectedLocation({ lat, lng });

            // Get address from coordinates
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    setSelectedLocation(prev => ({
                        ...prev,
                        address: results[0].formatted_address
                    }));
                }
            });
        });

        // Add marker drag listener
        mapInstance.addListener('dragend', () => {
            if (marker) {
                const position = marker.getPosition();
                const lat = position.lat();
                const lng = position.lng();

                setSelectedLocation(prev => ({
                    ...prev,
                    lat,
                    lng
                }));

                // Get address from new position
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        setSelectedLocation(prev => ({
                            ...prev,
                            address: results[0].formatted_address
                        }));
                    }
                });
            }
        });
    };

    const handleConfirmLocation = () => {
        if (selectedLocation) {
            onLocationSelect(selectedLocation);
            message.success('Location selected successfully!');
            // Clear all markers when closing
            clearAllMarkers();
            setSelectedLocation(null);
            onClose();
        } else {
            message.warning('Please select a location first');
        }
    };

    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    // Clear all existing markers first
                    clearAllMarkers();

                    // Add new marker
                    const newMarker = new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        draggable: true,
                    });

                    // Add to markers array
                    markersRef.current.push(newMarker);
                    setMarker(newMarker);
                    setSelectedLocation({ lat, lng });

                    // Center map on current location
                    map.setCenter({ lat, lng });
                    map.setZoom(15);

                    // Get address from coordinates
                    const geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            setSelectedLocation(prev => ({
                                ...prev,
                                address: results[0].formatted_address
                            }));
                        }
                    });

                    message.success('Current location set!');
                },
                () => {
                    message.error('Unable to get current location');
                }
            );
        } else {
            message.error('Geolocation is not supported by this browser');
        }
    };

    const handleCancel = () => {
        // Clear all markers when cancelling
        clearAllMarkers();
        setSelectedLocation(null);
        onClose();
    };

    return (
        <Modal
            title="Select Location"
            open={isOpen}
            onCancel={handleCancel}
            width={800}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button key="current" icon={<EnvironmentOutlined />} onClick={handleUseCurrentLocation}>
                    Use Current Location
                </Button>,
                <Button key="confirm" type="primary" onClick={handleConfirmLocation}>
                    Confirm Location
                </Button>
            ]}
        >
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '500px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px'
                }}
            />

            {selectedLocation && (
                <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                    <h4>Selected Location:</h4>
                    <p><strong>Latitude:</strong> {selectedLocation.lat}</p>
                    <p><strong>Longitude:</strong> {selectedLocation.lng}</p>
                    {selectedLocation.address && (
                        <p><strong>Address:</strong> {selectedLocation.address}</p>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default MapModal; 