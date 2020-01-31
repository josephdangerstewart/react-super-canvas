/* eslint-disable */
var path = require('path');

module.exports = {
	entry: {
		index: './src/index.ts',
		defaults: './src/defaults.ts',
	},
	output: {
		path: path.resolve('./dist'),
		filename: '[name].js',
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			}
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
	},
};
