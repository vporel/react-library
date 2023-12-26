const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
          {
            test: /\.(jsx|js)$/,
            include: path.resolve(__dirname, 'src'),
            exclude: /node_modules/,
            resolve: {
              extensions: [".js", ".jsx"]
            },
            use: [{
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', {"targets": "defaults"}],
                  '@babel/preset-react'
                ]
              }
            }]
          }
        ]
      }
};