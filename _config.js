require("./_dev_config.js");

var ids = {
    twitter: {
        consumerKey: process.env.TwitterConsumerKey,
        consumerSecret: process.env.TwitterConsumerSecret,
        callbackURL: process.env.TwitterCallbackURL
    }
};

module.exports = ids;