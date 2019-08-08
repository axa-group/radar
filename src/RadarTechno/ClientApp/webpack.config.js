const path = require('path');
const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['file?name=[name].[ext]'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }]
      },{
        test: /\.css$/,
        include: APP_DIR,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            namedExport: true,
          },
        }],
      }, {
        test: /\.css$/,
        include: MONACO_DIR,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['json']
    })
  ]
};
