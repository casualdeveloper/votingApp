var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    posts: [{
        _id: {
            ref: "post",
            type: mongoose.Schema.Types.ObjectId
        },
        title: String
    }]
});

userSchema.plugin(passportLocalMongoose);

var user = mongoose.model("user", userSchema);

module.exports = user;