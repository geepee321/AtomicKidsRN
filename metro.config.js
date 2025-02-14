const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add this to handle assets properly
config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'db',
  // Add any other asset extensions you're using
  'png',
  'jpg',
  'jpeg',
  'gif'
);

module.exports = config; 