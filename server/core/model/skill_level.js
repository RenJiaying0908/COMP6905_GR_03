const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkillLevelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const SkillLevel = mongoose.model("skill_level", SkillLevelSchema);
module.exports = SkillLevel;
