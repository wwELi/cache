const path = require('path');
const webpack  = require('webpack');
const copyPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        index: './index.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-transform-runtime']
                        }
                    }
                ]
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: 'hello world'
          }),
        new copyPlugin([{
            from: path.resolve(__dirname, 'verison.json'),
            to: path.resolve(__dirname, 'dist/package.json')
        }]),
        new webpack.ProgressPlugin(function(...args) {
            console.info(...args);
        }),
        new cleanWebpackPlugin()
    ]
}