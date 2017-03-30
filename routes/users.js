var express = require("express");
var router = express.Router();
var poll = require("../models/poll.js");
var user = require("../models/user.js");

router.get("/user/:id", function(req, res) {
    var userPolls;
    //pull polls from database
    user.findById(req.params.id, function(err, user) { //user retrieved from database
        if (err) {
            userPolls = "error occured, please try again later";
        } else {
            userPolls = user.posts;
            userPolls = (userPolls.length === 0) ? "User hasn't created a poll yet" : userPolls;
        }

        //obj to send info about user
        let userObj = {
            username: user.username,
            id: user._id
        };

        res.render("profile.ejs", { polls: userPolls, profile: userObj });
    });
});


module.exports = router;