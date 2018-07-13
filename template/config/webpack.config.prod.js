let config = require('./base')

const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin');


config.mode = 'production'

config.plugins.push(new CleanWebpackPlugin(path.resolve(__dirname, '../dist'), {
    root: path.resolve(__dirname, '../'),
    verbose: true
}))

module.exports = config
