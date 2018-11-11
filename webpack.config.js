var path = require('path');
var webpack = require('webpack');
 
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    devServer: {
        inline: true,
        contentBase: './',
        port: 3000,
        lazy: true
    },
    module: {
        rules: [
             {
                test: /\.js$/,                 
                exclude: [/(node_modules)/],
                use: 'babel-loader'
             }, 
             {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: [/node_modules/]
             },
             {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
             }
        ]
     }
 };