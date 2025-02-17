const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add this to handle assets properly
defaultConfig.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db',
  // Add any other asset extensions you're using
  'png',
  'jpg',
  'jpeg',
  'gif'
);

// Add support for importing from app directory
defaultConfig.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs',
];

module.exports = defaultConfig; 