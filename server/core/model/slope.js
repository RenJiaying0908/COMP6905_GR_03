const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlopeSchema = new Schema({
  fromNode: {
    type: Schema.Types.ObjectId, 
    ref: 'route_node',
    required: true,
  },
  toNode: {
    type: Schema.Types.ObjectId, 
    ref: 'route_node', 
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const Slope = mongoose.model("slope", SlopeSchema);
module.exports = Slope;