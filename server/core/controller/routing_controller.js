const event = require("../../event");
const constants = require("../../messaging/raw");
const SkiResort = require("../model/ski_resort");
const Facility = require("../model/facility");


class RoutingController {
  constructor() {
    event.on(constants.EVENT_IN, (mes) => {
      console.log(
        "post message received, id: ",
        mes.id,
        ", type: ",
        mes.data.type
      );
      //database query. -> result.
      //res{
      //id:mes.id
      //data:{
      //    options
      //}
      //}
      //event.emit(res)
      if (mes.data.type == constants.FIND_FACILITIES) {
        console.log("****");
        this.getAllFacilities(mes);
      }
    });
  }

  async addSkiResort() {
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

  async getAllFacilities(message) {
      try {
        const results =  await Facility.find({}, { __v: 0 });
        console.log(results);
        const res = {
          id:message.id,
          data:{
            results:results
          }
        }
        event.emit(constants.EVENT_OUT, res);
      } catch (error) {
        console.log(error.message);
      }
    }
  
}

const ex = new RoutingController();
module.exports = ex;
