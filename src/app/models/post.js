/**
 *schema for site's pages
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Page model in db
var Post = new Schema({
    title: String,            //title of the post
    content: String,          //content of the post
    date: Date                //the date when this document was last updated.
});

module.exports = mongoose.model('Post', Post);