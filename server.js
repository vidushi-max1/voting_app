const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const db = require('./db');
app.use(bodyParser.json());
const userRoutes = require('./routes/userRoute');
const candidateRoutes = require('./routes/candidateRoute');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
app.get('/', function(req, res) {
    res.send('Welcome to our voting app!');
})
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(3000, () => {
    console.log("listening on port 3000");
})