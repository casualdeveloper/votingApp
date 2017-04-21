const path = require("path");

const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BitBarWebpackProgressPlugin = require("bitbar-webpack-progress-plugin");

const CleanWebpackPlugin = require("clean-webpack-plugin");



const PATHS = {
    src: path.join(__dirname, "src/js"),
    style: [path.join(__dirname, "src/scss/main.scss")],
    build: path.join(__dirname, "dist")
};


var autoprefix = function() {
    return {
        loader: "postcss-loader",
        options: {
            plugins: () => ([
                require("autoprefixer"),
            ]),
        },
    };
};

module.exports = {
    entry: {
        app: PATHS.src,
        style: PATHS.style
    },
    devtool: "cheap-source-map",
    output: {
        filename: (process.env.NODE_ENV === "production") ? "[name].[chunkhash].js" : "[name].js",
        path: PATHS.build
    },
    module: {
        rules: [{
                test: /\.css$/,
                include: PATHS.style,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", autoprefix()],
                    fallback: "style-loader",
                }),
            },
            {
                test: /\.scss$/,
                include: PATHS.style,
                use: ExtractTextPlugin.extract({
                    use: ["css-loader", autoprefix(), "sass-loader"],
                    fallback: "style-loader",
                }),
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                options: {
                    presets: [
                        ["es2015", { modules: false }]
                    ]
                }
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin([PATHS.build]),
        new ExtractTextPlugin({
            filename: (process.env.NODE_ENV === "production") ? "css/[name].[contenthash].css" : "css/[name].css",
        }),
        new BitBarWebpackProgressPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",

            minChunks: ({ resource }) => (
                resource &&
                resource.indexOf("node_modules") >= 0 &&
                resource.match(/\.js$/)
            ),
        }),

    ]

};