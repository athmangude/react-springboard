const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

const webpack = require('webpack');

const path = require('path');

module.exports = {
  entry: "./src/index.js",
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader"
        }
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)/,
        use: "file-loader"
      }
    ]
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    minimize: true,
    nodeEnv: 'production',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      // cacheGroups: {
      //   vendor: {
      //     test: /[\\/]node_modules[\\/]/,
      //     name(module) {
      //       // get the name. E.g. node_modules/packageName/not/this/part.js
      //       // or node_modules/packageName
      //       const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
      //
      //       // npm package names are URL-safe, but some servers don't like @ symbols
      //       return `npm.${packageName.replace('@', '')}`;
      //     }
      //   }
      // }
    }
  },
  plugins: [
    new SWPrecacheWebpackPlugin({
      // By default, a cache-busting query parameter is appended to requests
      // used to populate the caches, to ensure the responses are fresh.
      // If a URL is already hashed by Webpack, then there is no concern
      // about it being stale, and the cache-busting can be skipped.
      dontCacheBustUrlsMatching: /\.\w{8}\./,
      filename: 'precache-service-worker.js',
      logger(message) {
        if (message.indexOf('Total precache size is') === 0) {
          // This message occurs for every build and is a bit too noisy.
          return;
        }
        console.log(message);
      },
      minify: true, // minify and uglify the script
      navigateFallback: './index.html',
      staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
    }),
    new CopyPlugin([
      { from: './src/assets', to: 'assets' },
      { from: './src/service-workers', to: 'service-workers' },
      { from: './src/.htaccess' },
      { from: './src/.conf' },
      { from: './src/robots.txt' }
    ]),
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
    })
  ],
  resolve: {
    alias: {
      Images: path.resolve(__dirname, "src/assets/images"),
      SharedComponents: path.resolve(__dirname, "src/app/components"),
      Flux: path.resolve(__dirname, "src/app/flux"),
      Config: path.resolve(__dirname, "src/config"),
      Utils: path.resolve(__dirname, "src/app/utils"),
    }
  },
  target: "web"
};

// https://hackernoon.com/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
