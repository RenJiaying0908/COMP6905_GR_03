import React, { useState, useRef, useEffect } from "react";
import {
  faCheckCircle,
  faTimesCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
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
import L, { map } from "leaflet";
import { renderToString } from "react-dom/server";
import "./SkiResortMap.css";
import "./LiftInfoPopupPage.css";
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

const createLiftletIcon = (
  icon,
  backgroundColor = "transparent",
  iconColor = "white",
  iconSize = "30px"
) => {
  return L.divIcon({
    html: renderToString(
      <div
        style={{
          backgroundColor: backgroundColor,
          display: "inline-block",
          borderRadius: "50%",
        }}
      >
        <FontAwesomeIcon
          icon={icon}
          style={{ color: iconColor, fontSize: iconSize }}
        />
      </div>
    ),
    className: "liftlet-div-icon",
    iconSize: [24, 24],
  });
};

const lifts = [];

const LiftInfoPopupPage = ({ onClose }) => {
  const originalStyle = window.getComputedStyle(document.body).overflow;
  document.body.style.overflow = "hidden";
  return (
    <div className="lift-info-popup">
      <div className="lift-info-popup-content-bg">
        <div className="lift-info-popup-header">
          <h2>Cable Cars & Lifts</h2>
          <FontAwesomeIcon
            icon={faTimes}
            className="close-icon"
            onClick={() => {
              document.body.style.overflow = originalStyle;
              onClose();
            }}
          />
        </div>
        <table className="lifts-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TYPE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {lifts.map((lift, index) => (
              <tr key={index}>
                <td>{lift.name}</td>
                <td>{lift.type}</td>
                <td>
                  {lift.status === "open" ? (
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className="icon open"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faTimesCircle}
                      className="icon closed"
                    />
                  )}
                  {lift.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
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
  var lastGlobalMarker = null;
  const slopeCounterMap = new Map();
  let currentHighlightedMarker = null;
  const [showLiftInfo, setLiftInfoPopup] = useState(false);
  const [polylineOriginalColors, setPolylineOriginalColors] = useState({});
  const mapRef = useRef(null);
  const polylineOriginalColorsRef = useRef(new Map()); // Use a ref to store original colors
  const searchRouteResult = useRef([]);
  const liftMarderOpacityRef = new Map();
  const [startingLocation, setStartingLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [preferences, setPreferences] = useState({
    difficulty: "Any",
    duration: "Any",
  });
  const [showSkiMap, setShowSkiMap] = useState(true);

  const [locations, setLocations] = useState([]);
  const [connections, setConnections] = useState([]);

  const [nodeMap, setNodeMap] = useState({});
  const [routeMap, setRouteMap] = useState({});
  const [fromNodeOptions, setFromNodeOptions] = useState([]);
  const [toNodeOptions, setToNodeOptions] = useState([]);
  const [isMarkerVisible, setIsMarkerVisible] = useState([]);
  const [message, setMessage] = useState(["information will be shown here"]);
  const [connectionColors, setConnectionColors] = useState({});
  const [connectionStyles, setConnectionStyles] = useState({});
  const [polyLineKey, setPolyKey] = useState({});

  var blinkInterval = useRef(null);

  var blinkingPolyLines = useRef([]);
  var routes = [];
  var nodes = [];
  const polyLineMap = useRef(new Map());
  const markerMap = useRef(new Map());
  const intermediateNodes = new Map();
  var currentHighlightedPolyLine = null;
  var slopeCounter = 1; // 初始化斜坡计数器
  const blinkColor = "gray";

  const blink = () => {
    if (blinkingPolyLines.current) {
      for (const polyLine of blinkingPolyLines.current) {
        var marker = markerMap.current.get(polyLine._id);
        var currentOpacity = polyLine.options.opacity;
        if (currentOpacity === 1) {
          polyLine.setStyle({ opacity: 0 });
          marker.remove();
        } else {
          polyLine.setStyle({
            opacity: 1,
          });
          marker.addTo(mapRef.current);
        }
      }
    }
  };

  function startBlinking(polyLines) {
    stopBlinking();
    blinkingPolyLines.current = polyLines;
    blinkInterval.current = setInterval(blink, 350);
  }

  function stopBlinking() {
    if (blinkInterval.current) {
      clearInterval(blinkInterval.current);
      blinkInterval.current = null;
      if (blinkingPolyLines.current) {
        for (const polyLine of blinkingPolyLines.current) {
          var marker = markerMap.current.get(polyLine._id);
          polyLine.setStyle({
            opacity: 1,
          });
          marker.addTo(mapRef.current);
        }
        blinkingPolyLines.current = null;
      }
    }
  }

  const toggleLiftInfoPopup = () => {
    setLiftInfoPopup(!showLiftInfo);
  };

  //    mapRef.current = L.map(mapRef.current, {
  //    center: [51.505, -0.09],
  //    zoom: 13,
  //  }).setView([51.35, -116.25], 12);
  const createMap = () => {
    console.log("new create map");
    mapRef.current = L.map(mapRef.current, {
      center: [50, -100],
      zoom: 13,
    }).setView([50, -100], 12);

    //      [51.25, -116.05],
    //      [51.45, -116.45],
    //x:0.22(vertical), y:0.4(horizon)
    const imageBounds = [
      [49.89, -99.8],
      [50.11, -100.2],
    ];
    L.imageOverlay("/bg3.png", imageBounds).addTo(mapRef.current);
  };

  const createPolyLines = () => {
    var id_base = Date.now();
    for (const route of routes) {
      var start_x = nodeMap[route.fromNode].location.coordinates[0];
      var start_y = nodeMap[route.fromNode].location.coordinates[1];
      var end_x = nodeMap[route.toNode].location.coordinates[0];
      var end_y = nodeMap[route.toNode].location.coordinates[1];

      var intermediateNode = [(start_x + end_x) / 2, (start_y + end_y) / 2];
      if (intermediateNodes.get(intermediateNode[0]) == intermediateNode[1]) {
        intermediateNode[0] += 0.005;
        intermediateNode[1] += 0.005;
      } else {
        intermediateNodes.set(intermediateNode[0], intermediateNode[1]);
      }

      const coordinates = [
        nodeMap[route.fromNode].location.coordinates,
        intermediateNode,
        nodeMap[route.toNode].location.coordinates,
      ];
      // Define default polyline style
      let polyLineStyle = {
        color: "green", // Default color
        weight: 7, // Default weight
        interactive: true,
      };

      // Modify style based on the route type and color
      if (route.route_type === "lift") {
        // Keep the default style for lift
      } else if (route.route_type === "slope") {
        // Check color and adjust style accordingly for slope
        const colors = {
          green: { color: "black", weight: 3 },
          blue: { color: "blue", weight: 3 },
          red: { color: "red", weight: 3 },
        };

        // Apply the specific style from the colors object if it exists
        if (colors[route.color]) {
          polyLineStyle = { ...polyLineStyle, ...colors[route.color] };
        }
      }

      // Create a Polyline with the determined style
      const polyLine = L.polyline(coordinates, polyLineStyle);
      polyLine._mid = id_base++;
      polyLine._id = String(route._id);
      polylineOriginalColorsRef.current.set(polyLine._mid, polyLineStyle.color);
      if (route.route_type === "slope") {
        polyLine.routeNum = slopeCounter++;
      } else {
        polyLine.routeNum = -1;
      }

      polyLine.on({
        mouseover: () => {
          const center = polyLine.getCenter();
          L.popup()
            .setLatLng(center)
            .setContent(route.name)
            .openOn(mapRef.current);
          if (lastGlobalMarker) {
            mapRef.current.removeLayer(lastGlobalMarker);
          }
          if (currentHighlightedMarker) {
            mapRef.current.removeLayer(currentHighlightedMarker);
          }
          if (
            currentHighlightedPolyLine &&
            currentHighlightedPolyLine !== polyLine
          ) {
            const originalColor = polylineOriginalColorsRef.current.get(
              currentHighlightedPolyLine._mid
            );
            currentHighlightedPolyLine.setStyle({ color: originalColor });
          }

          polyLine.setStyle({ color: "orange" });
          currentHighlightedPolyLine = polyLine;

          if (route.route_type === "slope") {
            var globalMarker = L.marker([0, 0], {
              icon: L.divIcon({
                className: "custom-icon",
                html: "",
                iconSize: L.point(20, 20),
              }),
            });
            globalMarker.setLatLng(center);
            if (
              !mapRef.current.hasLayer(globalMarker) &&
              route.route_type === "slope"
            ) {
              const markerHtml = `<div style="background-color: orange; border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; color:white; font-weight:bold">${polyLine.routeNum}</div>`;
              globalMarker.setIcon(
                L.divIcon({
                  className: "custom-icon",
                  html: markerHtml,
                  iconSize: L.point(30, 30),
                })
              );
              globalMarker.addTo(mapRef.current);
              lastGlobalMarker = globalMarker;
            }
          }
          if (route.route_type === "lift") {
            const liftIcon = createLiftletIcon(faSkiing, "orange");
            currentHighlightedMarker = L.marker(center, { icon: liftIcon });
            currentHighlightedMarker.addTo(mapRef.current);
          }
        },
      });

      polyLine.addTo(mapRef.current);
      polyLineMap.current.set(String(route._id), polyLine);

      if (route.route_type === "slope") {
        const markerHtml = `<div style="background-color: ${polyLineStyle.color}; border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center;color:white;font-weight:bold">${polyLine.routeNum}</div>`;
        const marker = L.marker(polyLine.getCenter(), {
          icon: L.divIcon({
            className: "custom-icon",
            html: markerHtml,
            iconSize: L.point(30, 30),
          }),
        });
        marker.addTo(mapRef.current);
        markerMap.current.set(String(route._id), marker);
      } else {
        const liftIcon = createLiftletIcon(faSkiing, polyLineStyle.color);
        const markerLift = L.marker(polyLine.getCenter(), { icon: liftIcon });
        markerLift.addTo(mapRef.current);
        markerMap.current.set(String(route._id), markerLift);
      }
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
    var selectElement = document.getElementById("startLocationSelect");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var key = selectedOption.getAttribute("id_key");
    if (key) {
      startBlinking([polyLineMap.current.get(key)]);
    } else {
      stopBlinking();
    }
    setStartingLocation(event.target.value);
  };

  const handleDestinationChange = (event) => {
    var selectElement = document.getElementById("destinationSelect");
    var selectedOption = selectElement.options[selectElement.selectedIndex];
    var key = selectedOption.getAttribute("id_key");
    if (key) {
      startBlinking([polyLineMap.current.get(key)]);
    } else {
      stopBlinking();
    }
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
  // const [mapOptions] = useState({
  //   center: [51.35, -116.25], // Initial center
  //   zoom: 12, // Initial zoom level
  //   minZoom: 12, // Minimum allowed zoom level
  //   // maxZoom: 6, // Maximum allowed zoom level
  //   bounds: [
  //     [51.25, -116.05],
  //     [51.45, -116.45],
  //   ], // Bounds of the visible area
  // });

  var polyLineStyle = {
    weight: 4,
    opacity: 0.7,
  };

  //search_route
  var polyLineHighlitedStyle = {
    weight: 7,
    opacity: 1,
  };

  const handleCheckboxChange = (event, index) => {
    if (
      searchRouteResult.current &&
      index - 1 >= 0 &&
      index - 1 < searchRouteResult.current.length
    ) {
      stopBlinking();
      startBlinking(searchRouteResult.current[index - 1]);
    }
  };

  const handleReset = () => {
    setMessage(["information will be shown here"]);
    stopBlinking();
  };

  const handleSearch = () => {
    handleReset();
    var startElement = document.getElementById("startLocationSelect");
    var start_id =
      startElement.options[startElement.selectedIndex].getAttribute("id_key");

    var endElement = document.getElementById("destinationSelect");
    var end_id =
      endElement.options[endElement.selectedIndex].getAttribute("id_key");

    var difficultyElement = document.getElementById("difficultySelect");
    var difficulty =
      difficultyElement.options[difficultyElement.selectedIndex].getAttribute(
        "id_key"
      );

    if (!start_id || !end_id) {
      const msg = "please select start/end location.";
      setMessage([msg]);
    }

    const requestBody = {
      type: "search_route",
      data: {
        fromRoute: start_id,
        toRoute: end_id,
        difficulty: difficulty,
      },
    };

    postData(requestBody, (error, data) => {
      if (error) {
        console.error("Error fetching the route:", error);
        alert("Error: " + error.message);
      } else {
        console.log(data);
        if (data.results) {
          let paths = [];
          if (data.results.length == 0) {
            const msg = "no matching route founded.";
            setMessage([msg]);
            return;
          }
          var msg = `Found ${data.results.length} routes according to preference! using checkbox to show your prefered route!<br/>`;
          var msg_array = [];
          var distance_array = [];
          searchRouteResult.current = [];
          var round = 0;
          for (const array of data.results) {
            var path_msg = "";
            var i = 0;
            var distance = 0;
            var single_path = [];
            var longgest_index = 0;
            var shortest_index = 0;
            for (const path of array) {
              if (routeMap[String(path)].route_type == "slope") {
                distance += routeMap[String(path)].distance;
              }
              if (!paths.includes(polyLineMap.current.get(String(path)))) {
                paths.push(polyLineMap.current.get(String(path)));
              }
              single_path.push(polyLineMap.current.get(String(path)));
              path_msg += `${routeMap[String(path)].name}`;
              path_msg += `(${routeMap[String(path)].route_type})`;
              if (i != array.length - 1) {
                path_msg += " -> ";
              } else {
                path_msg += `   (total distance: ${distance} )`;
              }
              i++;
            }
            searchRouteResult.current.push(single_path);
            msg_array.push(path_msg);
            distance_array.push(distance);
            if (distance > distance_array[longgest_index]) {
              longgest_index = round;
            }
            if (distance < distance_array[shortest_index]) {
              shortest_index = round;
            }
            round++;
          }
          for (var j = 0; j < msg_array.length; j++) {
            if (msg_array.length > 1) {
              if (j == longgest_index) {
                msg_array[j] += " :Longest Route";
              } else if (j == shortest_index) {
                msg_array[j] += " :Shortest Route";
              }
            }
            msg_array[j] += "<br/>";
            msg += msg_array[j];
          }
          const routesArray = msg.split("<br/>").filter((line) => line);
          setMessage(routesArray);
          startBlinking(paths);
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
              //re-mapping the coordinates.
              // x [0, 2400] (vertical), y [0, 1200]
              //center 50, -100
              //north west: [49.89, -99.8], south east: [50.11, -100.2],
              //x:0.22(vertical), y:0.4(horizon)

              var x = node.location.coordinates[0];
              var y = node.location.coordinates[1];

              x = (x / 1800) * 0.4 - 0.2 + -100;
              y = (y / 1200) * 0.22 - 0.11 + 50;

              node.location.coordinates[1] = x + 0.03;
              node.location.coordinates[0] = y;

              nodeMap[node._id] = node;
              toggleMarkerVisibility(node._id, false);
            }
            const connectionsData = data.results.routes;
            for (var route of connectionsData) {
              routeMap[String(route._id)] = route;
              if (route.route_type == "lift") {
                lifts.push(route);
              }
            }

            setLocations(locationsDatas);
            setConnections(connectionsData);
            setNodeMap(nodeMap);
            setRouteMap(routeMap);
            setFromNodeOptions(connectionsData);
            setToNodeOptions(connectionsData);
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
      {showLiftInfo && <LiftInfoPopupPage onClose={toggleLiftInfoPopup} />}
      <div className="check-weather-forecast">
        <button onClick={() => {}}>Weather Forecast</button>
        <button
          onClick={() => {
            toggleLiftInfoPopup();
          }}
        >
          view Lift info
        </button>
        <button onClick={() => {}}>Purchase Ski Pass</button>
      </div>
      <hr className="horizontal-line"></hr>
      <div className="search-form">
        <select
          id="startLocationSelect"
          style={{ width: "85%" }}
          name="Starting Location"
          value={startingLocation}
          onChange={handleStartingLocationChange}
        >
          <option value="Any">From: Any</option>
          {fromNodeOptions.map((option) => (
            <option key={option._id} value={option.name} id_key={option._id}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          style={{ width: "85%" }}
          id="destinationSelect"
          name="Destination"
          value={destination}
          onChange={handleDestinationChange}
        >
          <option value="Any">To: Any</option>
          {toNodeOptions.map((option) => (
            <option key={option._id} value={option.name} id_key={option._id}>
              {option.name}
            </option>
          ))}
        </select>
        <select
          style={{ width: "85%" }}
          name="difficulty"
          id="difficultySelect"
          value={preferences.difficulty}
          onChange={handlePreferencesChange}
        >
          <option value="Any">Difficulty: Any</option>
          <option value="Beginner" id_key="green">
            Beginner
          </option>
          <option value="Intermediate" id_key="blue">
            Intermediate
          </option>
          <option value="Advanced" id_key="black">
            Advanced
          </option>
        </select>
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleReset}>reset</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {message.map((route, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            {index !== 0 && (
              <input
                type="radio"
                name="routeSelection"
                onChange={(event) => handleCheckboxChange(event, index)}
              />
            )}
            <p style={{ marginLeft: "5px" }}>
              {route.split("->").map((segment, index, array) => {
                const isLastSegment = index === array.length - 1;
                const segmentTrimmed = segment.trim();
                const isLongest = segmentTrimmed.includes("--Longgest Route");
                const isShortest = segmentTrimmed.includes("--shortest Route");

                return (
                  <React.Fragment key={index}>
                    {isLongest || isShortest ? (
                      <strong>{segmentTrimmed}</strong>
                    ) : (
                      segmentTrimmed
                    )}
                    {!isLastSegment && <strong> -&gt; </strong>}
                  </React.Fragment>
                );
              })}
            </p>
          </div>
        ))}
      </div>
      <hr className="horizontal-line"></hr>
      <div ref={mapRef} style={{ height: "700px", width: "80%" }} />
    </div>
  );
};

export default SkiResortMap;
