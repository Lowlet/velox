const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'
const pages = ["index", "form"];

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: pages.reduce((config, page) =>
    {
        config[page] = `./js/${page}.js`;
        return config;
    }, {}),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        clean: true
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
    devtool: isDev ? 'eval-source-map' : false,
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        open: true,
        hot: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ].concat(pages.map((page) =>
        new HtmlWebpackPlugin({
            inject: true,
            template: `./${page}.html`,
            filename: `${page}.html`,
            chunks: [page],
        })
    )),
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(s(a|c)ss)$/,
                use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(jpe?g|png|svg|exr)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(glb|gltf)$/,
                type: 'asset/resource',
            }
        ]
    }
}