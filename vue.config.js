const path = require('path')
const fs = require('fs')

let devServer = {
  proxy: { // 代理
    '/': {
      target: 'http://localhost:4000', //设置你调用的接口域名和端口号
      ws: false,
      changeOrigin: true,
      pathRewrite: {},
    }
  }
}

module.exports = {
  devServer: devServer,
  filenameHashing: true,
  // 输出文件目录
  assetsDir: "static",
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
  }
}