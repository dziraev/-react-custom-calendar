module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"airbnb",
		"airbnb/hooks",
		'airbnb-typescript',
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended"
	],
	"overrides": [],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module",
		"project": "./tsconfig.json"
	},
	"plugins": [
		"react",
		"@typescript-eslint",
		"prettier"
	],

	rules: {
		'jsx-a11y/anchor-is-valid': 'off',
		'react/prop-types': 'off',
		'import/extensions': 'off',
		'react/react-in-jsx-scope': 'off',
		'import/prefer-default-export': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/require-default-props': 'off',
		'react/function-component-definition': [
			'error',
			{
				namedComponents: 'arrow-function',
				unnamedComponents: 'arrow-function'
			}
		]
	}
};
