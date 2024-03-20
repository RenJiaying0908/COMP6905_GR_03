const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RouteNodeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  icon_name: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], 
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
  },
  node_type: {
    type: String,
    required: true
  }
});

RouteNodeSchema.index({ location: "2dsphere" });
const RouteNode = mongoose.model("route_node", RouteNodeSchema);
module.exports = RouteNode;
