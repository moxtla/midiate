import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import postcss from 'rollup-plugin-postcss'
import resolve from 'rollup-plugin-node-resolve'
import url from 'rollup-plugin-url'
import json from '@rollup/plugin-json'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      //sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      //sourcemap: true
    },
  ],
  plugins: [
    external(),
    postcss({
      modules: true
    }),
    url(),
		json(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
			presets: ['@babel/preset-env', '@babel/preset-react'],
    }),
    commonjs({
      include: 'node_modules/**',
      namedExports: {
        'react-is': ['ForwardRef', 'Memo'],
      }
    }),
  ]
}
