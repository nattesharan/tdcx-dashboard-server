const express = require('express');

var cors = require('cors');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

const app = express();

const port = process.env.PORT || 4001;

const routes = require('./routes/routes');

app.use(logger('dev'));
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/tdcx-task', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.once('open', ()=>{
    console.log("connected to database");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
};
app.use(cors(corsOptions));

const server = require('http').createServer(app);

routes(app);

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

server.listen(port, "0.0.0.0", function () {
    console.log('Server started on port:' + port)
});