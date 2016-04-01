//grab packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bncrypt = require('bcrypt-nodejs');

//user schema
var AdminUser = new Schema(
    {
        name: String,
        username: {type: String, required: true, index: {unique:true}},
        password: {type: String, required: true, select: false}
    });

//hash password before user is saved
AdminUser.pre('save', function(next)
{
    var user = this;

    //hash the password only if the password has been chaged or user is new
    if(!user.isModified('password')) return next();

    //generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash)
    {
        //change the password to the hashed version
        user.password = hash;
        next();
    });

});

//methid to compare a given password with the database hash
AdminUser.methods.comparePassword = function(password)
{
    var user = this;

    return bncrypt.compareSync(password, user.password);
};

//return the model
module.exports = mongoose.model('User', AdminUser);