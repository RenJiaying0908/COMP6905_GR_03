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
const cache_routes = new Map();
const nodesMap = new Map();

function cacheNodes(nodes) {
  if (nodes) {
    //console.log("cache nodes--------");
    for (const node of nodes) {
      //console.log("cache nodes-------- :", node);
      nodesMap.set(node._id, node);
      routeMap.set(node._id, new Node(node._id, new Map()));
    }
  }
}

function cacheRoutes(routes) {
  //console.log("cache routemap");
  //console.log(routeMap);
  if (routes) {
    for (const route of routes) {
      cache_routes.set(String(route._id), route);
      // console.log("route info: ");
      // console.log(route);
      // console.log("route map info: ");
      // console.log(routeMap);
      const fromNode = routeMap.get(route.fromNode.toString());
      const toNode = routeMap.get(route.toNode.toString());
      if (fromNode && toNode) {
        if (!fromNode.neighbors.get(route.toNode.toString())) {
          fromNode.neighbors.set(route.toNode.toString(), route.id);
        }

        if (!toNode.neighbors.get(route.fromNode.toString())) {
          toNode.neighbors.set(route.fromNode.toString(), route.id);
        }
      }
    }

    //console.log("route map is :");
    //console.log("***", routeMap);
  }
}

function findAllPaths(startId, endId, fromRoute, endRoute, difficulty) {
  let visited = new Set();
  let nodes_array = dfs(startId, endId, visited, [], []);
  let paths = [];
  for (const nodes of nodes_array) {
    let path = [];
    let prev = null;
    for (const node of nodes) {
      if (!prev) {
        prev = node;
      } else {
        path.push(routeMap.get(prev).neighbors.get(node));
        prev = node;
      }
    }

    paths.push(path);
  }

  for (const _path of paths) {
    if(_path.length>0)
    {
      if (!_path.includes(fromRoute)) {
        _path.unshift(fromRoute);
      }
      if (!_path.includes(endRoute)) {
        _path.push(endRoute);
      }
    }
  }

  if(!difficulty || difficulty == undefined || difficulty == "")
  {
    return paths;
  }
  const filteredPaths  = filterPaths(paths, difficulty)
  return  filteredPaths;
}

function filterPaths(paths, difficulty) {
  const filteredPaths = [];

  paths.forEach(subArray => {
      const hasMatchingRoute = subArray.some(id => {
          const route = cache_routes.get(id);
          return route && route.color === difficulty;
      });

      if (hasMatchingRoute) {
          filteredPaths.push(subArray);
      }
  });

  return filteredPaths;
}




// function dfs(graph, start, end, visited, path, shortestPath, distance) {
//   visited[start] = true;
//   path.push(start);

//   if (start === end) {
//       if (distance < shortestPath.distance || shortestPath.distance === -1) {
//           shortestPath.distance = distance;
//           shortestPath.path = [...path];
//       }
//   } else {
//       for (const route of graph) {
//           if (route.fromNode === start && !visited[route.toNode]) {
//               dfs(graph, route.toNode, end, visited, path, shortestPath, distance + route.distance);
//           }
//       }
//   }

//   path.pop();
//   visited[start] = false;

//   return path;
// }

function dfs(currentId, endId, visited, path, paths) {
  //console.log(`Visiting node ${currentId}, path so far: ${path.join(" -> ")}`);

  // 标记当前节点为已访问
  visited.add(currentId);

  // 将当前节点添加到路径
  path.push(currentId);

  if (currentId == endId) {
    // 找到路径，添加到结果中
    paths.push([...path]); // 使用副本以避免引用问题
  } else {
    let keys = [...routeMap.get(currentId).neighbors.keys()];
    for (const key of keys) {
      if (!visited.has(key)) {
        // 使用 has 检查 Set
        dfs(key, endId, visited, path, paths);
      }
    }
  }

  // 在返回之前回溯：移除路径的最后一个元素并从已访问集合中移除
  path.pop();
  visited.delete(currentId);

  return paths;
}

class RoutingController {
  constructor() {
    event.on(constants.EVENT_IN, (mes) => {
      // console.log(
      //   "post message received, id: ",
      //   mes.id,
      //   ", type: ",
      //   mes.data.type
      // );
      if (mes.data.type == constants.FIND_ROUTE) {
        this.findRoutes(mes);
      } else if (mes.data.type == constants.GET_ROUTE) {
        this.getRoutes(mes);
      } else if (mes.data.type == constants.ADD_NODE) {
        this.addNodes(mes);
      } else if (mes.data.type == constants.ADD_SLOPE) {
        this.addSlope(mes);
      } else if (mes.data.type == constants.GET_NODES) {
        //this.getNodeIds(mes);
      } else if (mes.data.type == constants.ADD_ROUTE) {
        this.addRoute(mes);
      } else if (mes.data.type == constants.GET_SEARCHABLE_ROUTE) {
        this.searchRoute(mes);
      } else if (mes.data.type == constants.SEAR) {
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
      //console.log(message.data);
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
      //console.log(message.data);
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

    cacheNodes(routesNodes);
    cacheRoutes(routes);

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

  // async getNodeIds(message) {
  //   try {
  //     console.log(message);
  //     const fromId = message.data.data.fromNode;
  //     const toId = message.data.data.toNode;

  //     console.log(fromId + "," + toId);

  //     const paths = await findAllPaths(fromId, toId);

  //     const res = {
  //       id: message.id,
  //       data: {
  //         results: paths,
  //       },
  //     };
  //     event.emit(constants.EVENT_OUT, res);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  async searchRoute(message) {
    try {
      //console.log("Searchable Nodes:", message);

      const paths = findAllPaths(
        cache_routes.get(String(message.data.data.fromRoute)).fromNode,
        cache_routes.get(String(message.data.data.toRoute)).toNode,
        message.data.data.fromRoute,
        message.data.data.toRoute,
        message.data.data.difficulty
      );

      //console.log("*Paths*", paths);
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
