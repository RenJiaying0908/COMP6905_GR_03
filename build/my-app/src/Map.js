import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSkiing, faMountain, faStore, faHospital, faCoffee, faSchool } from '@fortawesome/free-solid-svg-icons'; 
import L from 'leaflet';
import { renderToString } from 'react-dom/server'; 
import './SkiResortMap.css'; 
import postData from './messenger';

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
  const [polylines, setPolylines] = useState({});
  const mapRef = useRef(null);
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

    const requestBody = {
      type: "find_facilities",
      data: {

      }
    }

    postData(requestBody, (error, data)=>{
        if(error)
        {
            console.error('Error fetching the route:', error);
            alert("Error: " + error.message);
        }else{

        }
    })

    const connectionInfo = connections.find(connection => connection.fromNode === 1 && connection.toNode === 2);
    
    if (connectionInfo) {
      const fromLocation = locations.find(location => location.id === connectionInfo.from)?.coordinates;
      const toLocation = locations.find(location => location.id === connectionInfo.to)?.coordinates;
      
      if (fromLocation && toLocation) {
        const routeCoordinates = [fromLocation, toLocation];
        displayRoute(routeCoordinates, 'red', startingLocation, destination);
      } else {
        console.log('One of the route coordinates not found.');
      }
    } else {
      console.log('Connection not found.');
    }
  };

    const changeConnectionColor = (from, to, newColor) => {
      const key = `${from}-${to}`;
      setConnectionColors(prevColors => ({
        ...prevColors,
        [key]: newColor 
      }));
    };

    const displayRoute = (routeCoordinates, color, fromId, toId) => {
      if(fromId != '' && toId != ''){
        changeConnectionColor(1, 2, 'red');
      }else{connections.forEach(connection => {
        changeConnectionColor(connection.fromNode, connection.toNode, connection.color);
      });
      return; 
    }
    };

  const [mapOptions] = useState({
    center: [51.35, -116.25], // Initial center
    zoom: 12, // Initial zoom level
    minZoom: 12, // Minimum allowed zoom level
    // maxZoom: 6, // Maximum allowed zoom level
    bounds: [[51.3, -116.3], [51.4, -116.2]], // Bounds of the visible area
  });

  const [locations, setLocations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [nodeMap, setNodeMap] = useState({});

  const [connectionColors, setConnectionColors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestBody = {
          type: "get_routes",
          data: {}
        }
        postData(requestBody, (error, data)=>{
          if(error)
          {
              console.error('Error fetching the route:', error);
              alert("Error: " + error.message);
          }else{
            console.log(data);
            const locationsDatas = data.results.routes_nodes;
            for(const node of locationsDatas)
            {
                nodeMap[node._id] = node;
            }
            const connectionsData = data.results.routes_slopes;
            setLocations(locationsDatas);
            setConnections(connectionsData);
            setNodeMap(nodeMap);
            for(const slope of connectionsData)
            {
                changeConnectionColor(slope.fromNode, slope.toNode, slope.color);
            }
          }
        })
        // const locationsResponse = await fetch('https://example.com/locations');
        // const locationsData = await locationsResponse.json();
        // setLocations(locationsData);
  
        // const connectionsResponse = await fetch('https://example.com/connections');
        // const connectionsData = await connectionsResponse.json();
        // setConnections(connectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="ski-resort-map-container">
      <div className="search-form">
        <input
          style={{ width: '80%' }}
          type="text"
          placeholder="Starting Location"
          value={startingLocation}
          onChange={handleStartingLocationChange}
        />
        <input
          style={{ width: '80%' }}
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={handleDestinationChange}
        />
        <select style={{ width: '85%' }} name="difficulty" value={preferences.difficulty} onChange={handlePreferencesChange}>
          <option value="Any">Difficulty: Any</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select style={{ width: '85%' }} name="duration" value={preferences.duration} onChange={handlePreferencesChange}>
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
    <MapContainer 
      center={mapOptions.center} 
      zoom={mapOptions.zoom} 
      minZoom={mapOptions.minZoom} 
      style={{ height: '500px', width: '100%' }} 
      maxBounds={mapOptions.bounds}
      whenCreated={mapInstance => { mapRef.current = mapInstance; }}
    >
      {showSkiMap ? (
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        ) : (
          <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
        )}
        {locations.map((location) => (
          <Marker key={location.id} position={location.location.coordinates} icon={createLeafletIcon(faSkiing)}> 
            <Popup>
              <strong>{location.name}</strong><br/>
            </Popup>
          </Marker>
        ))}
          {connections.map((connection, index) => (
            
          <Polyline key={`${connection.fromNode}-${connection.toNode}-${connectionColors[`${connection.fromNode}-${connection.toNode}`]}`} positions={[nodeMap[connection.fromNode].location.coordinates, nodeMap[connection.toNode].location.coordinates]} color={connectionColors[`${connection.fromNode}-${connection.toNode}`]} />
        ))}
      </MapContainer>
    </div>
  );
};

export default SkiResortMap;
