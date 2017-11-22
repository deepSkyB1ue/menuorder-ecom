var f2eci = require('../f2eci.json')
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js',
        orderapplywelcome: './src/pages/OrderApplyWelcome.js',
        orderapply: './src/pages/OrderApply.js',
        orderapplym: './src/pages/OrderApplyM.js',
        orderapplymmiaofu: './src/pages/OrderApplyMMiaofu.js',
        orderapplycity: './src/pages/OrderApplyCity.js',
        clouddownload:'./src/pages/CloudDownload.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
        ? f2eci.urlPrefix
        : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            '@node_modules': resolve('node_modules'),
        }
    },
    module: {
        rules: [{
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            enforce: "pre",
            include: [resolve('src'), resolve('test')],
            options: {
            formatter: require('eslint-friendly-formatter')
            }
        },{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
              appendTsSuffixTo: [/\.vue$/],
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: vueLoaderConfig
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('src'), resolve('test')]
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 1000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }]
    },
    plugins:[]
}

let htmlpages = [{
    title: '手机点餐合作申请',
    filename: 'index.html',
    template: 'templates/index.html',
    chunks: ['vendor', 'manifest', 'app'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '手机点餐合作申请',
    filename: 'orderapplywelcome.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'orderapplywelcome'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '手机点餐合作申请',
    filename: 'orderapply.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'orderapply'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '手机点餐合作申请',
    filename: 'orderapplym.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'orderapplym'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '手机点餐合作申请',
    filename: 'menudescribe.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'menudescribe'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '秒付点餐合作申请',
    filename: 'orderapplymmiaofu.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'orderapplymmiaofu'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '手机点餐合作申请',
    filename: 'orderapplycity.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'orderapplycity'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  },
  {
    title: '云店助手下载中心',
    filename: 'clouddownload.html',
    template: 'templates/custom.html',
    chunks: ['vendor', 'manifest', 'clouddownload'],
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: false
    },
    chunksSortMode: 'dependency'
  }
];
htmlpages.forEach(item=>{
  module.exports.plugins.push(
    new HtmlWebpackPlugin(item)
  )
})
