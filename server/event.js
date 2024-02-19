// eventBus.js
const EventEmitter = require('events');
class EventBus extends EventEmitter {}
const event = new EventBus();
module.exports = event;
