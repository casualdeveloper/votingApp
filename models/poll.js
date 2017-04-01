var mongoose = require("mongoose");

var pollSchema = new mongoose.Schema({
    title: String,
    results: Array,
    options: Array,
    colors: Array,
    voters: Array,
    author: {
        id: {
            ref: "user",
            type: mongoose.Schema.Types.ObjectId
        },
        username: String
    }
});

var poll = mongoose.model("poll", pollSchema);

module.exports = poll;