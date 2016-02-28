var path         = require('path');
var autoprefixer = require('autoprefixer');
var precss       = require('precss');
var atImport     = require('postcss-import');
var cssnano      = require('cssnano');
var lost         = require('lost');

var config = {
  entry: {
    main: [path.resolve(__dirname, 'views/entry.js')],
  },
  output: {
    path: path.resolve(__dirname, 'public/javascripts/'),
    publicPath: 'public/javascripts/',
    filename: "bundle.js"
  },
  devtool: 'sourcemap',
  target: 'web',
  cache: true,
  debug: true,
  stats: {
    colors: true,
    reasons: true
  },
  resolve: {
    extensions: [
      "", ".js", ".jsx"
    ]
  },
  postcss: function() {
    return [lost, atImport, autoprefixer, precss, cssnano];
  },
  plugins: [],
  module: {
    loaders: [
      /*{
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        },
        loader: 'babel'
      },*/
      {
          test: /\.js?$/, 
          loaders: ['jsx-loader?harmony']
      },
      {
        test: /\.css$/,
        loader: 'style!css?localIdentName=[name]-[local]-[hash:base64:5]!postcss'
      },
      {
        test: /\.png$/,
        loader: "url-loader?limit=100000"
      },
      {
        test: /\.jpg$/,
        loader: "file-loader"
      }
    ]
  }
};

module.exports = config;
