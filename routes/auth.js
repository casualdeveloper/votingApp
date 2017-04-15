var express = require("express");
var router = express.Router();
var user = require("../models/user.js");

var passport = require("passport");


router.get("/signup", function(req, res) {
    res.render("register.ejs");
});

router.post("/signup/uap", function(req, res) {
    var newUser = new user({ username: req.body.username, profileName: req.body.username });
    user.register(newUser, req.body.password, function(err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        } else {
            passport.authenticate("local")(req, res, function() {
                req.flash("success", "Welcome! " + req.user.username);
                res.redirect("/");
            });
        }
    });
});

router.get("/signup/twitter", passport.authenticate("twitter"));

router.get("/signup/twitter/callback", passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/signup"
}));

router.get("/login", function(req, res) {
    res.render("login.ejs");
});

router.post("/login/uap", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res) {
    req.flash("success", "Welcome back! " + req.user.username);
    res.redirect("/");
});

router.get("/login/twitter", passport.authenticate("twitter", {
    failureRedirect: "/login"
}), function(req, res) {
    res.redirect("/");
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/");
});

module.exports = router;