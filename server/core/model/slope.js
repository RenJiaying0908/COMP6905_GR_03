const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlopeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: Schema.Types.ObjectId,
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

const Slope = mongoose.model("slope", SlopeSchema);
module.exports = Slope;
