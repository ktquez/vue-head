import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import VueLoader from 'rollup-plugin-vue'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import babel from 'rollup-plugin-babel'
import commonJs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import eslint from 'rollup-plugin-eslint'
import chokidar from 'chokidar'

export default {
  input: 'src/index.js',
  watch: {
    chokidar,
    include: ['src/**']
  },
  plugins: [
    json(),
    eslint({
      include: './src/**'
    }),
    babel({
      exclude: './node_modules/**'
    }),
    resolve(),
    commonJs(),
    VueLoader(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    serve({
      verbose: false,
      contentBase: 'example',
      historyApiFallback: true
    }),
    livereload({
      watch: 'example'
    })
  ],
  output: [
    {
      name: 'VueHead',
      file: 'example/dist/vue-head.js',
      format: 'umd'
    }
  ]
}
