const event = require("../../event");
const constants = require("../../messaging/raw");
const SkiResort = require("../model/ski_resort");
const RouteNode = require("../model/node");
const Slope = require("../model/slope");

class Node {
  constructor(id, neighbors = []) {
    this.id = id;
    this.neighbors = neighbors;
  }
}

async function findAllPaths(graph, startId, endId) {
  let visited = new Set();
  let paths = [];
  dfs(graph, startId, endId, visited, [], paths);
  return paths;
}

function dfs(graph, currentId, endId, visited, path, paths) {
  console.log(`Visiting node ${currentId}, path so far: ${path.join(" -> ")}`);
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

  async getRoutes(message) {
    try {
      const [nodes, slopes] = await Promise.all([
        RouteNode.find({}, { __v: 0 }),
        Slope.find({}, { __v: 0 }),
      ]);

      const res = {
        id: message.id,
        data: {
          results: {
            routes_nodes: nodes,
            routes_slopes: slopes,
          },
        },
      };

      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.error(error.message);

      // Consider emitting an error event or handling the error appropriately
      event.emit(constants.EVENT_OUT, {
        id: message.id,
        error: error.message,
      });
    }
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
      console.log("*************");
      const nodesData = await RouteNode.find({}, { __v: 0 });

      let graph = {};

      for (let node of nodesData) {
        // Inside graph construction
        graph[node._id] = new Node(node._id);
        for (let otherNode of nodesData) {
          if (node._id !== otherNode._id) {
            graph[node._id].neighbors.push(otherNode._id);
          }
        }
      }
      console.log("Graph constructed with nodes:", Object.keys(graph).length);

      console.log(message);
      const fromId = message.data.data.fromNode;
      const toId = message.data.data.toNode;

      console.log(graph);
      console.log(fromId + "," + toId);

      const paths = await findAllPaths(graph, fromId, toId);

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
}

const rc = new RoutingController();
module.exports = rc;
