const SkillLevel = require("../model/skill_level");

module.exports = {
    addSkillLevel: async(req, res, next) => {
        try {
            const skillLevel = new SkillLevel(req.body);
            const result = await skillLevel.save();
            res.send({
                "resp_code":"000",
                "message":"success",
                "data":result,
            });
        }catch {
            console.log("There was a problem creating skill level...");
        }
    }
}