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
const StartEndNode = mongoose.model("StartEndNode", {
  sid: { type: String },
  x: { type: String },
  y: { type: String },
});

// Function call with updated field names
StartEndNode.insertMany([
  {
    "sid": "100S", 
    "x": 400 ,
    "y": 400 

  }, 

  {
    "sid": "100E", 
    "x": 40 ,
    "y": 900 

  }, 
  
  {
    "sid": "101E", 
    "x": 300 ,
    "y": 400 

  }, 
  
  {
    "sid": "102S", 
    "x": 350 ,
    "y": 300  

  }, 

  {
    "sid": "102E", 
    "x": 40 ,
    "y": 450  

  }, 
  
  {
    "sid": "103E", 
    "x": 600 ,
    "y": 330  

  }, 
  

  {
    "sid": "104E", 
    "x": 580 ,
    "y": 750 

  }, 

  {
    "sid": "114E", 
    "x": 650 ,
    "y": 430  

  },


  {
    "sid": "105E", 
    "x": 700 ,
    "y": 430  

  }, 

  {
    "sid": "108S", 
    "x": 800 ,
    "y": 350  

  },  



  {
    "sid": "110S", 
    "x": 1300 ,
    "y": 200  

  },  



  {
    "sid": "107E", 
    "x": 680 ,
    "y": 340  

  }, 


  {
    "sid": "106E", 
    "x": 730 ,
    "y": 410 

  }, 

  {
    "sid": "109S", 
    "x": 680 ,
    "y": 280 

  }, 

  {
    "sid": "109E", 
    "x": 820 ,
    "y": 300 

  }, 


  {
    "sid": "111E", 
    "x": 950 ,
    "y": 305 

  },	
  
  {
    "sid": "112S", 
    "x": 1300 ,
    "y": 340  

  }, 

  {
    "sid": "112E", 
    "x": 920 ,
    "y": 400 

  },
  
  {
    "sid": "113S", 
    "x": 1350 ,
    "y": 280  

  }, 

  {
    "sid": "113E", 
    "x": 1400 ,
    "y": 890 

  }
])
  .then(function () {
    console.log("Data inserted");
  })
  .catch(function (error) {
    console.log(error);
  });
