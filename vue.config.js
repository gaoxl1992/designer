const path = require('path')
const fs = require('fs')

module.exports = {
  devServer: {
    port: 8080
  },
  filenameHashing: true,
  // 输出文件目录
  assetsDir: 'static',
  outputDir: 'dist',
  // 修改 pages 入口
  pages: {
    index: {
      entry: 'client/main.js', // 入口
      filename: 'index.html' // 输出文件
    }
  },
  css: {
    loaderOptions: {
      sass: {
        data: fs.readFileSync(path.resolve(__dirname, `./client/common/styles/variables.scss`), 'utf-8') // 公共变量文件注入
      }
    }
  },
  // 扩展 webpack 配置
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve('client'))
      .set('@client', path.resolve('client'))
      .set('@plugins', path.resolve('plugins'))
    config.module
      .rule('js')
      .include.add(/client/).end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  },
  configureWebpack: {
    entry: {
      'table-designer': './client/pages/table-designer/index.js',
      designer: './client/pages/designer/index.js',
      editor: './client/pages/editor/index.js',
      preview: './client/pages/preview/index.js'
    },
    resolve: {
      extensions: ['.js', '.vue', '.json', '.css'],
      // 告诉webpack解析模块时应搜索的目录
      modules: ['node_modules']
    },
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`,
    }
  }
}