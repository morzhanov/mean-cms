/**
 * SPECIFIC PAGE POSTS ROUTES
 */

var mongoose = require('mongoose');
var Page = require('../models/page.js');
var User = require('../models/user.js');
var config = require('../../config');
var fs = require('fs');
var formidable = require('formidable');

module.exports = function (app, express) {

    /**
     * get an instance of the express router
     */
    var pagePostsRouter = express.Router();

    /**
     * Return pageRouter to app
     */
    return pagePostsRouter;

}
;