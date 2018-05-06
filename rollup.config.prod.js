import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import VueLoader from 'rollup-plugin-vue'
import butternut from 'rollup-plugin-butternut'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonJs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**'
    }),
    butternut(),
    resolve(),
    commonJs(),
    VueLoader(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  output: [
    {
      file: 'dist/vue-head.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/vue-head.es.js',
      format: 'es'
    },
    {
      file: 'dist/vue-head.amd.js',
      format: 'amd'
    },
    {
      name: 'VueHead',
      file: 'dist/vue-head.js',
      format: 'umd'
    }
  ]
}