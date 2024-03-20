const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
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
  route_type: {
    type: String,
    required: true
  }
});

const Route = mongoose.model("route", RouteSchema);
module.exports = Route;