const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

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
    sourceExts: [...resolver.sourceExts, "svg"]
  };

  return baseConfig;
})();

module.exports = withNativeWind(config, { input: './global.css' });
