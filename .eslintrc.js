module.exports = {
	extends: ['airbnb', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'prettier'],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx'],
		},
		'import/resolver': {
			typescript: {},
		},
	},
	env: {
		node: true,
		browser: true,
	},
	rules: {
		'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
		'import/no-extraneous-dependencies': [2, { devDependencies: ['**/test.tsx', '**/test.ts'] }],
		'indent': 'off',
		'@typescript-eslint/indent': [2, 'tab'],
		'no-tabs': 'off',
		'linebreak-style': [1, 'windows'],
		'array-bracket-spacing': [2, 'always'],
		'semi': 'off',
		'@typescript-eslint/semi': ['error'],
		'react/jsx-indent': [2, 'tab'],
		'react/jsx-indent-props': [2, 'tab'],
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/interface-name-prefix': 'off',
		'max-len': 'off',
		'lines-between-class-members': 'off',
		'no-underscore-dangle': 'off',
		'no-plusplus': 'off',
		'import/prefer-default-export': 'off',
	},
};
