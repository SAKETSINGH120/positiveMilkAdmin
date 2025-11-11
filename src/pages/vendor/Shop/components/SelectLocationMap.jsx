import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const center = {
    lat: 22.9734, // Default center (e.g., India)
    lng: 78.6569
};

function SelectLocationMap({ onSelect }) {
    const [map, setMap] = useState(null);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [address, setAddress] = useState('');
    const searchBoxRef = useRef(null);

    // Load Google Maps API script
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Replace with your actual API key
        libraries: ['places'], // Required for search functionality
    });

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

    // Handle map clicks to set marker and get coordinates
    const onMapClick = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setMarkerPosition({ lat, lng });
        onSelect({ lat, lng }); // Pass selected coordinates to parent component
    }, [onSelect]);

    // Handle search input change
    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    // Handle search submission
    const handleSearch = useCallback(() => {
        if (map && searchBoxRef.current) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    const lat = location.lat();
                    const lng = location.lng();
                    setMarkerPosition({ lat, lng });
                    onSelect({ lat, lng });
                    map.panTo({ lat, lng }); // Pan map to the searched location
                    map.setZoom(15); // Adjust zoom level for searched location
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }, [map, address, onSelect]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Search for a location"
                    value={address}
                    onChange={handleAddressChange}
                    ref={searchBoxRef}
                    style={{ width: 'calc(100% - 70px)', padding: '8px', marginRight: '5px' }}
                />
                <button onClick={handleSearch} style={{ padding: '8px 12px' }}>Search</button>
            </div>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={5}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={onMapClick}
            >
                {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
            hello
        </div>
    );
}

export default SelectLocationMap;