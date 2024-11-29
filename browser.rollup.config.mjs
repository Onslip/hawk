import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const plugins = [
  alias({
    entries: [
      { find: 'crypto', replacement: import.meta.dirname + '/browser.crypto.js' },
    ]
  }),
  commonjs({strictRequires: 'auto'}),
  json(),
  nodeResolve(),
  nodePolyfills(),
]

export default [{
  input: 'lib/index.js',
  output: {
    file: 'dist/browser.js',
    name: 'hawk',
    format: 'umd',
  },
  plugins,
}, {
  input: 'lib/index.js',
  output: {
    file: 'dist/browser.min.js',
    name: 'hawk',
    format: 'umd',
  },
  plugins: [ ...plugins, terser() ],
}]
