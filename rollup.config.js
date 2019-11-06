import json from 'rollup-plugin-json'; 
import resolve from 'rollup-plugin-node-resolve'; // 帮助 Rollup 查找外部模块，然后导入
import common from 'rollup-plugin-commonjs' // 将CommonJS模块转换为 ES2015 供 Rollup 处理
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins'
import { terser } from 'rollup-plugin-terser';


const outputCommonOptions = {
  globals: {
    axios: 'Api',
    dayjs: 'dayJs',
  }
}

export default {
  input: 'index.js',
  external: [ 'axios', 'dayjs'],
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      ...outputCommonOptions,
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      ...outputCommonOptions,
    },
    {
      file: 'dist/umd/index.js',
      name: 'index',
      format: 'umd',
      ...outputCommonOptions,
    }
  ],
  plugins: [
    builtins(),
    resolve({
      preferBuiltins:true,
    }), 
    common(),
    json(),
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true, // 使plugin-transform-runtime生效
    }),
    terser(),
  ]
};
