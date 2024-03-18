const Skier = require("../model/skier");

module.exports = {
    addSkier: async(req, res, next) => {
        try {
            const skier = new Skier(req.body);
            const result = await skier.save();
            res.send({
                "resp_code":"000",
                "message":"success",
                "data":result,
            });
        }catch {
            console.log("There was a problem creating skier...");
        }
    }
}