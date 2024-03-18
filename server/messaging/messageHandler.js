const event = require('../event');
const constants = require('./raw');
const routing_controller = require('../core/controller/routing_controller');
class MessageHandler {

    constructor(){
        this.map = new Map();
        event.on(constants.EVENT_OUT, (res) => {
            console.log("POSTRESP received.");
            console.log(res);
            const callback = this.map.get(res.id);
            if(callback)
            {
                console.log("callback found");
                callback(res.data);
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
        event.emit(constants.EVENT_IN, mes);

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
