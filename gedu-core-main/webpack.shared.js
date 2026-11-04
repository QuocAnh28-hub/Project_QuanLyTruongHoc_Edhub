const { composePlugins, withNx } = require('@nx/webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (serviceName) =>
  composePlugins(withNx(), (config) => {
    // Add loaders for native and raw assets
    config.module.rules.push(
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
      },
      {
        test: /\.proto$/,
        loader: 'raw-loader',
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      }
    );

    // Add TsconfigPathsPlugin to resolve paths from tsconfig.json
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    // Ignore optional NestJS microservices packages
    config.plugins.push(
      new (require('webpack').IgnorePlugin)({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
            'amqp-connection-manager',
            'amqplib',
            'ioredis',
            'mqtt',
            'nats',
            'pg-native',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource);
          } catch (err) {
            return true;
          }
          return false;
        },
      })
    );

    return config;
  });
