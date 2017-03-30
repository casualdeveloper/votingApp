var express = require("express");
var router = express.Router();
var poll = require("../models/poll.js");
var user = require("../models/user.js");
var mongoose = require("mongoose");

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

router.delete("/poll/:id", checkPollOwnership, function(req, res) {
    //delete poll from database
    poll.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/user/" + req.user._id);
        } else {
            //delete poll from the list of all polls that user created 
            let objId = mongoose.Types.ObjectId(req.params.id);
            for (let i = 0; i < req.user.posts.length; i++) {
                if (req.user.posts[i]._id.equals(objId)) {
                    req.user.posts.splice(i, 1);
                    req.user.save();
                    break;
                }
            }
            res.redirect("/user/" + req.user._id);
        }
    });
});

function checkPollOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        poll.findById(req.params.id, function(err, foundPoll) {
            if (err) {
                res.redirect("/user/" + foundPoll.author.id);
            } else {
                if (foundPoll.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("/user/" + foundPoll.author.id);
                }
            }
        });
    } else {
        res.redirect("/");
    }
}

module.exports = router;