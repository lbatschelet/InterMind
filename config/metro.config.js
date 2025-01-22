const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = (() => {
  const baseConfig = getDefaultConfig(__dirname);

  const { transformer, resolver } = baseConfig;

  baseConfig.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  };
  baseConfig.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
    alias: {
      '~/src': path.resolve(__dirname, '../src'),
      '~/assets': path.resolve(__dirname, '../assets')
    }
  };

  return baseConfig;
})();

module.exports = withNativeWind(config, { input: '../src/styles/global.css' });
