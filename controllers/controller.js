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
            Namable = mongoose.model('Namable');

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

                    Namable.find({user: player._id,uniqueID:},function(err,namable){
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
            Namable.find({user: player._id},function(err,namables){
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

       Namable.findOne({ uniqueID:req.body.uniqueID }, function (err,namable) {
           if(err) res.send(err);
           else{
               if(namable != null){
                   namable.imagePath = req.imagePath;
                   found = true;
                   namable.save();
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
    Namable.findOne({ uniqueID:req.body.uniqueID }, function (err,namable) {
        if(err) res.send(err);
        else{
            if(namable != null){
                found = true;
                res.contentType('image/jpeg');
                res.sendFile(namable.imagePath,options,function(err){if(err) throw new Error();});
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
    Namable.find({user:req.playerID},function(err,namables){
        if(err) res.send(err);
        else{
            payload.namables = namables;
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
        Namable.findOne({user:req.playerID,uniqueID:req.body.uniqueID},function(namableErr,namableFound){
            if(namableErr) res.send(namableErr);
            else {
                    if(namableFound){
                    if(req.body.name)
                        namableFound.name = req.body.name;
                    if(req.body.state)
                        namableFound.state = req.body.state;
                    if(req.body.image)
                        namableFound.image = req.body.image;
                    namableFound.save();
                    res.send("Changes saved");
                }
                else{
                    let namable = new Namable({
                        user: req.playerID,
                        uniqueID: req.body.uniqueID,
                        name: req.body.name,
                        state: req.body.state
                    });
                    namable.save(function(err,namable){
                        if(err) res.send(err);
                        res.send(namable);
                    });
                }
            }
        });
    }
    else{
        Location.findOne({user:req.playerID,uniqueID:req.body.uniqueID},function(locErr,locFound){
            if(locErr) res.send(locErr);
            else {
                if(locFound){
                    if(req.body.name)
                        locFound.name = req.body.name;
                    if(req.body.state)
                        locFound.state = req.body.state;
                    if(req.body.image)
                        locFound.image = req.body.image;
                    if(req.body.hideLocationNr)
                        locFound.hideLocationNr = req.body.hideLocationNr;
                    if(req.body.hideEntityNr)
                        locFound.hideEntityNr = req.body.hideEntityNr;
                    if(req.body.hideActionNr)
                        locFound.hideActionNr = req.body.hideActionNr;
                    locFound.save();
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
    Namable.deleteMany({user:req.playerID},function (err) {
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
    Namable.findOne({user:req.playerID,uniqueID:req.body.uniqueID}, function(err,namable){
        if(err) res.send(err);
        else {
            if(namable != null){
                if(namable.image != ""){
                    res.contentType('image/jpeg');
                    found = true;
                    res.send(namable.image);
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
     Namable.findOne({user:req.playerID,uniqueID:req.body.uniqueID}, function(err,namable){
         if(err) res.send(err);
         else {
             if(namable != null){
                 res.send(namable);
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
