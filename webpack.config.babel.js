import path from 'path'
import webpack from 'webpack'

const sourcePath = path.resolve(__dirname, 'src')
const jsPath = `${sourcePath}/js`

export default {
  entry: [
    `${jsPath}/sass-colour-lover.js`
  ],
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
    new webpack.optimize.UglifyJsPlugin()
  ]
}
