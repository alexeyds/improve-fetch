import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'lib/improve_fetch.js',
    output: { file: pkg.main, format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [babel()]
  }
];