const event = require('../event');
const routing_controller = require('../core/controller/routing_controller');
class MessageHandler {

    constructor(){
        this.map = new Map();
        event.on("POSTRESP", (res) => {
            console.log("POSTRESP received.");
            const callback = this.map.get(res.id);
            if(callback)
            {
                callback(res.body);
            }else{
                console.log("callback not found for msg id: " + res.id);
            }
        });
    }

    on_get_message(message, callback){
        
    }

    on_json_message(data, callback){
        const id = getMessageId();
        this.map.set(id, callback);
        //the message will be converted to object from json.
        const mes = {
            id: id,
            data: data
        };
        event.emit("POST", mes);

        //for test
        //console.log("received client data: "+data.username);
        //const res = {
        //    key: "this is message from the server!"
        //}
        //console.log("messageHandler received a message, will send test message back to client.");
        //callback(res);
    }
}

function getMessageId() {
    // generate unique id.
    return Date.now();
}

const handler = new MessageHandler();
module.exports = handler;
