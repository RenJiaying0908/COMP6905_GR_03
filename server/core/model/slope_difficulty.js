const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DifficultySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hexColor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
});

const Difficulty = mongoose.model("slope_difficulty", DifficultySchema);
module.exports = Difficulty;
