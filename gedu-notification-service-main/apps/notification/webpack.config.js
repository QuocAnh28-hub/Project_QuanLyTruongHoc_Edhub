const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const webpack = require('webpack');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [
        './src/templates',
      ],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^(@grpc\/grpc-js|@grpc\/proto-loader|mqtt|nats|ioredis|amqplib|amqp-connection-manager|@nestjs\/websockets\/socket-module)$/,
    }),
  ],
  resolve: {
    alias: {
      '@css-inline/css-inline': join(__dirname, 'src/mocks/css-inline.mock.js'),
    },
    fallback: {
      '@css-inline/css-inline-darwin-arm64': false,
      '@css-inline/css-inline-darwin-x64': false,
      '@css-inline/css-inline-darwin-universal': false,
      '@css-inline/css-inline-linux-x64-gnu': false,
      '@css-inline/css-inline-linux-x64-musl': false,
      '@css-inline/css-inline-linux-arm64-gnu': false,
      '@css-inline/css-inline-linux-arm64-musl': false,
      '@css-inline/css-inline-linux-arm-gnueabihf': false,
      '@css-inline/css-inline-win32-x64-msvc': false,
      '@css-inline/css-inline-win32-ia32-msvc': false,
      '@css-inline/css-inline-win32-arm64-msvc': false,
      '@css-inline/css-inline-android-arm64': false,
      '@css-inline/css-inline-android-arm-eabi': false,
      '@css-inline/css-inline-freebsd-x64': false,
    }
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'ignore-loader'
      }
    ]
  }
};
