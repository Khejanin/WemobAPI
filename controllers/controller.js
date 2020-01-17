'use strict';
const jwt = require('jsonwebtoken');
let path = require('path');
const multer = require('multer');
const fs = require('fs');
let helpers = require('../middleware/helpers');
let index = require('../index');
var mongoose = require('mongoose'),
    Player = mongoose.model('Player'),
        Location = mongoose.model('Location'),
            Entity = mongoose.model('Entity');

/*exports.save = function(req,res){
    let player;
    try {
        const headerData = req.header('Authorization');
        if(!headerData) {
            throw new Error('No authorization provided. Expecting bearer token!');
        }
        const token = headerData.replace('Bearer ', '');
        const data = jwt.verify(token, 'big anime tiddys');
        player = Player.findOne({ name: data.name, 'tokens.token': token},function(err,player){
                if(err) throw new Error();
                else{
                    let exists = false;

                    let body = req.body;
                    player.progressIndex = body.progress;
                    player.save();

                    let namables = body.namables;

                    let locations = body.locations;

                    Entity.find({user: player._id,uniqueID:},function(err,namable){
                        console.log(namable);
                    });
                }
            });
        if (!player) {
            throw new Error();
        }
        else{






        }
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource', message: error.message});
    }


};

exports.load = function(req,res){
    console.log(splitBody[0]);

    console.log(splitBody[1]);

    Player.findOne({ name: data.name, 'tokens.token': token},function(err,player){
        if(err) res.send(err);
        else{
            Entity.find({user: player._id},function(err,namables){
                console.log(namables);
            });
        }
    });

    console.log(splitBody[2]);

    let Progress = new Progress({

    });
};
*/


exports.upload = function(req,res){
       let found = false;

       let upload = multer({ storage: index.storage, fileFilter: helpers.imageFilter }).single('test');

       Entity.findOne({ uniqueID:req.body.uniqueID }, function (err,entity) {
           if(err) res.send(err);
           else{
               if(entity != null){
                   entity.imagePath = req.imagePath;
                   found = true;
                   entity.save();
                   res.send("file upload successful");
               }else{
                   Location.findOne({ uniqueID:req.body.uniqueID }, function (err,loc) {
                       if(err) res.send(err);
                       else{
                           if(loc != null){
                               loc.imagePath = req.imagePath;
                               found = true;
                               loc.save();
                               res.send("file upload successful");
                           }
                           else res.send("No Entity with specified Index could be found");
                       }
                   });
               }
           }
       });
};

//This is the new way to get pictures now
exports.download = function(req,res){
    let options = {
        root: path.join(index.__basedir, 'uploads'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    let found = false;

    try{
    Entity.findOne({ uniqueID:req.body.uniqueID }, function (err,entity) {
        if(err) res.send(err);
        else{
            if(entity != null){
                found = true;
                res.contentType('image/jpeg');
                res.sendFile(entity.imagePath,options,function(err){if(err) throw new Error();});
            }else{
                Location.findOne({ uniqueID:req.body.uniqueID }, function (err,loc) {
                    if(err) res.send(err);
                    else{
                        if(loc != null){
                            found = true;
                            res.sendFile(loc.imagePath,options,function(err){if(err) throw new Error();});
                        }
                        else res.send("No Entity with specified Index could be found");
                    }
                });
            }
        }
        });
    }
    catch (error){
        console.log("An Error Occured while doing file download things");
    }
};

exports.getAll = function(req,res){
    let payload = {};
    Entity.find({user:req.playerID},function(err,entities){
        if(err) res.send(err);
        else{
            payload.namables = entities;
            Location.find({user:req.playerID},function(err,loc){
                if(err) res.send(err);
                payload.locations = loc;
                res.send(payload);
            });
        }
    });
};

exports.addOrUpdate = function(req,res){
    if(req.body.isNamable){
        Entity.findOne({user:req.playerID,uniqueID:req.body.uniqueID},function(err,entity){
            if(err) res.send(err);
            else {
                    if(entity){
                    if(req.body.name)
                        entity.name = req.body.name;
                    if(req.body.state)
                        entity.state = req.body.state;
                    if(req.body.image)
                        entity.image = req.body.image;
                    entity.save();
                    res.send("Changes saved");
                }
                else{
                    let newEntity = new Entity({
                        user: req.playerID,
                        uniqueID: req.body.uniqueID,
                        name: req.body.name,
                        state: req.body.state
                    });
                        newEntity.save(function(err,e){
                        if(err) res.send(err);
                        res.send(e);
                    });
                }
            }
        });
    }
    else{
        Location.findOne({user:req.playerID,uniqueID:req.body.uniqueID},function(err,loc){
            if(err) res.send(err);
            else {
                if(loc){
                    if(req.body.name)
                        loc.name = req.body.name;
                    if(req.body.state)
                        loc.state = req.body.state;
                    if(req.body.image)
                        loc.image = req.body.image;
                    if(req.body.hideLocationNr)
                        loc.hideLocationNr = req.body.hideLocationNr;
                    if(req.body.hideEntityNr)
                        loc.hideEntityNr = req.body.hideEntityNr;
                    if(req.body.hideActionNr)
                        loc.hideActionNr = req.body.hideActionNr;
                    loc.save();
                    res.send("Changes saved");
                }
                else{
                    let location = new Location(
                        {
                            user: req.playerID,
                            uniqueID: req.body.uniqueID,
                            name: req.body.name,
                            state: req.body.state,
                            hideLocationNr: req.body.hideLocationNr,
                            hideEntityNr:req.body.hideEntityNr,
                            hideActionNr:req.body.hideActionNr
                        });
                    location.save(function(err,loc){
                        if(err) res.send(err);
                        res.send(loc);
                    });
                }}
        });
    }
};

exports.clear = function(req,res){
    Entity.deleteMany({user:req.playerID},function (err) {
        if(err) res.send(err);
        else Location.deleteMany({user:req.playerID},function (err) {
            if(err) res.send(err);
            else res.send("Cleared Successfully");
        });
    });
};


//Deprecated
exports.getPhoto = function(req,res){
    let found = false;
    Entity.findOne({user:req.playerID,uniqueID:req.body.uniqueID}, function(err,entity){
        if(err) res.send(err);
        else {
            if(entity != null){
                if(entity.image != ""){
                    res.contentType('image/jpeg');
                    found = true;
                    res.send(entity.image);
                }
                else res.send("This Entity does not have an Image Yet!");
            }
        }
    });
    if(!found) {
        Location.findOne({user: req.playerID, uniqueID: req.body.uniqueID}, function (err, loc) {
            if (err) res.send(err);
            else {
                if (loc != null) {
                    if (loc.image != "") {
                        res.contentType('image/jpeg');
                        found = true;
                        res.send(loc.image);
                    } else res.send("This Entity does not have an Image Yet!");
                }
            }
        });
    }
    if(!found){
        res.send("No Entity with specified Index could be found");
    }
};

exports.getEntity = function(req,res){
     let found = false;
     Entity.findOne({user:req.playerID,uniqueID:req.body.uniqueID}, function(err,entity){
         if(err) res.send(err);
         else {
             if(entity != null){
                 res.send(entity);
             }
             else{
                 Location.findOne({user: req.playerID, uniqueID: req.body.uniqueID}, function (err, loc) {
                     if (err) res.send(err);
                     else {
                         if (loc != null) {
                             res.send(loc);
                         }
                         else{
                             res.send("No Entity with specified Index could be found");
                         }
                     }
                 });
             }
         }
     });
};
