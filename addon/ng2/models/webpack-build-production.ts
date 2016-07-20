import * as webpack from 'webpack';
import { CliConfig } from './config';

const path = require('path');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs
const WebpackMd5Hash = require('webpack-md5-hash');
const CompressionPlugin = require("compression-webpack-plugin");

export const getWebpackProdConfigPartial = function(projectRoot: string, sourceDir: string) {
  return {
    debug: false,
    devtool: 'source-map',
    output: {
      path: path.resolve(projectRoot, './dist'),
      filename: '[name].[chunkhash].bundle.js',
      sourceMapFilename: '[name].[chunkhash].bundle.map',
      chunkFilename: '[id].[chunkhash].chunk.js'
    },
    plugins: [
      new WebpackMd5Hash(),
      new webpack.optimize.DedupePlugin(),
      // ~107kb
      new webpack.optimize.UglifyJsPlugin({
        beautify: false, //prod
        mangle: { screw_ie8 : true }, //prod
        compress: { screw_ie8: true }, //prod
        comments: false //prod
      }),
      new CompressionPlugin({
          asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.html$/,
          threshold: 10240,
          minRatio: 0.8
      })
    ],
    tslint: {
      emitErrors: true,
      failOnHint: true,
      resourcePath: path.resolve(projectRoot, `./${sourceDir}`)
    },
    htmlLoader: {
      minimize: true,
      removeAttributeQuotes: false,
      caseSensitive: true,
      customAttrSurround: [
        [/#/, /(?:)/],
        [/\*/, /(?:)/],
        [/\[?\(?/, /(?:)/]
      ],
      customAttrAssign: [/\)?\]?=/]
    },
    node: {
      global: 'window',
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  }
};
