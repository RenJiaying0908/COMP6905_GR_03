import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing, faMountain, faStore, faHospital, faCoffee, faSchool } from '@fortawesome/free-solid-svg-icons'; 
import L from 'leaflet';
import { renderToString } from 'react-dom/server'; 
import './SkiResortMap.css'; 

library.add(faSkiing, faMountain, faStore, faHospital, faCoffee, faSchool);

const createLeafletIcon = (icon) => {
  return L.divIcon({
    html: renderToString(<FontAwesomeIcon icon={icon} />), 
    className: 'leaflet-div-icon', 
    iconSize: [24, 24], 
  });
};

const SkiResortMap = () => {
  const [startingLocation, setStartingLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [preferences, setPreferences] = useState({
    difficulty: 'Any',
    duration: 'Any',
  });
  const [showSkiMap, setShowSkiMap] = useState(true); 

  const handleStartingLocationChange = (event) => {
    setStartingLocation(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handlePreferencesChange = (event) => {
    const { name, value } = event.target;
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [name]: value,
    }));
  };

  const handleToggleMap = () => {
    setShowSkiMap(!showSkiMap);
  };

  const handleSearch = () => {
    console.log('Searching for routes with the following parameters:', {
      startingLocation,
      destination,
      preferences,
    });
  };

  const locations = [
    { id: 1, name: 'Base Lodge', status: 'open', coordinates: [51.35, -116.25], icon: faMountain },
    { id: 2, name: 'Mountain Peak', status: 'open', coordinates: [51.38, -116.22], icon: faMountain },
    { id: 3, name: 'Ski Lift A', status: 'closed', coordinates: [51.36, -116.27], icon: faSkiing },
    { id: 4, name: 'Ski Lift B', status: 'closed', coordinates: [51.34, -116.28], icon: faSkiing },
    { id: 5, name: 'Ski Rental Shop', status: 'open', coordinates: [51.35, -116.27], icon: faStore },
    { id: 6, name: 'Snowboard Terrain Park', status: 'closed', coordinates: [51.37, -116.24], icon: faSkiing },
    { id: 7, name: 'Chalet Restaurant', status: 'closed', coordinates: [51.34, -116.25], icon: faCoffee },
    { id: 8, name: 'Ski School', status:'open', coordinates: [51.36, -116.24], icon: faSchool },
    { id: 9, name: 'First Aid Station', status:'open', coordinates: [51.36, -116.27], icon: faHospital },
  ];

  const connections = [
    { from: 1, to: 2, color: 'blue' },
    { from: 1, to: 3, color: 'red' },
    { from: 2, to: 4, color: 'black' },
    { from: 1, to: 5, color: 'red' },
    { from: 3, to: 6, color: 'blue' },
    { from: 2, to: 7, color: 'black' },
    { from: 3, to: 8, color: 'blue' },
    { from: 5, to: 9, color: 'red' },

  ];

  const [mapOptions] = useState({
    center: [51.35, -116.25], // Initial center
    zoom: 12, // Initial zoom level
    minZoom: 12, // Minimum allowed zoom level
    // maxZoom: 6, // Maximum allowed zoom level
    bounds: [[51.3, -116.3], [51.4, -116.2]], // Bounds of the visible area
  });

  return (
    <div className="ski-resort-map-container">
      <div className="search-form">
        <input
          type="text"
          placeholder="Starting Location"
          value={startingLocation}
          onChange={handleStartingLocationChange}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={handleDestinationChange}
        />
        <select name="difficulty" value={preferences.difficulty} onChange={handlePreferencesChange}>
          <option value="Any">Difficulty: Any</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select name="duration" value={preferences.duration} onChange={handlePreferencesChange}>
          <option value="Any">Duration: Any</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className='toggle-map'>
      <hr className='horizontal-line'></hr>
      <button onClick={handleToggleMap} className='toggle-map-button'>
        {showSkiMap ? 'Show Amenities Map' : 'Show Ski Map'}
      </button>
    </div>
      <MapContainer center={mapOptions.center} zoom={mapOptions.zoom} minZoom={mapOptions.minZoom} style={{ height: '500px', width: '100%' }} maxBounds={mapOptions.bounds}>
        {showSkiMap ? (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
        )}
        {locations.map((location) => (
          <Marker key={location.id} position={location.coordinates} icon={createLeafletIcon(location.icon)}> 
            <Popup>
              <strong>{location.name}</strong><br/>
            </Popup>
          </Marker>
        ))}

                {connections.map((connection, index) => (
          <Polyline key={index} positions={[locations[connection.from - 1].coordinates, locations[connection.to - 1].coordinates]} color={connection.color} />
        ))}
      </MapContainer>
    </div>
  );
};

export default SkiResortMap;