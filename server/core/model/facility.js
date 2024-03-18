const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacilitySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  facilityType: {
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

const Facility = mongoose.model("facility", FacilitySchema);
module.exports = Facility;
