var express = require("express");
var router = express.Router();
var user = require("../models/user.js");

var passport = require("passport");


router.get("/register", function(req, res) {
    res.render("register.ejs");
});

router.post("/register", function(req, res) {
    var newUser = new user({ username: req.body.username });
    user.register(newUser, req.body.password, function(err) {
        if (err) {
            console.log(err);
            return res.render("register.ejs");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/");
            });
        }
    });
});

router.get("/login", function(req, res) {
    res.render("login.ejs");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}), function() { //req, res can be used 

});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;