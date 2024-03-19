const event = require("../../event");
const constants = require("../../messaging/raw");
const SkiResort = require("../model/ski_resort");
const RouteNode = require("../model/node");
const Slope = require("../model/slope");



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
      }else if(mes.data.type == constants.GET_ROUTE) {
        this.getRoutes(mes);
      }else if(mes.data.type == constants.ADD_NODE){
        this.addNodes(mes);
      }else if(mes.data.type == constants.ADD_SLOPE){
        this.addSlope(mes);
      }
    });
  }

  async addNodes(message){
    try {
      const node = new RouteNode(message.data.data);
      const result = await node.save();
      const res = {
        id:message.id,
        data:{
          results:result
        }
      }
      event.emit(constants.EVENT_OUT, res);
    }catch(error) {
      console.log(error.message);
    }
  }


  async addSlope(message){
    try {
      console.log(message.data);
      const slope = new Slope(message.data.data);
      const result = await slope.save();
      const res = {
        id:message.id,
        data:{
          results:result
        }
      }
      event.emit(constants.EVENT_OUT, res);
    }catch(error) {
      console.log(error.message);
    }
  }

  async getRoutes(message) {
    try {
      const nodes =  await RouteNode.find({}, { __v: 0 });
      const slopes = await Slope.find({}, {__v: 0 });
      const res = {
        id:message.id,
        data:{
          results:{
            routes_nodes: nodes,
            routes_slopes: slopes
          }
        }
      }
      event.emit(constants.EVENT_OUT, res);
    } catch (error) {
      console.log(error.message);
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
  
}

const rc = new RoutingController();
module.exports = rc;