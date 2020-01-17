'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken')

let Player = new Schema({
    name:{
        type:String,
        required:true,
        index:{unique:true}
    },
    password:{
        type:String,
        required:true
    },
    progressIndex:{
        type:Number,
        default:0
    },
    salt:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});

Player.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

Player.methods.validatePassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.password === hash;
};

Player.methods.generateAuthToken = function() {
    const player = this;
    const token = jwt.sign({name: player.name}, 'big anime tiddys');
    player.tokens = player.tokens.concat({token});
    player.save();
    return token;
};


module.exports = mongoose.model('Player',Player);
