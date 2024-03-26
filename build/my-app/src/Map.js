import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ImageOverlay,
  useMapEvent,
} from "react-leaflet";
import { useMap, useMapEvents } from "react-leaflet/hooks";
import "leaflet/dist/leaflet.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSkiing,
  faMountain,
  faStore,
  faHospital,
  faCoffee,
  faSchool,
  faMapPin,
  faMapMarker,
  faLocationArrow,
} from "@fortawesome/free-solid-svg-icons";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import "./SkiResortMap.css";
import postData from "./messenger";

library.add(
  faSkiing,
  faMountain,
  faStore,
  faHospital,
  faCoffee,
  faSchool,
  faMapPin,
  faMapMarker,
  faLocationArrow
);

const createLeafletIcon = (icon) => {
  return L.divIcon({
    html: renderToString(<FontAwesomeIcon icon={icon} />),
    className: "leaflet-div-icon",
    iconSize: [24, 24],
  });
};

const createLeafletMarker = (icon, color) => {
  return L.divIcon({
    html: renderToString(
      <FontAwesomeIcon
        icon={icon}
        size="3x"
        style={{
          backgroundColor: "transparent",
          opacity: 0.8,
          fontSize: "32px",
          color: color,
        }}
      />
    ),
    className: "leaflet-div-icon",
    iconSize: [24, 24],
  });
};

const SkiResortMap = () => {
  const mapRef = useRef(null);
  const [startingLocation, setStartingLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [preferences, setPreferences] = useState({
    difficulty: "Any",
    duration: "Any",
  });
  const [showSkiMap, setShowSkiMap] = useState(true);
  const [polylines, setPolylines] = useState({});

  const [locations, setLocations] = useState([]);
  const [connections, setConnections] = useState([]);

  const [nodeMap, setNodeMap] = useState({});
  const [fromNodeOptions, setFromNodeOptions] = useState([]);
  const [toNodeOptions, setToNodeOptions] = useState([]);
  const [isMarkerVisible, setIsMarkerVisible] = useState([]);

  const [connectionColors, setConnectionColors] = useState({});
  const [connectionStyles, setConnectionStyles] = useState({});
  const [polyLineKey, setPolyKey] = useState({});

  var routes = [];
  var nodes = [];

  const createMap = () => {
    console.log("new create map");
    mapRef.current = L.map(mapRef.current, {
      center: [51.505, -0.09],
      zoom: 13,
    }).setView([51.35, -116.25], 12);

    const imageBounds = [
      [51.25, -116.05],
      [51.45, -116.45],
    ];
    L.imageOverlay("/bg3.png", imageBounds).addTo(mapRef.current);
  };

  const createPolyLines = () => {
    for (const route of routes) {
      const coordinates = [
        nodeMap[route.fromNode].location.coordinates,
        nodeMap[route.toNode].location.coordinates,
      ];
      const polyLine = L.polyline(coordinates, {
        color: "green",
        interactive: true,
      });
      polyLine.on({
        mouseover: () => {
          const center = polyLine.getCenter();
          L.popup()
            .setLatLng(center)
            .setContent("popup")
            .openOn(mapRef.current);
          polyLine.setStyle({ color: "yellow" });
        },
        mouseout: () => {
          polyLine.setStyle({ color: "green" });
        },
      });
      polyLine.addTo(mapRef.current);
    }
  };

  const createNodes = () => {
    for (const node of nodes) {
      const coordinates = node.location.coordinates;
      L.circleMarker(coordinates, {
        color: "blue",
        radius: 5,
        interactive: true,
      }).addTo(mapRef.current);
    }
  };

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

  const changeConnectionStyle = (id, newStyle) => {
    const key = id;
    setConnectionStyles((prevStyle) => ({
      ...prevStyle,
      [key]: newStyle,
    }));
  };

  const changeConnectionColor = (id, newColor) => {
    const key = id;
    setConnectionColors((prevColors) => ({
      ...prevColors,
      [key]: newColor,
    }));
  };

  const toggleMarkerVisibility = (id, visible) => {
    setIsMarkerVisible((prevVisibles) => ({
      ...prevVisibles,
      [id]: visible,
    }));
  };

  const displayRoute = () => {
    connections.forEach((connection) => {
      changeConnectionColor(connection._id, connection.color);
    });
    return;
  };

  const renderPolyLine = (id) => {
    setPolyKey((prevKey) => ({
      ...prevKey,
      [id]: Date.now(),
    }));
  };

  //    [
  //      51.37,
  //      -116.23
  //  ]
  const [mapOptions] = useState({
    center: [51.35, -116.25], // Initial center
    zoom: 12, // Initial zoom level
    minZoom: 12, // Minimum allowed zoom level
    // maxZoom: 6, // Maximum allowed zoom level
    bounds: [
      [51.25, -116.05],
      [51.45, -116.45],
    ], // Bounds of the visible area
  });

  var polyLineStyle = {
    weight: 4,
    opacity: 0.7,
  };

  //search_route
  var polyLineHighlitedStyle = {
    weight: 7,
    opacity: 1,
  };

  const handleSearch = () => {
    const requestBody = {
      type: "search_route",
      data: {
        startNode: "65f9b40bd3f604153d1d9b5f",
        endNode: "65f9b4e8d3f604153d1d9b67",
      },
    };

    postData(requestBody, (error, data) => {
      if (error) {
        console.error("Error fetching the route:", error);
        alert("Error: " + error.message);
      } else {
        console.log(data);
        if (data.results) {
          toggleMarkerVisibility("65f9b40bd3f604153d1d9b5f", true);
          toggleMarkerVisibility("65f9b4e8d3f604153d1d9b67", true);
          // if(mapRef.current)
          // {
          //   var popupStart = L.popup({ closeButton: false, autoClose: false })
          //   .setLatLng([51.37, -116.23])
          //   .setContent('Start Point')
          //   .openOn(mapRef);
          //   var popupEnd = L.popup({ closeButton: false, autoClose: false })
          //   .setLatLng([51.35, -116.27])
          //   .setContent('End Point')
          //   .openOn(mapRef);
          // }
          for (var i = 0; i < data.results.length; i++) {
            const array = data.results[i];
            var color = i == 0 ? "yellow" : "red";
            if (array) {
              for (const id of array) {
                changeConnectionStyle(id, polyLineHighlitedStyle);
                changeConnectionColor(id, color);
                renderPolyLine(id);
              }
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    //initialize map
    createMap();

    const fetchData = () => {
      try {
        const requestBody = {
          type: "get_routes",
          data: {},
        };
        postData(requestBody, (error, data) => {
          if (error) {
            console.error("Error fetching the route:", error);
            alert("Error: " + error.message);
          } else {
            console.log(data);
            const locationsDatas = data.results.routes_nodes;
            for (const node of locationsDatas) {
              nodeMap[node._id] = node;
              toggleMarkerVisibility(node._id, false);
            }
            const connectionsData = data.results.routes;

            setLocations(locationsDatas);
            setConnections(connectionsData);
            setNodeMap(nodeMap);
            setFromNodeOptions(locationsDatas);
            setToNodeOptions(locationsDatas);
            for (const slope of connectionsData) {
              changeConnectionColor(slope._id, slope.color);
              changeConnectionStyle(slope._id, polyLineStyle);
              //renderPolyLine(slope._id);
            }

            //after refactor
            routes = connectionsData;
            nodes = locationsDatas;
            createNodes();
            createPolyLines();
          }
        });
        // const locationsResponse = await fetch('https://example.com/locations');
        // const locationsData = await locationsResponse.json();
        // setLocations(locationsData);

        // const connectionsResponse = await fetch('https://example.com/connections');
        // const connectionsData = await connectionsResponse.json();
        // setConnections(connectionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      mapRef.current.remove();
    };
  }, []);

  return (
    <div className="ski-resort-map-container">
      <div className="search-form">
        <select
          style={{ width: "85%" }}
          name="Starting Location"
          value={startingLocation}
          onChange={handleStartingLocationChange}
        >
          <option value="Any">From: Any</option>
          {fromNodeOptions.map((option) => (
            <option key={option._id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          style={{ width: "85%" }}
          name="Destination"
          value={destination}
          onChange={handleDestinationChange}
        >
          <option value="Any">To: Any</option>
          {toNodeOptions.map((option) => (
            <option key={option._id} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          style={{ width: "85%" }}
          name="difficulty"
          value={preferences.difficulty}
          onChange={handlePreferencesChange}
        >
          <option value="Any">Difficulty: Any</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select
          style={{ width: "85%" }}
          name="duration"
          value={preferences.duration}
          onChange={handlePreferencesChange}
        >
          <option value="Any">Duration: Any</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="toggle-map">
        <hr className="horizontal-line"></hr>
        <button onClick={handleToggleMap} className="toggle-map-button">
          {showSkiMap ? "Show Amenities Map" : "Show Ski Map"}
        </button>
      </div>
      <div ref={mapRef} style={{ height: "600px", width: "80%" }} />
    </div>
  );
};

{
  /* <MapContainer
        center={mapOptions.center}
        zoom={mapOptions.zoom}
        minZoom={mapOptions.minZoom}
        style={{ height: "500px", width: "100%" }}
        maxBounds={mapOptions.bounds}
        whenReady={(instance) => {
          console.log("map created!");
          mapRef.current = instance;
        }}
      >
        {showSkiMap ? (
          <ImageOverlay url="/bg3.png" bounds={mapOptions.bounds} />
        ) : (
          <ImageOverlay url="/bg3.png" bounds={mapOptions.bounds} />
        )}
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={location.location.coordinates}
            icon={createLeafletIcon(faSkiing)}
            color="black"
          >
            <Popup>
              <strong>{location.name}</strong>
              <br />
            </Popup>
          </Marker>
        ))}
        {locations.map(
          (location) =>
            isMarkerVisible[location._id] && (
              <Marker
                position={location.location.coordinates}
                icon={createLeafletMarker(faLocationArrow)}
              />
            )
        )}
        {connections.map((connection, index) => (
          <Polyline
            interactive={true}
            key={polyLineKey[connection._id]}
            positions={[
              nodeMap[connection.fromNode].location.coordinates,
              nodeMap[connection.toNode].location.coordinates,
            ]}
            color={connectionColors[connection._id]}
            style={connectionStyles[connection._id]}
            mouseover={() => handleMouseOver(connection._id)}
            mouseout={() => handleMouseOut(connection._id)}
          />
        ))}
      </MapContainer> */
}

export default SkiResortMap;
