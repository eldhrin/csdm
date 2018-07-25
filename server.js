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
app.route('/test').get(function (req, res) {
    mongoose.connect(url, function (err, db) {
        var test = db.collection('N424').find().toArray(function(err, result){
            if(err) throw err;
            console.log(result);
            res.json(test);
            str = JSON.stringify(test);
        });
        res.json({message: str});
        db.close();
    });
});
//web port for db is localhost 28017
//     if (err) {
//         console.log("Unable to connect to db", err);
//     }
//     else {
//         var ins = db.collection('N431');
//         console.log("Connection successful");
//         ins.collection.save(post, function (err, result) {
//             if (err) {
//                 console.log("Error", err);
//             }
//             else {
//                 console.log("Success, inserted into collection ", result.length, result)
//             }
//         });
//     }
// })


// *** ROUTES *** \\

//Basic route
    app.get('/', function (req, res) {
        res.send('Welcome to the home page!');
    });

//express router
    var apiRouter = express.Router();

    apiRouter.use(function (req, res, next) {
        console.log('Someone came to the app');
        next();
    });

//TEST ROUTE localhost:8080/api
    apiRouter.get('/', function (req, res) {
        res.json({message: 'Welcome to the api'});
    });

//REGISTER THE ROUTES
    app.use('/api', apiRouter);


//gets all rooms localhost:8080/api/rooms
    apiRouter.route('/rooms')
        .get(function (req, res) {
            Room.find({}, function (err, rooms) {
                if (err) res.send(err);

                res.json(rooms);
            })
        });

// START THE SERVER
    app.listen(port);
    console.log(port);

//localhost:8080