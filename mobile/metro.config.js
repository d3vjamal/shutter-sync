const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // The Convex backend (schema + generated API) lives at the repo root,
  // outside this project's root — Metro only watches/resolves within
  // projectRoot by default, so it needs to be told about that folder too.
  watchFolders: [path.resolve(__dirname, '..', 'convex')],
  resolver: {
    // convex/_generated/api.js does `import ... from "convex/server"`, a
    // subpath export declared via package.json "exports" — Metro doesn't
    // resolve those unless this is turned on.
    unstable_enablePackageExports: true,
    // Files under ../convex resolve bare imports (e.g. "convex/server")
    // from the repo root; point them at this project's node_modules so
    // a single copy of convex is used.
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    extraNodeModules: new Proxy(
      {},
      { get: (_, name) => path.resolve(__dirname, 'node_modules', name) },
    ),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
