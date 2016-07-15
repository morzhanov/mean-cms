//grab packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bncrypt = require('bcrypt-nodejs');

//user schema
var User = new Schema(
    {
        name: String,
        surname: String,
        email: String,
        site: String,
        // role: String,       //user role (public, admin)
        // photo: String,      //url to user photo
        password: {type: String, required: true},
        token: {type: String, required: true}
    });

//hash password before user is saved
    User.pre('save', function (next) {
        var user = this;

        //hash the password only if the password has been changed or user is new
        if (!user.isModified('password')) return next();

        //generate the hash
        bncrypt.hash(user.password, null, null, function (err, hash) {
            //change the password to the hashed version
            user.password = hash;
            next();
        });

    });

//method to compare a given password with the database hash
    User.methods.comparePassword = function (password) {
        var user = this;

        return bncrypt.compareSync(password, user.password);
    };

//return the model
    module.exports = mongoose.model('User', User);