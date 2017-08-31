/**
 *schema for site's pages
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Page model in db
var Page = new Schema({
    title: String,               //title of the page
    url:                         //The SEO-friendly alias that will be used to identify the page.
    {
        type: String,
        index: {unique: true}
    },
    contentHeader: String,      //content header of the page
    contentFooter: String,      //content footer of the page
    posts: [String],            //(array of posts ids)
    menuIndex: Number,          //defines the menu sequence of the pages in the navigation bar.
    date: Date                  //The date when this document was last updated.
});

module.exports = mongoose.model('Page', Page);