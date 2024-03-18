const event = require('../../event');
const SkiResort = require("../model/ski_resort");

class RoutingController{
    constructor(){
        event.on("POST", (mes) => {
            console.log("post message received, id: ", mes.id, ", type: ", mes.data.type);
            //database query. -> result.
            //res{
            //id:mes.id
            //data:{
            //    options
            //}    
            //}
            //event.emit(res)
            if(mes.data.type == "find_facilities")
            {
                this.getAllFacilities();
            }
        });

    }

    addSkiResort(){
        async(req, res, next) => {
            try {
                const resort = new SkiResort(req.body);
                const result = await resort.save();
                //event.emit();
                res.send({
                    "resp_code":"000",
                    "message":"success",
                    "data":result,
                });
            }catch {
                console.log("There was a problem creating the resort...");
            }
        }
    }


  getAllFacilities(){
    async (req, res, next) => {
        try {
          const results = await Facility.find({}, { __v: 0 });
          res.send({
            resp_code: "000",
            message: "success",
            data: results,
          });
        } catch (error) {
          console.log(error.message);
        }
  }
}
}

const ex = new RoutingController();
module.exports = ex;
