const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LiftSchema = new Schema({
  name: { type: String },
  fromNode: { type: String }, 
  toNode: { type: String },
  color: { type: String },
  time: { type: Number },
});

const Lift = mongoose.model("lift", LiftSchema);
module.exports = Lift;
