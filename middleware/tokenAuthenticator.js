'use strict';

const jwt = require('jsonwebtoken');
const player = require('../models/playerModel');

exports.authenticate = function(request, response, next) {
    try {
        const headerData = request.header('Authorization');
        if(!headerData) {
            throw new Error('No authorization provided. Expecting bearer token!');
        }
        const token = headerData.replace('Bearer ', '');
        const data = jwt.verify(token, 'big anime tiddys');
        const retrievedPlayer = player.findOne({ name: data.name, 'tokens.token': token }, function (err,player) {
            if(err) res.send(err);
            else {
                if(player)
                    request.playerID = player._id;
                next();
            }
        });
        if (!retrievedPlayer) {
            throw new Error();
        }
    } catch (error) {
        response.status(401).send({ error: 'Not authorized to access this resource', message: error.message});
    }
};

