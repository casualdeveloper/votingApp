var express = require("express");
var app = express();
var mongoose = require("mongoose");
var user = require("./models/user.js");
var bodyParser = require("body-parser");
var passport = require("passport");
var passportLocal = require("passport-local");
var compression = require("compression");
var methodOverride = require("method-override");

app.use(compression());
app.use(methodOverride("_method"));

//ROUTES ===========================================
var indexRoutes = require("./routes/index");
var authRoutes = require("./routes/auth");
var usersRoutes = require("./routes/users");
// =================================================

mongoose.connect("mongodb://localhost/votingapp");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//PASSPORT CONFIG =======================================

app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

//=========================================================

//USING ROUTES ==========
app.use(indexRoutes);
app.use(authRoutes);
app.use(usersRoutes);
// ======================


app.use(express.static("dist"));

app.listen(8080, function(err) {
    if (err) console.log("error ", err);
    else console.log("server started successfully");
});