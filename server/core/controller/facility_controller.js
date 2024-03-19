const event = require("../../event");
const constants = require("../../messaging/raw");
const Facility = require("../model/facility");


class FacilityController {
  constructor() {
    event.on(constants.EVENT_IN, (mes) => {
      console.log(
        "post message received, id: ",
        mes.id,
        ", type: ",
        mes.data.type
      );
      if (mes.data.type == constants.FIND_FACILITIES) {
        this.getAllFacilities(mes);
      }else if(mes.data.type == constants.ADD_FACILITY){
        this.addFacility(mes)
      }
    });
  }

  async getAllFacilities(message) {
      try {
        const results =  await Facility.find({}, { __v: 0 });
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

    async addFacility(message) {
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

const fc = new FacilityController();
module.exports = fc;
