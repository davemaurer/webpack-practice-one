const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
};

const commonConfig = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          // fail only on errors
          failOnWarning: false,
          failOnError: true,
          // toggle autofix
          fix: false,
          // output to Jenkins compatible XML
          outputReport: {
            filePath: 'checkstyle.xml',
            formatter: require('eslint/lib/formatters/checkstyle'),
          },
        },
      },
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack demo',
    }),
  ],
};

const productionConfig = () => commonConfig;

const developmentConfig = () => {
  const config = {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: {
            emitWarning: true,
          },
        },
      ],
    },
    devServer: {
      // Enable history API fallback so HTML5 History API based routing works. Good for complex setups.
      historyApiFallback: true,
      // Display only errors to reduce the amount of output.
      stats: 'errors-only',
      // parse host and port from env to allow customization.
      // if using Docker, Vagrant, Cloud9, set the following, as 0.0.0.0 is available to all network devices:
      // host: options.host || '0.0.0.0';
      host: process.env.HOST, // Defaults to 'localhost'
      port: process.env.PORT, // Defaults to 8080
      // overlay: true is equivalent to:
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  };
  return Object.assign(
    {},
    commonConfig,
    config
  );
};

module.exports = (env) => {
  if (env === 'production') {
    return productionConfig();
  }
  return developmentConfig();
};
