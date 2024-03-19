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


 //slopes
//  const connections = [
//   { from: 1, to: 2, color: 'green' },
//   { from: 1, to: 3, color: 'green'},
//   { from: 2, to: 4, color: 'green' },
//   { from: 1, to: 5, color: 'green' },
//   { from: 3, to: 6, color: 'green' },
//   { from: 2, to: 7, color: 'green' },
//   { from: 3, to: 8, color: 'green' },
//   { from: 5, to: 9, color: 'green' },

// ];