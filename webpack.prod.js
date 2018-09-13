// webpack.config.js

var webpack = require('webpack');

var config = {
  mode: 'production',
  entry: {
    'olaf': __dirname + '/src/olaf.ts',
  },
  output: {
    path: __dirname + '/lib',
    filename: '[name].js',
    library: 'olaf',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },
  optimization: {
    minimize: true,
  }
};

module.exports = config;