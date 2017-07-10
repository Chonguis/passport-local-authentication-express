var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var accountSchema = new Schema({
    username: String,
    password: String
});

//Este plugin se encarga de hacerle hash al password a diferencia del útlimo tutorial
accountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', accountSchema);
