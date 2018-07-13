var argv = require('yargs').argv

const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const common = require('./common')

const dirPath = '../src/page'

let config = {
    output: {
        publicPath: '../',
        path: path.resolve(__dirname, '../dist'),
        filename: '[name]/[name]-[hash:8].js'
    },
    module: {
        rules: [{
                test: /\.s?css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: argv.compress
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            includePaths: [path.resolve(__dirname, '../node_modules/compass-mixins/lib')]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024 * 5,
                        fallback: 'file-loader',
                        name: '[name]-[hash:8].[ext]',
                        outputPath: 'image'
                    }
                }]
            },
            {
                test: /\.html$/,
                use: {
                    loader: 'html-loader'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)\??.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'font'
                    }
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name]/[name]-[hash:8].css"
        })
    ]
}

const entry = common.getEntry(dirPath)
config.entry = entry
const hTMLWebpackPlugins = common.getHtmlWebpackPlugins(dirPath)
config.plugins = config.plugins.concat(hTMLWebpackPlugins)

module.exports = config;