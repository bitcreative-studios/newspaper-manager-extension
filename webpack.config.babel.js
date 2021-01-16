import path from 'path'
import fileSystem from 'fs'
import env from './utils/env'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin'
// import webpack from 'webpack'

// load the secrets
const alias = {}

const secretsPath = path.join(__dirname, 'secrets.' + env.NODE_ENV + '.js')

const fileExtensions = [
  'jpg',
  'jpeg',
  'png',
  'gif',
  'eot',
  'otf',
  'svg',
  'ttf',
  'woff',
  'woff2',
]

const DEV_MODE = process.env.NODE_ENV === 'development'

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath
}

const options = {
  context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV || 'production',
  entry: {
    'popup/popup': './popup/popup.js',
    'options/options': './options/options.js',
    'background/background': './background/background.js',
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        exclude: /node_modules/,
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        use: [{ loader: 'file-loader', options: { name: '[name].[ext]' } }],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: alias,
  },
  plugins: [
    // clean the build folder
    new CleanWebpackPlugin(), // expose and write the allowed env vars on the compiled bundle new webpack.EnvironmentPlugin(['NODE_ENV']),
    new CopyWebpackPlugin([
      {
        from: 'manifest.json',
        transform: function (content, path) {
          // generates the manifest file using the package.json information
          return Buffer.from(
            JSON.stringify({
              ...JSON.parse(content.toString()),
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
            }),
          )
        },
      },
    ]),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'popup.html'),
      filename: 'popup/popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options', 'options.html'),
      filename: 'options/options.html',
      chunks: ['options'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'background', 'background.html'),
      filename: 'background/background.html',
      chunks: ['background'],
    }),
    new WriteFilePlugin(),
  ],
}

if (DEV_MODE) {
  options.devtool = 'cheap-module-eval-source-map'
}

export default options
