const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['expo-router']
    }
  }, argv);

  // Configure webpack for expo-router
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve?.alias,
      '@': path.resolve(__dirname),
    },
    fallback: {
      ...config.resolve?.fallback,
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
      'url': require.resolve('url/'),
      'path': require.resolve('path-browserify'),
      'buffer': require.resolve('buffer/'),
    }
  };

  return config;
}; 