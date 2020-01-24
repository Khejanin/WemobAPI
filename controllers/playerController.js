'use strict';

var mongoose = require('mongoose'),
    Player = mongoose.model('Player');

exports.login = function(req,res){
    Player.findOne({name:req.body.name},function(err,player){
        if(err)
            res.send(err);
        else{
            if(player && player.validatePassword(req.body.password)){
                res.send(player.generateAuthToken());
            }
            else res.send("Could not authenticate player");
        }
    });
};

exports.register = function(req,res){
    const player = new Player({name : req.body.name});
    player.setPassword(req.body.password);

    player.save(function(err,player){
        if(err)
            res.send(err);
        else{
            res.send(player.generateAuthToken());
        }
    });
};

exports.list_players = function(req,res){
    Player.find({},function(err,player){
        if(err) res.send(err);
        res.json(player);
    });
};
