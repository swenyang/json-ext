const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'index.js',
        library: 'JSONExt',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            comments: false,
            mangle: {
                eval: true,
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/,
            }, 
        ],
    },
}
