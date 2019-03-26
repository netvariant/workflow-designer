// Ref: https://cli.vuejs.org/config/#assetsdir
'use strict'
const webpack = require('webpack')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_PRODUCTION_PATH : '/',
  runtimeCompiler: true,
  devServer: {
    port: 8081,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      // proxy all requests starting with /rest/s1 to localhost:8080
      '/rest/s1': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      })
    ]
  }
}
