const Facility = require("../model/facility");

module.exports = {
  addFacility: async (req, res, next) => {
    try {
      const facility = new Facility(req.body);
      const result = await facility.save();
      res.send({
        resp_code: "000",
        message: "success",
        data: result,
      });
    } catch {
      console.log("There was a problem creating the facility...");
    }
  },

  getAllFacilities: async (req, res, next) => {
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
  },
};
