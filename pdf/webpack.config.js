const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const { dependencies } = require("webpack");
const webpack = require('webpack')
const packageJson = require('./package.json')

const config = {
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'X-Frame-Options': 'SAMEORIGIN'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(packageJson.version),
    }),

    new MiniCssExtractPlugin(),

    new Dotenv({
      path: `./.env`,
      systemvars: true
    }),

    new ModuleFederationPlugin({
      name: 'pdf_preview_fe_global',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/Initializer.tsx',
        './appInjector': './src/appInjector.js'
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: dependencies['react'],
        },
        '@g4p/react-styleguide-library': {
          eager: false,
          requiredVersion: dependencies['@g4p/react-styleguide-library'],
        },
        '@omn/react-ark-library': {
          singleton: true,
          eager: false
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: dependencies['react-dom'],
        }
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: ['...', new HtmlMinimizerPlugin(), new TerserPlugin()],
    splitChunks: false,
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".scss", ".css"],
    modules: [
      'node_modules',
      path.resolve(__dirname, './'),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src/data'),
      path.resolve(__dirname, 'src/data/routes'),
      path.resolve(__dirname, 'src/features'),
      path.resolve(__dirname, 'src/utils'),
      path.resolve(__dirname, 'src/pages'),
      path.resolve(__dirname, 'src/data/stores')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    /*publicPath: '/',*/
    clean: true,
    filename: 'pdf-preview-fe-global/[name].[contenthash].js'
  }
}

module.exports = function (env, argv) {
  config.mode = argv.mode === 'production' ? 'production' : 'development'
  config.devtool = argv.mode === 'production' ? false : 'eval-source-map'

  if (argv.mode === 'production') {
    config.output.sourceMapFilename = 'pdf-preview-fe-global/[name].js.map'
  }

  return config
}
