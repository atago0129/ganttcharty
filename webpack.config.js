const path = require('path');

module.exports = {

  entry: {
    index: path.resolve(__dirname, 'src/index.tsx')
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].min.js',
    library: 'GanttCharty',
    libraryTarget: 'umd'
  },

  mode: process.env.NODE_ENV || 'development',

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }

};

