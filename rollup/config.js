import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';

module.exports = {
    input: "src/index.js",
    plugins: [
        postcss({
            extensions: [ '.css' ],
        }),
        resolve(),
        babel({
            runtimeHelpers: true,
            exclude: 'node_modules/**',
            presets: ['@babel/env', '@babel/preset-react']
        }),
        commonjs()
    ],
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    external: [
        'react'
    ]
};