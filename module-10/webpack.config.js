/**
 * Webpack configuration file.
 * This file configures Webpack for bundling the application,
 * handling environment variables, entry points, and output settings.
 */
const dotenv = require('dotenv');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed;

const envKeys = env ? Object.keys(env).reduce((acc, key) => {
    if (key.startsWith('REACT_APP_')) {
        acc[`process.env.${key}`] = JSON.stringify(env[key]);
    }
    return acc;
}, {}) : {};

module.exports = {
    entry: path.resolve(__dirname, 'src/index.jsx'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'postcss-loader'
                ],
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.DefinePlugin(envKeys),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 3000,
        historyApiFallback: true
    },
};