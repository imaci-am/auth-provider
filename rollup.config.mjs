import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

// const packageJson = require("./package.json");

export default [
  {
    input: 'src/index.tsx',
    external: ['react'],
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: false,
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm',
        sourcemap: false,
      },
    ],
    plugins: [resolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' })],
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
