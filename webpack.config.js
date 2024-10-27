var path = require('path');

var PUBLIC_DIR = path.resolve(__dirname, 'public');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: SRC_DIR + '/index.jsx',
  output: {
    path: PUBLIC_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: SRC_DIR,
        loader: 'babel'
      }
    ]
  }
};

module.exports = config;
