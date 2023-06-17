const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPresetEnv = require('postcss-preset-env');
const EslintWebpackPlugin = require('eslint-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'eval-cheap-module-source-map' : undefined;

function getPlugins() {
	const plugins = [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'index.html'),
			chunks: ['general', 'index'],
			filename: 'index.html',
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'modules.html'),
			chunks: ['general', 'modules'],
			filename: 'modules.html',
		}),
		new MiniCssExtractPlugin({
			filename: 'style.[contenthash].css',
		}),
	];

	if (devMode) {
		plugins.push(new EslintWebpackPlugin());

		if (fs.existsSync(path.resolve(__dirname, '404.html'))) {
			plugins.push(
				new HtmlWebpackPlugin({
					template: path.resolve(__dirname, '404.html'),
					filename: '404.html',
					inject: false,
				}),
			);
		}
	}

	return plugins;
}

module.exports = {
	mode,
	target,
	devtool,
	entry: {
		general: path.resolve(__dirname, 'src', 'general.js'),
		index: path.resolve(__dirname, 'src', 'index.js'),
		modules: path.resolve(__dirname, 'src', 'modules.js'),
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.[contenthash].js',
		clean: true,
		assetModuleFilename: 'assets/[name][ext]',
	},
	devServer: {
		historyApiFallback: {
			index: '/404.html',
		},
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
		},
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		usedExports: true, // tree-shaking
	},
	plugins: getPlugins(),
	module: {
		rules: [
			// HTML
			{
				test: /\.html$/i,
				loader: 'html-loader',
			},
			// STYLES
			{
				test: /\.(c|sc|sa)ss$/i,
				use: [
					devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [[postcssPresetEnv]],
							},
						},
					},
					'sass-loader',
				],
			},
			// JS
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			// FONTS
			{
				test: /\.(woff2?|ttf|otf|eot)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/font/[name][ext]',
				},
			},
			// IMAGES
			{
				test: /\.(png|jpe?g|svg)$/,
				type: 'asset/resource',
				use: {
					loader: 'image-webpack-loader',
					options: {
						mozjpeg: {
							progressive: true,
						},
						// optipng.enabled: false will disable optipng
						optipng: {
							enabled: false,
						},
						pngquant: {
							quality: [0.65, 0.9],
							speed: 4,
						},
						gifsicle: {
							interlaced: false,
						},
						// the webp option will enable WEBP
						webp: {
							quality: 75,
						},
					},
				},
				generator: {
					filename: 'assets/img/[name][ext]',
				},
			},
		],
	},
};
