const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('Connection to MongoDB Atlas Established!');
});

mongoose.connect(
    'mongodb+srv://bkantwi:' + process.env.MONGO_ATLAS_PW + '@cluster0.79szhc1.mongodb.net/?retryWrites=true&w=majority'
  );

  mongoose.Promise = global.Promise
  

// hot reload without manually restarting server
app.use(morgan('dev'));

// Make the uploads folder public for files
app.use('/uploads', express.static('uploads'));

// body parser for url encoded data and json data
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Handle cors errors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Handle errors
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;