const event = require("../../event");
const constants = require("../../messaging/raw");
const SkiResort = require("../model/ski_resort");
const RouteNode = require("../model/node");
const Route = require("../model/route");
const Lift = require("../model/lift");
const Slope = require("../model/slope");
const StartEndNode = require("../model/start_end_nodes");

class Node {
  constructor(id, neighbors = {}) {
    this.id = id;
    this.neighbors = neighbors;
  }
}

const routeMap = new Map();

function cacheNodes(nodes) {
  if (nodes) {
    for (const node of nodes) {
      nodesMap[node.sid] = node;
      //routeMap[node.sid] = new Node(node.sid, new Map());
    }
  }
}

function cacheRoutes(routes) {
  console.log("cache routemap");
  console.log(routeMap);
  if (routes) {
    for (const route of routes) {
      const fromNode = routeMap[route.fromNode.toString()];
      const toNode = routeMap[route.toNode.toString()];
      if (!fromNode.neighbors[route.toNode.toString()]) {
        fromNode.neighbors[route.toNode.toString()] = new Set();
      }
      fromNode.neighbors[route.toNode.toString()].add(route.id);
      if (!toNode.neighbors[route.fromNode.toString()]) {
        toNode.neighbors[route.fromNode.toString()] = new Set();
      }
      toNode.neighbors[route.fromNode.toString()].add(route.id);
    }
    console.log(routeMap);
  }
}

function findAllPaths(startId, endId) {
  let visited = new Set();
  let paths = [];
  dfs(startId, endId, visited, paths);
  return paths;
}

function dfs(currentId, endId, visited, path, paths) {
  console.log(`Visiting node ${currentId}, path so far: ${path.join(" -> ")}`);
  if (currentId == endId) {
  }
  path.push(currentId);
  visited.add(currentId);

  if (currentId === endId) {
    paths.push([...path]);
  } else {
    for (let neighborId of graph[currentId].neighbors) {
      if (!visited.has(neighborId)) {
        dfs(graph, neighborId, endId, visited, path, paths);
      }
    }
  }

  path.pop();
  visited.delete(currentId);
}

class RoutingController {
  constructor() {
    event.on(constants.EVENT_IN, (mes) => {
      console.log(
        "post message received, id: ",
        mes.id,
        ", type: ",
        mes.data.type
      );
      if (mes.data.type == constants.FIND_ROUTE) {
        this.findRoutes(mes);
      } else if (mes.data.type == constants.GET_ROUTE) {
        this.getRoutes(mes);
      } else if (mes.data.type == constants.ADD_NODE) {
        this.addNodes(mes);
      } else if (mes.data.type == constants.ADD_SLOPE) {
        this.addSlope(mes);
      } else if (mes.data.type == constants.GET_NODES) {
        this.getNodeIds(mes);
      } else if (mes.data.type == constants.ADD_ROUTE) {
        this.addRoute(mes);
      } else if (mes.data.type == constants.GET_SEARCHABLE_ROUTE) {
        this.searchRoute(mes);
      } else if (mes.data.type == constants.GET_LIFTS) {
        this.getLifts(mes);
      }
    });
  }

  async addNodes(message) {
    try {
      const node = new RouteNode(message.data.data);
      const result = await node.save();
      const res = {
        id: message.id,
        data: {
          results: result,
        },
      };
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  async addSlope(message) {
    try {
      console.log(message.data);
      const slope = new Slope(message.data.data);
      const result = await slope.save();
      const res = {
        id: message.id,
        data: {
          results: result,
        },
      };
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  async addRoute(message) {
    try {
      console.log(message.data);
      const route = new Route(message.data.data);
      const result = await route.save();
      const res = {
        id: message.id,
        data: {
          results: result,
        },
      };
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getRoutes(message) {
    // Fetch all data from the database
    const [lifts, slopes, startAndEndpoints] = await Promise.all([
      Lift.find({}, { __v: 0 }),
      Slope.find({}, { __v: 0 }),
      StartEndNode.find({}, { __v: 0 }),
    ]);

    // Process lifts and slopes into routes and nodes
    const routesNodes = [...startAndEndpoints].map((item) => ({
      location: { type: "Point", coordinates: [item.x, item.y] },
      _id: item.sid,
      name: item.name,
      icon_name: "faMountain",
      status: "true",
    }));

    const routes = [...lifts, ...slopes].map((item) => ({
      _id: item.id,
      id: item.id,
      fromNode: item.fromNode,
      toNode: item.toNode,
      color: item.color,
      route_type: lifts.includes(item) ? "lift" : "slope", // Distinguish between lifts and slopes
      name: item.name,
      distance: item.length !== undefined ? item.length : -1, 
    }));

    // Assemble and return the final structure
    const res = {
      id: message.id,
      data: {
        results: {
          routes_nodes: routesNodes,
          routes: routes,
        },
      },
    };

    event.emit(constants.EVENT_OUT, res);
  }

  async findRoutes(message) {
    try {
      const resort = new SkiResort(req.body);
      const result = await resort.save();
      //event.emit();
      res.send({
        resp_code: "000",
        message: "success",
        data: result,
      });
    } catch {
      console.log("There was a problem creating the resort...");
    }
  }

  async getNodeIds(message) {
    try {
      console.log(message);
      const fromId = message.data.data.fromNode;
      const toId = message.data.data.toNode;

      console.log(fromId + "," + toId);

      const paths = await findAllPaths(fromId, toId);

      const res = {
        id: message.id,
        data: {
          results: paths,
        },
      };
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  async searchRoute(message) {
    try {
      const routes = [
        ["65fa297b0c293d4bb5c51323"],
        [
          "65fa28c00c293d4bb5c5131f",
          "65fa3f970a3c3e07ca59f753",
          "65fa3fd60a3c3e07ca59f755",
          "65fa29e50c293d4bb5c5132b",
        ],
      ];

      const res = {
        id: message.id,
        data: {
          results: routes,
        },
      };
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
    }
  }

  async getLifts(message) {
    try {
      const results = await Lift.find({}, { __v: 0 });
      const res = {
        id: message.id,
        data: {
          results: results,
        },
      };
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
    }
  }
}

const rc = new RoutingController();
module.exports = rc;
