var express = require("express");
var router = express.Router();
var poll = require("../models/poll.js");
var user = require("../models/user.js");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect("/login");
    }
}

router.get("/", function(req, res) {
    var renderObj;
    //pull polls from database
    poll.find({}, function(err, pollsArray) {
        renderObj = (err) ? "error" : pollsArray;
        res.render("index.ejs", { polls: renderObj, user: req.user });
    });
});

router.get("/poll/new", isLoggedIn, function(req, res) {
    res.render("poll/new.ejs");
});

router.post("/poll", isLoggedIn, function(req, res) {
    let data = req.body;

    let results = [];

    //generate results (starts at 0)
    for (let i = 0; i < data.options.length; i++) {
        results.push(0);
    }
    data.results = results;

    poll.create(data, (err, newPoll) => {
        if (err) {
            console.log(err);
        } else {
            //Add author to the poll
            newPoll.author.id = req.user._id;
            newPoll.author.username = req.user.username;

            newPoll.save();

            //add poll to users created polls list
            user.findById(req.user._id, (err, user) => { //user passed in function is user object retrieved from database
                if (err) {
                    console.log(err);
                } else {
                    let pollRef = {
                        title: newPoll.title,
                        _id: newPoll._id
                    };
                    user.posts.push(pollRef);
                    user.save();
                }

            });
        }
    });

    // redirect will be used by ajax success function to change window.location (redirect)
    res.json({ status: 200, redirect: "/" });
});


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
            username: user.username
        };

        res.render("profile.ejs", { polls: userPolls, profile: userObj });
    });
});


router.get("/poll/:id", function(req, res) {
    var renderObj;
    poll.findById(req.params.id, function(err, obj) {
        if (err) {
            console.log("Error", err);
            renderObj = "error";
        } else {
            renderObj = obj;
        }
        res.render("poll/poll.ejs", { poll: renderObj });
    });
});

module.exports = router;