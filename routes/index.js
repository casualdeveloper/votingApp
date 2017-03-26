var express = require("express");
var router = express.Router();
var poll = require("../models/poll.js");
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
    console.log(req.body);
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

module.exports = router;