let express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Player = require('./models/playerModel'), //created model loading here
    Namable = require('./models/namableModel'), //created model loading here
    Location = require('./models/locationModel')
    bodyParser = require('body-parser');
    path = require('path');
    const multer = require('multer');

app.set('view engine', 'pug');

app.use(express.static('./public'));

// SET STORAGE
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        req.body.uniqueID = req.header('entityid');
        req.imagePath = req.playerID + "_" + req.body.uniqueID + path.extname(file.originalname);
        cb(null, req.imagePath);
    }
});

let upload = multer({ storage: storage });

module.exports.upload = upload;
module.exports.storage = storage;
module.exports.__basedir = __dirname;

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/INPRODB',{ useNewUrlParser: true } );


app.use(bodyParser.raw({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let playerRoutes = require('./routes/playerRoute'); //importing route
playerRoutes(app); //register the route
let gameRoutes = require('./routes/gameRoutes');
gameRoutes(app);

app.get('/', (req, res) => {
    Namable.find({},function(err,namableQuery){
        if(err) res.send(err);
        else {
            Location.find({},function (err,locationQuery){
                if(err) res.send(err);
                else{
                    res.render('index',{
                        title:'Hoem',
                        namables: namableQuery,
                        locations: locationQuery
                    });
                }
            });
        }
    })
});

app.get('/profile', (req, res) => {
    Namable.findOne({_id:req.query.id},function(err,namable){
        if(err) res.send(err);
        else{
            if(namable) {
                res.render('namable', {
                    title: `About ${namable.name}`,
                    namable: namable
                });
            }
            else{
                Location.findOne({_id:req.query.id},function(err,location){
                    if(err) res.send(err);
                    else if(location){
                        res.render('namable', {
                            title: `About ${location.name}`,
                            namable: location
                        });
                    }
                    else res.send("Entity could not be found");
                });
            }
        }
    });
});

app.listen(port);


console.log('todo list RESTful API server started on: ' + port);
