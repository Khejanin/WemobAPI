'use strict';

module.exports = function(app) {
    var gameController = require('../controllers/controller');
    var tokenAuthenticator = require('../middleware/tokenAuthenticator');
    var index = require('../index');

    // todoList Routes


    app.route('/listNamables').get(gameController.getAll);

    app.route('/entity').post(tokenAuthenticator.authenticate,gameController.addOrUpdate).get(tokenAuthenticator.authenticate,gameController.getEntity);
    app.route('/entities').get(tokenAuthenticator.authenticate,gameController.getAll).delete(tokenAuthenticator.authenticate,gameController.clear);

    app.route('/upload').post(tokenAuthenticator.authenticate,index.upload.single('picture'),gameController.upload);
    app.route('/getImage').get(tokenAuthenticator.authenticate,gameController.download);

    app.route('/clearAll').delete(gameController.clearEverything);

    app.route('/getPhoto').get(gameController.getPhoto);

};
