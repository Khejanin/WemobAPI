'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Entity = new Schema({
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
    timestamp:{
      type:Date
    }
});

module.exports = mongoose.model('Entity',Entity);
