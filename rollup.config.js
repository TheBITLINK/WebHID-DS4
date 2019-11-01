import typescript from 'rollup-plugin-typescript2'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: './src/index.ts',
  output: [
    { file: 'dist/webhid-ds4.js', format: 'cjs' },
    { file: 'dist/webhid-ds4.esm.js', format: 'esm' }
  ],
  plugins: [
    typescript(),
    commonjs({ extensions: ['.js', '.ts'] }),
    resolve({ preferBuiltins: false })
  ]
}
