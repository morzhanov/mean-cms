/**
 *schema for site's pages
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Page model in db
var Page = new Schema({
    //title of the page
    title: String,
    //The SEO-friendly alias that will be used to identify the page.
    url: {type: String, index:{unique:true}},
    //content of the page
    content: String,
    //defines the menu sequence of the pages in the navigation bar.
    menuIndex: Number,
    //The date when this document was last updated.
    date: Date
});

var Page = mongoose.model('Page', Page);

module.exports = Page;