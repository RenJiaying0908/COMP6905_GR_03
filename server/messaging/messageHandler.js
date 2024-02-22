const event = require('../event');

class MessageHandler {

    constructor(){
        this.map = new Map();
        event.on("POST", (res) => {
            callback = this.map.get(res.id);
            callback(res.body);
        });
    }

    on_get_message(message, callback){
        
    }

    on_json_message(message, callback){
        this.map.set(id, callback);
        //the message will be converted to object from json.
        const id = getMessageId();
        const mes = {id: id};
        event.emit("POST", mes);
    }
}

function getMessageId() {
    // generate unique id.
}

const handler = new MessageHandler();
module.exports = handler;
