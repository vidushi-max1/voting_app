//importing mongoose
const mongoose = require('mongoose');
require('dotenv').config();

//mongoose create default object that represents mongoDB connection
//mongodbURL = 'mongodb://0.0.0.0:27017/voting' //for local database
//mongodbURL ='mongodb+srv://boombeera:boombeera7@hotel.2syffdv.mongodb.net/'   //for online 
//const mongodbURL= process.env.mongodbURL;
// const mongodbURL= process.env.mongodbURL_Local;
const mongodbURL = process.env.mongodbURL;
const db = mongoose.connect(mongodbURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

//export the database connecion
module.exports = db;