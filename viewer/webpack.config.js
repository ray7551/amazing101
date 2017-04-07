let path = require('path');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // watch: true,
  entry: './js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new CopyWebpackPlugin([{
      from: './img/*'
    }]),
  ]
};