const express = require('express');
const path = require('path');
const cors = require('cors');
const messageHandler = require('./messaging/messageHandler');
const react_app = express();
const server_app = express();

const SkiResortController = require("./core/controller/ski_resort_controller");
const SkillLevelController = require("./core/controller/skill_level_controller");
const SkierController = require("./core/controller/skier_controller");
const FacilityController = require("./core/controller/facility_controller");



html_port = process.env.PORT || 3000;
server_port = process.env.SERVER_PORT || 3001;

react_app.use(express.static(path.join(__dirname, '..', 'build/my-app/build')));
server_app.use(express.json());
server_app.use(cors());
require('./core/db')();

server_app.get('/ping_server', (req, res) => {
    res.json({
        "message":"server running..."
    });
});

//create SKI Resort
server_app.post('/create_resort', SkiResortController.addSkiResort);

//create Skill Levels
server_app.post('/add_skill_level', SkillLevelController.addSkillLevel);

//create skier
server_app.post('/create_skier', SkierController.addSkier);

//create new facility
server_app.post('/create_facility', FacilityController.addFacility);

//fetch all facilities
server_app.get('/get_facilities', FacilityController.getAllFacilities);



//handle get-data request, the result will be json string.
server_app.get('/get-data', (req, res) => {
    //TODO, specify the req sub-type
    messageHandler.on_get_message(req.query, (result)=>{
        //res.json(result);
    });
});

//handle post message
server_app.post('/submit-data', express.json(), (req, res) => {
    const data = req.body;
    messageHandler.on_json_message(data, (result) => {
        res.json(result);
    });
});

server_app.listen(server_port, () => {
    console.log(`Server listening on port ${server_port}!`);
})

react_app.listen(html_port, () => {
    console.log(`React web app listening on port ${html_port}!`);
});

//the entrance of web app is 'index.html' in 'build' folder
react_app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build/my-app/build', 'index.html'));
});

//Run app, then load http://localhost:port in a browser to see the output.
