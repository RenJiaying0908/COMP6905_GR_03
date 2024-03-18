const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SkiResortSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  details: {
    type: String,
    required: false,
  },
});

const SkiResort = mongoose.model("ski_resort", SkiResortSchema);
module.exports = SkiResort;
