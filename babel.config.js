module.exports = function (api) {
  const isTest = api.env('test');
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      'react-native-reanimated/plugin',
      '@babel/plugin-transform-flow-strip-types',
      ['module-resolver', {
        root: ['./'],
        alias: {
          '~/src': './src',
          '~/assets': './assets'
        }
      }]
    ],
  };
}; 