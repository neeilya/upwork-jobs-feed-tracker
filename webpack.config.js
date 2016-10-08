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
    watch: true,
    plugins: [
        new ExtractTextPlugin("public/[name].css"),
        new CopyWebpackPlugin([
            { from: './manifest.json', to: './public/' },
            { from: './icon.png', to: './public/' },
            { from: './notification-icon.png', to: './public/' },
            { from: './src/fonts', to: './public/fonts' },
            { from: './src/views', to: './public' }
        ]),
        new CleanWebpackPlugin(['public']),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
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