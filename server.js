/**
 * Created by fl8328 on 23/07/2018.
 */
//REQUIRED PACKAGES
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;
var url = "mongodb://localhost:27017/csdm";
var Room = require('./room');
var path = require('path');
var output = "";



//CONFIGURATION
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// //COOKIES
// app.use(function(req,res,nest){
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers','X-Requested-With, content-type, Authorization');
//     next();
// });

//LOG REQUESTS TO CONSOLE
app.use(morgan('dev'));


var currTime = new Date(); //current date
var str = "test";

var post = {
    date: currTime,
    room_ID: 'N533',
    POD_boot:false,
    proj_screen:true,
    PC_sound:true,
    ltop_plugin:true,
    ltop_sound:true,
    doc_view:true,
    mic_sound:false,
    tidy:true,
    lights:true,
    air_con:true,
    PC_boot:true,
    cables:true
};

//CONNECT TO DB
mongoose.connect(url, function (err, db) {
console.log("Connected to DB");


// *** ROUTES *** \\

//Basic route
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/views/view/test.html'));
    });

//express router
    var apiRouter = express.Router();

    apiRouter.use(function (req, res, next) {
        console.log('Someone came to the app');
        next();
    });



//ROOMS
    //localhost:8080/:name
    app.route('/:name').get(function (req, res) {
        var room = req.params.name;
        room = room.toUpperCase(); //changes room string to uppercase so it can read from db
        db.collection(room).find().toArray(function (err, result) {//search db for existing room, return err if room does not exist
            if (err) throw err;
            output = JSON.stringify(result,null,"\n");
            console.log(output);
            //res.writeHead(200, {'Content-Type': 'text/html'})
            res.sendFile(path.join(__dirname + '/views/view/index.html'));
            //res.end(output);
        });
    });



//gets all rooms localhost:8080/all
    //TODO

// START THE SERVER
    app.listen(port);
    console.log(port);
});
//localhost:8080