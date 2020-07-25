module.exports = {
	preset: 'ts-jest/presets/js-with-ts',
	testEnvironment: 'node',
	testRegex: './tests/.*.(js|ts|tsx|jsx)$',
	testPathIgnorePatterns: [
		'/node_modules/',
		'<rootDir>/tests/test-utils',
		'<rootDir>/tests/globalSetup.ts',
		'<rootDir>/tests/types',
	],
	globals: {
		'ts-jest': {
			tsConfig: './tsconfig.test.json',
		},
	},
};
