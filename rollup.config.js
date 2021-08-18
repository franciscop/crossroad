import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import { terser } from "rollup-plugin-terser";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: {
    file: "index.min.js",
    name: "crossroad",
    format: "esm",
    // This is because we use default and named exports at the same time. The
    // commonjs will have to import with ['default'], but no problem for ESM
    exports: "named",

    globals: {
      react: "React"
    }
  },
  external: ["react"],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    babel({
      exclude: "node_modules/**",
      presets: [
        [
          "@babel/env",
          {
            targets: {
              node: 12
            },
            useBuiltIns: "usage",
            corejs: 3
          }
        ],
        "@babel/preset-react"
      ]
    }),

    commonjs({
      namedExports: {
        "react-dom/test-utils": ["act"]
      }
    }),
    json(),
    terser()
  ],
  sourceMap: true
};
