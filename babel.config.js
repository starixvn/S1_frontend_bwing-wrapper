module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.js', '.json', '.ts', '.tsx', '.d.ts'],
        alias: {
          '@hooks': ([, name]) => `./lib/hooks${name}`,
          '@utilities': ([, name]) => `./lib/utilities${name}`,
          '@integrations': ([, name]) => `./lib/integrations${name}`,
          '@modules': ([, name]) => `./lib/modules${name}`,
          '@components': ([, name]) => `./lib/components${name}`,
          '@services': ([, name]) => `./lib/services${name}`,
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        blacklist: null, // DEPRECATED
        whitelist: null, // DEPRECATED
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
