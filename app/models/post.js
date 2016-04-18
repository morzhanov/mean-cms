/**
 *schema for site's pages
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Page model in db
var Post = new Schema({
    //title of the post
    title: String,
    //The id of parent page
    page: Number,
    //content of the post
    content: String,
    //The date when this document was last updated.
    date: Date
});

var Post = mongoose.model('Post', Post);

module.exports = Post;