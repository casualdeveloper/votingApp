function variables() {
    process.env["MONGOLAB_URL"] = "";
    process.env["TwitterCallbackURL"] = "";
    process.env["TwitterConsumerKey"] = "";
    process.env["TwitterConsumerSecret"] = "";
    process.env["PORT"] = 8080;
    process.env["SESSION_SECRET"] = "";
    process.env["IP"] = "127.0.0.1";
}
module.exports = variables();