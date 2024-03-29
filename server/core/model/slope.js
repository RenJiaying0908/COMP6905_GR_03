const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlopeSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  fromNode: { type: String },
  toNode: { type: String },
  color: { type: String },
  length: { type: Number },
});

const Slope = mongoose.model("slope", SlopeSchema);
module.exports = Slope;
