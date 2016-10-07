var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: "./src/js/background.js",
    output: {
        filename: "public/background.js"
    },
    watch: true,
    devtool: 'source-map',
    plugins: [
        new  CopyWebpackPlugin([
            { from: './manifest.json', to: './public/' },
            { from: './icon.png', to: './public/' },
            { from: './src/views', to: './public' }
        ])
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