const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJsPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPluggin = require('html-webpack-plugin')

const mode = process.env.NODE_ENV || 'production'
const isProduction = mode === 'production'

const cssExtractLoader = {
    loader: MiniCssExtractPlugin.loader,
}

const cssLoader = {
    loader: 'css-loader',
    options: {
        importLoaders: 1,
    },
}

const postcssLoader = {
    loader: 'postcss-loader',
    options: {
        plugins: [
            require('autoprefixer')({
                overrideBrowserslist: ['last 3 versions', 'ie>9'],
            }),
        ],
    },
}

module.exports = {
    // watch: true,
    mode: mode,
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    entry: {
        main: './src/index.js', // 首页以及通用 js
        admin: './src/admin.js' // admin 页面所需的 js
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: isProduction ? 'js/[name]-[contenthash].js' : 'js/[name].js',
    },
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, 'assets', 'css'),
            '@sass': path.resolve(__dirname, 'assets', 'sass'),
        },
        modules: [path.resolve(__dirname, 'libs'), 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules|bower_components/,
                use: {
                    loader: 'babel-loader?cacheDirectory=true',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.css$/i,
                // use: ['style-loader', cssLoader, postcssLoader],
                use: [cssExtractLoader, cssLoader, postcssLoader],
            },
            {
                test: /\.scss$/i,
                // use: ['style-loader', cssLoader, postcssLoader, 'sass-loader'],
                use: [cssExtractLoader, cssLoader, postcssLoader, 'sass-loader'],
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            publicPath: '../img', // css 文件中引用 image 时会用到，image 文件在当前 css 文件的上一层目录的 img 目录下
                            outputPath: '/img',
                            name: isProduction ? '[name].[contenthash].[ext]' :  '[name].[ext]'
                        },
                    },
                    'image-webpack-loader'
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPluggin({
            template: './public/index.html'
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: isProduction ? 'css/[name]-[contenthash].css' : 'css/[name].css',
        }),
    ],
    optimization: {
        minimizer: [new TerserJsPlugin({ sourceMap: true }), new OptimizeCssAssetsPlugin({})],
    },
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'dist'),
        hot: true
    }
}
