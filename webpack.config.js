var path = require('path');
var SRC_DIR = path.join(__dirname, '/react-client/src');
var DIST_DIR = path.join(__dirname, '/react-client/dist');

module.exports = {
  entry: `${SRC_DIR}/index.jsx`,
  output: {
    filename: 'bundle.js',
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
    // {
    //     // For pure CSS (without CSS modules)
    //     test: /\.css$/i,
    //     exclude: /\.module\.css$/i,
    //     use: ['style-loader', 'css-loader'],
    //   },
    ]
  },
};
