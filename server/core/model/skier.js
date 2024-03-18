const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkierSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  skillLevel: {
    type: Schema.Types.ObjectId,
    ref: "SkillLevel",
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

const Skier = mongoose.model("skier", SkierSchema);
module.exports = Skier;
