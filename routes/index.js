var express = require("express");
var router = express.Router();
var poll = require("../models/poll.js");
var user = require("../models/user.js");
var mongoose = require("mongoose");

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash("error", "Please login first");
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
            req.flash("error", "Oops something went wrong, please try again later");
            res.redirect("back");
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
    req.flash("success", "new poll successfully created");
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
            req.flash("error", "Poll not found!");
            res.redirect("back");
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
            req.flash("success", "Successfully deleted");
            res.redirect("back");
        }
    });
});

router.post("/pollVote/:id", function(req, res) {
    poll.findById(req.params.id, function(err, pollToUpdate) {
        if (err) {
            req.flash("error", "Poll not found");
            res.redirect("back");
        }
        let intIpAdress = dotToInt(req.ip);
        //addToSet checks if ip adress exists, if not adds it to the pollsArray
        pollToUpdate.update({ $addToSet: { voters: intIpAdress } }, function(err, results) {
            if (err) {
                req.flash("error", "Failed to update poll, please try again later");
                res.redirect("back");
            } else {
                //if $addToSet inserted new ip adress into the array it return nModified = 1
                if (results.nModified === 1) {
                    //position gained from chosen option
                    let position = parseInt(req.body.option);
                    //object for $inc usage in properties
                    let obj = {};
                    obj["results." + position] = 1; // ends up looking like {'results.0':1} 1 is here for how big increment should be 

                    pollToUpdate.update({ $inc: obj }, { upsert: true, safe: true }, (err) => {
                        if (err) console.log(err);
                        res.redirect("/poll/" + req.params.id);
                    });
                } else {
                    req.flash("error", "You can only vote once :(");
                    res.redirect("back");
                }
            }
        });
    });
});

function checkPollOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        poll.findById(req.params.id, function(err, foundPoll) {
            if (err) {
                req.flash("error", "Poll not found!");
                res.redirect("back");
            } else {
                if (foundPoll.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "Please login first!");
        res.redirect("/");
    }
}

function dotToInt(str) {
    let parts = str.split(".");
    let res = 0;

    res += (parseInt(parts[0], 10) << 24) >>> 0;
    res += (parseInt(parts[1], 10) << 16) >>> 0;
    res += (parseInt(parts[2], 10) << 8) >>> 0;
    res += parseInt(parts[3], 10) >>> 0;

    return res;
}

module.exports = router;