import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
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
  const [polylineOriginalColors, setPolylineOriginalColors] = useState({});
  const mapRef = useRef(null);
  const polylineOriginalColorsRef = new Map(); // Use a ref to store original colors
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
  var currentHighlightedPolyLine = null;
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
    var id_base = Date.now();
    for (const route of routes) {
      const coordinates = [
        nodeMap[route.fromNode].location.coordinates,
        nodeMap[route.toNode].location.coordinates,
      ];

      // Define default polyline style
      let polyLineStyle = {
        color: 'green', // Default color
        weight: 7, // Default weight
        interactive: true,
      };

      // Modify style based on the route type and color
      if (route.route_type === 'lift') {
        // Keep the default style for lift
      } else if (route.route_type === 'slope') {
        // Check color and adjust style accordingly for slope
        const colors = {
          'green': { color: 'black', weight: 3 },
          'blue': { color: 'blue', weight: 3 },
          'red': { color: 'red', weight: 3 },
        };

        // Apply the specific style from the colors object if it exists
        if (colors[route.color]) {
          polyLineStyle = {...polyLineStyle, ...colors[route.color]};
        }
      }

      // Create a Polyline with the determined style
      const polyLine = L.polyline(coordinates, polyLineStyle);
      polyLine._mid = id_base++;
      polylineOriginalColorsRef.set(polyLine._mid, polyLineStyle.color);
      console.log("polylineOriginalColorsRef size is: ", polylineOriginalColorsRef.size);

      polyLine.on({
        mouseover: () => {
          const center = polyLine.getCenter();
          L.popup()
            .setLatLng(center)
            .setContent("popup")
            .openOn(mapRef.current);
          if (currentHighlightedPolyLine && currentHighlightedPolyLine !== polyLine) {
            console.log("polyline id is : ",polyLine._mid );
            console.log("color is : ", polylineOriginalColorsRef.get(polyLine._mid));
            currentHighlightedPolyLine.setStyle({
              color: polylineOriginalColorsRef.get(currentHighlightedPolyLine._mid)
            });
          }
          polyLine.setStyle({ color: "yellow" });
          currentHighlightedPolyLine = polyLine;
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
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
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

export default SkiResortMap;
