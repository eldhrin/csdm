/**
 * Created by fl8328 on 24/07/2018.
 */
var mongoose = require('mongoose');
var RoomSchema = mongoose.Schema;

//schema
RoomSchema = new RoomSchema({
    date: {type:Date, required:true, index:{unique: true}},                 //generates the current datetime
    room_ID:{type:String, required:true, index:{unique: true}},             //room number
    POD_boot: {type: Boolean, required: true},                              //podium pc boot up check
    proj_screen: {type: Boolean, required: true},                           //projector screen working check
    PC_sound: {type: Boolean, required: true},                              // podium pc sound check
    ltop_plugin: {type: Boolean, required: true},                           //podium laptop plug in working check
    ltop_sound: {type: Boolean, required: true},                            //podium sound working with laptop check
    doc_view: {type: Boolean, required: true},                              //document viewer working check
    mic_sound: {type: Boolean, required: true},                             //check the mic works
    tidy: {type: Boolean, required: true},                                  //check if room is tidy generally
    lights: {type: Boolean, required: true},                                //check lights are working as intended
    air_con: {type: Boolean, required: true},                               //check air con is working
    PC_boot: {type: Boolean, required: true},                               //check all pcs in the room boot
    cables: {type: Boolean, required: true}                                 //check if cables are plugged in
});

RoomSchema.pre('save');
module.exports = mongoose.model('room',RoomSchema);