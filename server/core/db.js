const mongoose = require('mongoose');
require('dotenv').config()

// PORT=3001
// MONGO_URL=
// DB_NAME=
// DB_USER=root
// DB_PASSWORD=Adm1nMongo

module.exports = () => {
    mongoose.connect('mongodb+srv://cluster0.gqhh6kg.mongodb.net/',{
    dbName: 'ski_db',
    user: 'root',
    pass: 'Adm1nMongo'
}).then(function () {
    console.log('Mongo Database connected');
});

mongoose.connection.on('connected', () => {
    console.log('Mongo Database connecting...');
});

mongoose.connection.on('error', error => {
    console.log(error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongo Database Disconnected');
});

}