const event = require('../../event');

class Example{
    constructor(){
        event.on("POST", (mes) => {
            console.log("post message received, id: ", mes.id, ", type: ", mes.data.type);
        });

    }
}

module.exports = Example;
