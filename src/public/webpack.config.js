const path = require('path')
const autoprefixer = require('autoprefixer')
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  context: __dirname + '/src',
  entry: {
    app: './index.js',
    vendor: [
      'angular',
      'angular-animate',
      'angular-bootstrap',
      'angular-route',
      'animate',
      'bootstrap',
      'bootstrap-filestyle',
      'jquery',
      'ng-file-upload',
      'ng-parallax'
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'app')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              minimize: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }, {
              loader: 'sass-loader',
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /\.svg$/,
        loader: 'url-loader'
      },
      {
        test: /\.php$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.zip$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /(\.png|\.jpg|\.gif)$/,
        loader: 'file-loader?name=[path][name].[ext]'
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].min.css'),
    new CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/src/index.html')
    })
    // new UglifyJSPlugin({})
  ]
}

module.exports = config
