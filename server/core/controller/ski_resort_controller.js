const SkiResort = require("../model/ski_resort");

module.exports = {
    addSkiResort: async(req, res, next) => {
        try {
            const resort = new SkiResort(req.body);
            const result = await resort.save();
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