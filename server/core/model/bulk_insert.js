const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://cluster0.gqhh6kg.mongodb.net/", {
    dbName: "ski_db",
    user: "root",
    pass: "Adm1nMongo",
  })
  .then(function () {
    console.log("Mongo Database connected");
  });

// Updated User model to include 'fromNode' and 'toNode' instead of 'startNode' and 'endNode'
const Slope = mongoose.model("Slope", {
  id: { type: Number },
  name: { type: String },
  fromNode: { type: String },
  toNode: { type: String },
  color: { type: String },
  length: { type: Number },
});

// Function call with updated field names
Slope.insertMany([
  {
    id: 1,
    name: "Kornockabfahrt",
    fromNode: "110S",
    toNode: "105E",
    color: "blue",
    length: 2350,
  },

  {
    id: 2,
    name: "Hirschkogelabfahrt",
    fromNode: "112S",
    toNode: "105E",
    color: "red",
    length: 800,
  },

  {
    id: 3,
    name: "Pauliabfahrt",
    fromNode: "112S",
    toNode: "105E",
    color: "red",
    length: 1300,
  },

  {
    id: 4,
    name: "MAPAKI Familienabfahrt",
    fromNode: "112S",
    toNode: "105E",
    color: "red",
    length: 1100,
  },

  {
    id: 5,
    name: "Engländerabfahrt",
    fromNode: "108S",
    toNode: "105E",
    color: "red",
    length: 300,
  },

  {
    id: 6,
    name: "Übungswiesenabfahrt links",
    fromNode: "107E",
    toNode: "108S",
    color: "red",
    length: 400,
  },

  {
    id: 7,
    name: "Übungswiesenabfahrt rechts",
    fromNode: "108S",
    toNode: "107E",
    color: "blue",
    length: 500,
  },

  {
    id: 9,
    name: "Abfahrt Hüttenexpress",
    fromNode: "109E",
    toNode: "111E",
    color: "red",
    length: 400,
  },

  {
    id: 12,
    name: "Panoramaabfahrt",
    fromNode: "109S",
    toNode: "109E",
    color: "red",
    length: 950,
  },

  {
    id: 13,
    name: "Ländereckabfahrt",
    fromNode: "109E",
    toNode: "107E",
    color: "blue",
    length: 400,
  },

  {
    id: 14,
    name: "Schafalmabfahrt",
    fromNode: "113S",
    toNode: "113E",
    color: "red",
    length: 1350,
  },

  {
    id: 15,
    name: "Schafnase",
    fromNode: "113S",
    toNode: "113E",
    color: "black",
    length: 600,
  },

  {
    id: 17,
    name: "Lampelabfahrt",
    fromNode: "112S",
    toNode: "113E",
    color: "blue",
    length: 400,
  },

  {
    id: 18,
    name: "Märchenwaldabfahrt",
    fromNode: "100S",
    toNode: "104E",
    color: "blue",
    length: 1900,
  },

  {
    id: 19,
    name: "Zirbenwaldabfahrt",
    fromNode: "100S",
    toNode: "104E",
    color: "red",
    length: 1200,
  },

  {
    id: 20,
    name: "FIS - Abfahrt",
    fromNode: "100S",
    toNode: "100E",
    color: "red",
    length: 2150,
  },

  {
    id: 21,
    name: "Eisenhutabfahrt",
    fromNode: "100S",
    toNode: "100E",
    color: "red",
    length: 1550,
  },

  {
    id: 22,
    name: "Seitensprung",
    fromNode: "100S",
    toNode: "102E",
    color: "red",
    length: 800,
  },

  {
    id: 23,
    name: "Schwarzseeabfahrt",
    fromNode: "102S",
    toNode: "102E",
    color: "red",
    length: 1450,
  },

  {
    id: 24,
    name: "Weitentalabfahrt",
    fromNode: "102S",
    toNode: "102E",
    color: "red",
    length: 1400,
  },

  {
    id: 25,
    name: "Abfahrt Sonnenbahn",
    fromNode: "102S",
    toNode: "103E",
    color: "red",
    length: 830,
  },

  {
    id: 26,
    name: "Wildkopfabfahrt",
    fromNode: "100S",
    toNode: "114E",
    color: "blue",
    length: 700,
  },

  {
    id: 28,
    name: "Skiweg zur Zirbenwaldbahn",
    fromNode: "114E",
    toNode: "104E",
    color: "blue",
    length: 300,
  },

  {
    id: 31,
    name: "Skiweg zur Turrachbahn",
    fromNode: "102E",
    toNode: "100E",
    color: "blue",
    length: 2100,
  },

  {
    id: 32,
    name: "Skiweg zur Sonnenbahn",
    fromNode: "103E",
    toNode: "100S",
    color: "blue",
    length: 1250,
  },

  {
    id: 33,
    name: "Ski - Rodelweg",
    fromNode: "102S",
    toNode: "103E",
    color: "blue",
    length: 880,
  },

  {
    id: 36,
    name: "Alibi für Seitensprung",
    fromNode: "100S",
    toNode: "101E",
    color: "blue",
    length: 650,
  },

  {
    id: 38,
    name: "Verbindungspiste Engländer-Kornock",
    fromNode: "100S",
    toNode: "100E",
    color: "blue",
    length: 400,
  },

  {
    id: 39,
    name: "Verbindungspiste Kornock-Wildkopf",
    fromNode: "100S",
    toNode: "104E",
    color: "black",
    length: 400,
  },
])
  .then(function () {
    console.log("Data inserted");
  })
  .catch(function (error) {
    console.log(error);
  });
