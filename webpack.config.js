const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/[name].[contenthash][ext]',
        clean: true
    },
    devtool: isDev ? 'eval-source-map' : 'hidden-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
          },
        hot: isDev
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            favicon: "./img/favicon.png",
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
                options: {
                    sources: {
                        list: [
                            '...',
                            {
                                tag: 'img',
                                attribute: 'data-src',
                                type: 'src',
                            }
                        ]
                    }
                }
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp|ico|exr|glb|gltf)$/,
                type: 'asset/resource'
            }
        ]
    }
}