const { join } = require('path');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: [
        join(__dirname, './assets/style.scss'),
        join(__dirname, './src/index.ts'),
    ],
    mode: process.env.MODE || "production",
    module: {
        rules: [
            // JS/TS Compiler
            {
                exclude: /assets|node_modules|tests|([a-z]*\.d\.ts)/,
                test: /\.(js|mjs|ts)$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            target: "es6",
                            module: "es6",
                        },
                        transpileOnly: true,
                    }
                },
            },
            // SASS preprocessor
            {
                test: /\.(css|s[ac]ss)$/,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    ['autoprefixer'],
                                ],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            // Exclude js files when reload css files
            {
                exclude: [/^$/, /\.(js|mjs|ts)$/, /\.html$/, /\.json$/],
                type: 'asset/resource',
            },
        ],
    },
    output: {
        filename: 'browser.js',
        path: join(__dirname, 'build'),
        library: "FlexCards",
        libraryTarget: "umd",
    },
    plugins: [
        new MiniCSSExtractPlugin({
            filename: 'style.css',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.d.ts', '.js'],
    },
    stats: 'errors-only',
};
