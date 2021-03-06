var express = require("express");
var app = express();
var mongoose = require("mongoose");
var user = require("./models/user.js");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var passportTwitter = require("passport-twitter");
var compression = require("compression");
var methodOverride = require("method-override");
var config = require("./_config.js");
var flash = require("connect-flash");
require("./_dev_config.js");
var manifest = require("./dist/manifest.json");

app.use(compression());
app.use(methodOverride("_method"));

//ROUTES ===========================================
var indexRoutes = require("./routes/index");
var authRoutes = require("./routes/auth");
var usersRoutes = require("./routes/users");
// =================================================

mongoose.connect(process.env.MONGOLAB_URL);

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(flash());

//PASSPORT CONFIG =======================================


var sessions = require("client-sessions");
app.use(sessions({
    cookieName: "session",
    secret: process.env.SESSION_SECRET,
    duration: 7 * 24 * 60 * 60 * 1000,
    activeDuration: 3 * 24 * 60 * 60 * 1000
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));

// PASSPORT TWITTER CONFIG

passport.use(new passportTwitter({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        user.findOne({
                externalAccounts: {
                    $elemMatch: {
                        provider: profile.provider,
                        uid: profile.id
                    }
                }
            },
            function(err, foundUser) {
                if (err)
                    return done(err);

                if (!foundUser) {
                    foundUser = new user({
                        username: profile.id,
                        profileName: profile.displayName,
                        externalAccounts: [{
                            provider: profile.provider,
                            uid: profile.id
                        }],
                    });
                    foundUser.save(function(err) {
                        if (err)
                            console.log(err);
                        return done(err, foundUser);
                    });
                } else {
                    return done(err, foundUser);
                }

            });
    }
));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.manifest = manifest;
    next();
});

//=========================================================

//USING ROUTES ==========
app.use(indexRoutes);
app.use(authRoutes);
app.use(usersRoutes);
// ======================


app.use(express.static("dist"));


//handling 404 error
app.use(function(req, res) {
    res.status(404).render("404.ejs");
});

app.listen(process.env.PORT || 8080, process.env.IP, function(err) {
    if (err) console.log("error ", err);
    else console.log("server started successfully");
});