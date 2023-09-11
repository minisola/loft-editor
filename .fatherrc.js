export default {
  // 以下为 esm 配置项启用时的默认值，有自定义需求时才需配置
  esm: {
    platform: 'browser', // 默认构建为 Browser 环境的产物
    transformer: 'babel', // 默认使用 babel 以提供更好的兼容性
  },
  umd: {
    entry: './style/index.less',
    output: {
      path: 'dist/css',
      filename: 'style.css'
    }
  }
};