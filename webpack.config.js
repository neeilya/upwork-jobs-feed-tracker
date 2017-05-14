var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        background: "./src/js/background.js",
        popup: "./src/js/popup.js",
        options: "./src/js/options.js"
    },
    output: {
        filename: "public/[name].js"
    },
    plugins: [
        new ExtractTextPlugin("public/[name].css"),
        new CopyWebpackPlugin([
            { from: './manifest.json', to: './public/' },
            { from: './notification.mp3', to: './public/' },
            { from: './icon.png', to: './public/' },
            { from: './notification-icon.png', to: './public/' },
            { from: './src/fonts', to: './public/fonts' },
            { from: './src/css', to: './public' },
            { from: './src/views', to: './public' }
        ]),
        new CleanWebpackPlugin(['public']),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.sass$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?-url!sass-loader')
            }
        ]
    }
}