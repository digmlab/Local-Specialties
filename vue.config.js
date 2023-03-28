
module.exports = {
    devServer: {
        disableHostCheck: true ,
        port: 7001, // 端口
        },
    // publicPath: './',
    publicPath: process.env.NODE_ENV === "production" ? '/vue_blog/dist/' : './',
    // 禁止生成map文件
    productionSourceMap: false,
    // assetsDir:'assets',//静态资源目录(js,css,img,fonts)这些文件都可以写里面
    // 判断当前是开发模式还是生成模式，来选定程序入口
    chainWebpack:config=> {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production',config => {
            config.entry('app').clear().add('./src/main-prod.js');
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development',config => {
            config.entry('app').clear().add('./src/main.js')
        })

    },
    configureWebpack: (config) => {
        // 为生产环境修改配置
        if (process.env.NODE_ENV === 'production') {
          config.mode = 'production';
          //打包文件大小配置
          config["performance"] = {
            "maxEntrypointSize": 10000000,
            "maxAssetSize": 30000000
            }
        }
    },
}