import babel from '@rollup/plugin-babel'
import commonjs from "@rollup/plugin-commonjs"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import postcss from 'rollup-plugin-postcss'
import resolve from "@rollup/plugin-node-resolve"
import vue from "rollup-plugin-vue"

import packageJson from "./package.json"

export default {
  input: "src/index.js",
  output: [
    {
      format: "cjs",
      file: packageJson.main,
      sourcemap: true
    },
    {
      format: "esm",
      file: packageJson.module,
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(), 
    resolve(),
    vue(), 
    postcss(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ["@babel/preset-env"]
    })
  ]
}
