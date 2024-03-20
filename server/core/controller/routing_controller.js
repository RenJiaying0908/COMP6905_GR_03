const event = require("../../event");
const constants = require("../../messaging/raw");
const SkiResort = require("../model/ski_resort");
const RouteNode = require("../model/node");
const Route = require("../model/route");

class Node {
  constructor(id, neighbors = {}) {
    this.id = id;
    this.neighbors = neighbors;
  }
}

const routeMap = new Map();

function cacheNodes(nodes){
    if(nodes)
    {
        for(const node of nodes)
        {
            routeMap[node._id] = new Node(node._id.toString(), new Map());
        }
    }
}

function cacheRoutes(routes){
    console.log("cache routemap");
    console.log(routeMap);
    if(routes)
    {
        for(const route of routes)
        {
            const fromNode = routeMap[route.fromNode.toString()];
            const toNode = routeMap[route.toNode.toString()];
            if(!fromNode.neighbors[route.toNode.toString()])
            {
                fromNode.neighbors[route.toNode.toString()] = new Set();
            }
            fromNode.neighbors[route.toNode.toString()].add(route._id.toString())
            if(!toNode.neighbors[route.toNode.toString()])
            {
                toNode.neighbors[route.toNode.toString()] = new Set();
            }
            toNode.neighbors[route.toNode.toString()].add(route._id.toString());
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
  if(currentId == endId)
  {

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
      }else if(mes.data.type == constants.ADD_ROUTE){
        this.addRoute(mes);
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
    try {
      const [nodes, routes] = await Promise.all([
        RouteNode.find({}, { __v: 0 }),
        Route.find({}, { __v: 0 }),
      ]);

      const res = {
        id: message.id,
        data: {
          results: {
            routes_nodes: nodes,
            routes: routes,
          },
        },
      };
      cacheNodes(nodes);
      cacheRoutes(routes);
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
}

const rc = new RoutingController();
module.exports = rc;
