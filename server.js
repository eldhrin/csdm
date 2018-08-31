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
var url = "mongodb://localhost:27017/csdm"; //localDB
var Room = require('./room');
var path = require('path');
var tableify = require('tableify');
var output = "";
var name = "";
var bool = false;
var dbList = ['N533', 'N530', 'N529', 'N528', 'N527', 'N525', 'N519', 'N431', 'N430', 'N428A', 'N427', 'N424']; //HACKY



//CONFIGURATION
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



//LOG REQUESTS TO CONSOLE
app.use(morgan('dev'));


var currTime = new Date(); //current date
var str = "test";


//test data
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

//TEST ROUTE
    app.get('/t', function (req, res) {
        res.sendFile(path.join(__dirname + '/views/view/test.html'));
    });

//express router
    var apiRouter = express.Router();

    apiRouter.use(function (req, res, next) {
        console.log('Someone came to the app');
        next();
    });


//ROOMS
    //shows data from the selected room
    //localhost:8080/:name/show
    app.route('/:name/show').get(function (req, res) {


        name = req.params.name;
        var test = "";
        name = name.toUpperCase(); //changes room string to uppercase so it can read from db
        isColl(name);
        //bool is true, collection exists so data can be shown
        if(bool === true){
            db.collection(name).find().toArray(function (err, result) {//search db for existing room, return err if room does not exist
                if (err) throw err;
                var resu = tableify(result); // TABLEIFY
                output = JSON.stringify(result, null, "\n"); //output converted from JSON array to string
                console.log(output);
                console.log(resu);
                res.sendFile(path.join(__dirname + '/views/view/index.html'));// output sent to test.html to display
               // res.end(output);
                res.end(resu);
            });
        }
        //if bool is false, no collection with the name exists
        else{
            res.end("Room does not exist");
            console.log("Room does not exist");
        }
    });



    //add data for the room
    app.get('/:name', function(req,res){
        name = req.params.name;
        name = name.toUpperCase();
        isColl(name);
        if(bool === true) {
            res.sendFile(path.join(__dirname + '/views/view/index.html'));
        }
        else{
            res.end("Room does not exist");
            console.log("Room does not exist");
        }
    });

    //posts data to the db and relevant collection
    app.post('/add', function(req,res,next) {
        isColl(name);
        if (bool === true) {
            //gets values from html form and inserts in db
            db.collection(name).update({},
                {$set: {
                    "date": currTime,
                    "POD_boot": req.body.POD_boot,
                    "proj_screen": req.body.proj_screen,
                    "PC_sound": req.body.PC_sound,
                    "ltop_plugin": req.body.ltop_plugin,
                    "ltop_sound": req.body.ltop_sound,
                    "doc_view": req.body.doc_view,
                    "mic_sound": req.body.mic_sound,
                    "tidy": req.body.tidy,
                    "lights": req.body.lights,
                    "air_con": req.body.air_con,
                    "PC_boot": req.body.PC_boot,
                    "comments": req.body.comments
                }}, {multi:true});
                    res.sendFile(__dirname + '/views/view/test.html');
                    console.log("item successfully updated");
                    res.end("Successfully Updated");
                }
        else {
            res.send("Room does not exist");
            console.log("Room does not exist");
        }
    });

    //check if the name of the room is in the collection
    function isColl(name){
        //loops through array of possible room names
        //HACKY, SHOULD LOOK THROUGH COLLECTIONS IN DB
        for(var i = 0; i< dbList.length; i++){
            if(name === dbList[i]){
                bool = true;
                break;
            }
        }
        //bool is false otherwise
        return bool;
    }


// START THE SERVER
    app.listen(port);
    console.log(port);
});
//localhost:8080