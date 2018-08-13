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
var name = "";



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

// var post = {
//     date: currTime,
//     room_ID: 'N533',
//     POD_boot:false,
//     proj_screen:true,
//     PC_sound:true,
//     ltop_plugin:true,
//     ltop_sound:true,
//     doc_view:true,
//     mic_sound:false,
//     tidy:true,
//     lights:true,
//     air_con:true,
//     PC_boot:true,
//     cables:true
// };

//CONNECT TO DB
mongoose.connect(url, function (err, db) {
console.log("Connected to DB");


// *** ROUTES *** \\

//Basic route
    app.get('/t', function (req, res) {
        res.sendFile(path.join(__dirname + '/views/view/index.html'));
    });

//express router
    var apiRouter = express.Router();

    apiRouter.use(function (req, res, next) {
        console.log('Someone came to the app');
        next();
    });



//ROOMS
    //localhost:8080/:name/show
    app.route('/:name/show').get(function (req, res) {
        var room = req.params.name;
        name = room;
        room = room.toUpperCase(); //changes room string to uppercase so it can read from db
        db.collection(room).find().toArray(function (err, result) {//search db for existing room, return err if room does not exist
            if (err) throw err;
            output = JSON.stringify(result,null,"\n");
            console.log(output);
            //res.writeHead(200, {'Content-Type': 'text/html'})
            res.sendFile(path.join(__dirname + '/views/view/test.html'));
            res.end(output);
        });
    });

    app.get('/:name', function(req,res){
        name = req.params.name;
        name = name.toUpperCase();
        res.sendFile(path.join(__dirname + '/views/view/index.html'));
    });

    app.post('/add', function(req,res,next){
        db.collection(name).insert({

            date        : currTime,
            room_ID     : name,
            POD_boot    : req.body.POD_boot,
            proj_screen : req.body.proj_screen,
            PC_sound    : req.body.PC_sound,
            ltop_plugin : req.body.ltop_plugin,
            ltop_sound  : req.body.ltop_sound,
            doc_view    : req.body.doc_view,
            mic_sound   : req.body.mic_sound,
            tidy        : req.body.tidy,
            lights      : req.body.lights,
            air_con     : req.body.air_con,
            PC_boot     : req.body.PC_boot,
            comments    : req.body.comments

            }
            ,function(err, result){
            res.sendFile(__dirname + '/views/view/test.html');
            console.log("item successfully added");
            res.end("Successfully Added");
        });
    });


//gets all rooms localhost:8080/all
    //TODO

// START THE SERVER
    app.listen(port);
    console.log(port);
});
//localhost:8080