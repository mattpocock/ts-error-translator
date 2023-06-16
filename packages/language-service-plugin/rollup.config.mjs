import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'out/index.js',
    sourcemap: true,
    format: 'cjs'
  },
  plugins: [
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.node', '.ts']
    }),
    commonjs({ extensions: ['.js', '.ts'] }),
    typescript(),
    json()
  ]
};