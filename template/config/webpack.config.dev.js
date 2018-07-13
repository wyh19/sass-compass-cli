const path = require('path')
let config = require('./base')

config.mode = 'development'
config.devServer = {
    host: 'localhost',
    port: '8888',
    publicPath: '/',
    index: 'index/index.html',
    contentBase: path.resolve(__dirname, '../dist'),
    overlay: {
        errors: true
    },
    open: true,
    historyApiFallback: true
}

module.exports = config