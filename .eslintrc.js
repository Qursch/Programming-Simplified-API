module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		'ecmaVersion': 13,
		'sourceType': 'module'
	},
	'plugins': [
		'@typescript-eslint'
	],
	'ignorePatterns': ['dist/**/*.js', 'dist/**/*.ts', '*eslint*'],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		// don't add indent type cause it fucks up on my side
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		]
	}
};
