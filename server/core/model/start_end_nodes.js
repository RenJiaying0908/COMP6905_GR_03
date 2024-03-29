const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StartEndNodeSchema = new Schema({
  sid: { type: String },
  x: { type: String }, 
  y: { type: String },
});

const StartEndNode = mongoose.model("startendnode", StartEndNodeSchema);
module.exports = StartEndNode;
