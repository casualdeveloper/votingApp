var mongoose = require("mongoose");

var pollSchema = new mongoose.Schema({
    title: String,
    results: Array,
    options: Array,
    colors: Array,
    author: String,
    author_id: {
        ref: "user",
        type: mongoose.Schema.Types.ObjectId
    }
});

var poll = mongoose.model("poll", pollSchema);

module.exports = poll;