/**
 * Module dependencies
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// image schema
var Image = new Schema({
    img: { url: String }
});

//return the model
module.exports = mongoose.model('Image', Image);