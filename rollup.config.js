// import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

const Global = `var process = {
  env: {
    NODE_ENV: 'production'
  }
};`

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'umd',
    name: 'sman',
    banner: Global
  },
  plugins: [
    json(),
    resolve({
      browser: true
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
};