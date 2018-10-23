'use strict';

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const exec = require('child_process').exec;

module.exports = {
    mode: 'development',

    context: `${__dirname}/src/`,

    entry: {
        'SpinePlugin': './SpinePlugin.js'
    },

    output: {
        path: `${__dirname}/dist/`,
        filename: '[name].js',
        library: 'SpinePlugin',
        libraryTarget: 'umd',
        sourceMapFilename: '[file].map',
        devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // string
        devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]', // string
        umdNamedDefine: true
    },

    performance: { hints: false },

    module: {
        rules: [
            {
                test: require.resolve('./src/spine-canvas.js'),
                use: 'imports-loader?this=>window'
            },
            {
                test: require.resolve('./src/spine-canvas.js'),
                use: 'exports-loader?spine'
            },
            {
                test: require.resolve('./src/spine-webgl.js'),
                use: 'imports-loader?this=>window'
            },
            {
                test: require.resolve('./src/spine-webgl.js'),
                use: 'exports-loader?spine'
            }
        ]
    },

    resolve: {
        alias: {
            'SpineCanvas': './spine-canvas.js',
            'SpineGL': './spine-webgl.js'
        },
    },

    plugins: [
        new CleanWebpackPlugin([ 'dist' ]),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    exec('node plugins/spine/copy-to-examples.js', (err, stdout, stderr) => {
                        if (stdout) process.stdout.write(stdout);
                        if (stderr) process.stderr.write(stderr);
                    });
                });
            }
        }
    ],

    devtool: 'source-map'
};