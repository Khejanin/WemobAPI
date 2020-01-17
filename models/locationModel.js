'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Location = new Schema({
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Player',
        required: true
    },
    uniqueID:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    state:{
        type:String
    },
    image:{
        type:String
    },
    imagePath:{
        type:String
    },
    hideLocationNr:{
        type:Number
    },
    hideEntityNr:{
        type:Number
    },
    hideActionNr:{
        type:Number
    },
    timestamp:{
        type:Date
    }
});

module.exports = mongoose.model('Location',Location);
