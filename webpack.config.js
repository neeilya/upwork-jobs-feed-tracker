var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/js/background.js",
    output: {
        filename: "public/background.js"
    },
    watch: true,
    plugins: [
        new  CopyWebpackPlugin([
            { from: './manifest.json', to: './public/' },
            { from: './icon.png', to: './public/' },
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
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    }
}