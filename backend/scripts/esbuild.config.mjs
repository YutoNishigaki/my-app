import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const entryPoints = fg.sync(['src/**/*.ts', '!src/**/*.test.ts'], {
  cwd: path.resolve(rootDir, '..'),
  absolute: true,
});

const addJsExtensionPlugin = {
  name: 'add-js-extension',
  setup(build) {
    build.onResolve({ filter: /^\.\.?(\/|$)/ }, (args) => {
      const ext = path.extname(args.path);
      if (ext === '') {
        return { path: `${args.path}.js` };
      }
      return null;
    });
  },
};

export const esbuildOptions = {
  entryPoints,
  bundle: false,
  platform: 'node',
  format: 'cjs',
  target: 'node20',
  outdir: path.resolve(rootDir, '../dist'),
  outbase: path.resolve(rootDir, '../src'),
  sourcemap: true,
  logLevel: 'info',
  charset: 'utf8',
  plugins: [addJsExtensionPlugin],
};
