import path from 'path'
import webpack from 'webpack'

const sourcePath = path.resolve(__dirname, 'src')
const jsPath = `${sourcePath}/js`

export default {
  entry: {
    'sass-color-lover': `${jsPath}/sass-colour-lover.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel-loader'}
    ]
  },
  output: {
    filename: '[name].js',
    path: `${path.resolve(__dirname, 'build')}`
  },
  plugins: [
    new webpack.BannerPlugin('#!/usr/bin/env node', {
      raw: true
    })
  ],
  target: 'node'
}
