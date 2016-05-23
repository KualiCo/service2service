'use strict'

module.exports = {
  parserOptions: {
    ecmaVersion: 6
  },
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  plugins: [
    'eslint-plugin-mocha'
  ],
  rules: {
    'mocha/no-exclusive-tests': 2, // Prevent .only tests
    'mocha/handle-done-callback': 2, // Handle the done callback
    'mocha/no-synchronous-tests': 0, // Allow Synchronous tests
    'mocha/no-global-tests': 2, // Disallow global tests

    /**
     * Possible Errors
     * The following rules point out areas where you might have made mistakes.
     */

    'comma-dangle': [
      2,
      'never'
    ], // disallow or enforce trailing commas - http://eslint.org/docs/rules/comma-dangle
    'no-cond-assign': [
      2,
      'except-parens'
    ], // disallow assignment in conditional expressions - http://eslint.org/docs/rules/no-cond-assign
    'no-console': 1, // disallow use of console - http://eslint.org/docs/rules/no-console
    'no-constant-condition': 2, // disallow use of constant expressions in conditions - http://eslint.org/docs/rules/no-constant-condition
    'no-control-regex': 2, // disallow control characters in regular expressions - http://eslint.org/docs/rules/no-control-regex
    'no-debugger': 2, // disallow use of debugger - http://eslint.org/docs/rules/no-debugger
    'no-dupe-args': 2, // disallow duplicate arguments in functions - http://eslint.org/docs/rules/no-dupe-args
    'no-dupe-keys': 2, // disallow duplicate keys when creating object literals - http://eslint.org/docs/rules/no-dupe-keys
    'no-duplicate-case': 2, // disallow a duplicate case label. - http://eslint.org/docs/rules/no-duplicate-case
    'no-empty': 2, // disallow empty block statements - http://eslint.org/docs/rules/no-empty
    'no-empty-character-class': 2, // disallow the use of empty character classes in regular expressions - http://eslint.org/docs/rules/no-empty-character-class
    'no-ex-assign': 2, // disallow assigning to the exception in a catch block - http://eslint.org/docs/rules/no-ex-assign
    'no-extra-boolean-cast': 2, // disallow double-negation boolean casts in a boolean context - http://eslint.org/docs/rules/no-extra-boolean-cast
    'no-extra-parens': [
      2,
      'all',
      {
        conditionalAssign: true
      }
    ], // disallow unnecessary parentheses - http://eslint.org/docs/rules/no-extra-parens
    'no-extra-semi': 2, // disallow unnecessary semicolons - http://eslint.org/docs/rules/no-extra-semi
    'no-func-assign': 2, // disallow overwriting functions written as function declarations - http://eslint.org/docs/rules/no-func-assign
    'no-inner-declarations': 2, // disallow function or variable declarations in nested blocks - http://eslint.org/docs/rules/no-inner-declarations
    'no-invalid-regexp': 2, // disallow invalid regular expression strings in the RegExp constructor - http://eslint.org/docs/rules/no-invalid-regexp
    'no-irregular-whitespace': 2, // disallow irregular whitespace outside of strings and comments - http://eslint.org/docs/rules/no-irregular-whitespace
    'no-negated-in-lhs': 2, // disallow negation of the left operand of an in expression - http://eslint.org/docs/rules/no-negated-in-lhs
    'no-obj-calls': 2, // disallow the use of object properties of the global object (Math and JSON) as functions - http://eslint.org/docs/rules/no-obj-calls
    'no-regex-spaces': 2, // disallow multiple spaces in a regular expression literal - http://eslint.org/docs/rules/no-regex-spaces
    'no-sparse-arrays': 2, // disallow sparse arrays - http://eslint.org/docs/rules/no-sparse-arrays
    'no-unexpected-multiline': 2, // Avoid code that looks like two expressions but is actually one - http://eslint.org/docs/rules/no-unexpected-multiline
    'no-unreachable': 2, // disallow unreachable statements after a return, throw, continue, or break statement - http://eslint.org/docs/rules/no-unreachable
    'use-isnan': 2, // disallow comparisons with the value NaN - http://eslint.org/docs/rules/use-isnan
    'valid-jsdoc': [
      1,
      {
        prefer: {
          returns: 'returns'
        },
        requireReturn: true,
        requireParamDescription: true,
        requireReturnDescription: true,
        requireReturnType: true
      }
    ], // Ensure JSDoc comments are valid - http://eslint.org/docs/rules/valid-jsdoc
    'valid-typeof': 2, // Ensure that the results of typeof are compared against a valid string - http://eslint.org/docs/rules/valid-typeof

    /**
     * Best Practices
     * These are rules designed to prevent you from making mistakes. They either
     * prescribe a better way of doing something or help you avoid footguns.
     */

    'accessor-pairs': 2, // Enforces getter/setter pairs in objects - http://eslint.org/docs/rules/accessor-pairs
    'array-callback-return': 2, // Enforces return statements in callbacks of array’s methods - http://eslint.org/docs/rules/array-callback-return
    'block-scoped-var': 2, // treat var statements as if they were block scoped - http://eslint.org/docs/rules/block-scoped-var
    'complexity': [
      2,
      11
    ], // specify the maximum cyclomatic complexity allowed in a program - http://eslint.org/docs/rules/complexity
    'consistent-return': 2, // require return statements to either always or never specify values - http://eslint.org/docs/rules/consistent-return
    'curly': [
      2,
      'multi-line'
    ], // specify curly brace conventions for all control statements - http://eslint.org/docs/rules/curly
    'default-case': 2, // require default case in switch statements - http://eslint.org/docs/rules/default-case
    'dot-location': [
      2,
      'property'
    ], // enforces consistent newlines before or after dots - http://eslint.org/docs/rules/dot-location
    'dot-notation': 2, // encourages use of dot notation whenever possible - http://eslint.org/docs/rules/dot-notation
    'eqeqeq': [
      2,
      'allow-null'
    ], // require the use of === and !== - http://eslint.org/docs/rules/eqeqeq
    'guard-for-in': 2, // make sure for-in loops have an if statement - http://eslint.org/docs/rules/guard-for-in
    'no-alert': 2, // disallow the use of alert, confirm, and prompt - http://eslint.org/docs/rules/no-alert
    'no-caller': 2, // disallow use of arguments.caller or arguments.callee - http://eslint.org/docs/rules/no-caller
    'no-case-declarations': 2, // disallow lexical declarations in case clauses - http://eslint.org/docs/rules/no-case-declarations
    'no-div-regex': 2, // disallow division operators explicitly at beginning of regular expression - http://eslint.org/docs/rules/no-div-regex
    'no-else-return': 2, // disallow else after a return in an if - http://eslint.org/docs/rules/no-else-return
    'no-empty-function': 2, // disallow use of empty functions - http://eslint.org/docs/rules/no-empty-function
    'no-empty-pattern': 2, // disallow use of empty destructuring patterns - http://eslint.org/docs/rules/no-empty-pattern
    'no-eq-null': 0, // disallow comparisons to null without a type-checking operator - http://eslint.org/docs/rules/no-eq-null
    'no-eval': 2, // disallow use of eval() - http://eslint.org/docs/rules/no-eval
    'no-extend-native': 2, // disallow adding to native types - http://eslint.org/docs/rules/no-extend-native
    'no-extra-bind': 2, // disallow unnecessary function binding - http://eslint.org/docs/rules/no-extra-bind
    'no-extra-label': 2, // disallow unnecessary labels - http://eslint.org/docs/rules/no-extra-label
    'no-fallthrough': 0, // disallow fallthrough of case statements - http://eslint.org/docs/rules/no-fallthrough
    'no-floating-decimal': 2, // disallow the use of leading or trailing decimal points in numeric literals - http://eslint.org/docs/rules/no-floating-decimal
    'no-implicit-coercion': 2, // disallow the type conversions with shorter notations - http://eslint.org/docs/rules/no-implicit-coercion
    'no-implicit-globals': 2, // disallow var and named functions in global scope - http://eslint.org/docs/rules/no-implicit-globals
    'no-implied-eval': 2, // disallow use of eval()-like methods - http://eslint.org/docs/rules/no-implied-eval
    'no-invalid-this': 0, // disallow this keywords outside of classes or class-like objects - http://eslint.org/docs/rules/no-invalid-this
    'no-iterator': 2, // disallow usage of __iterator__ property - http://eslint.org/docs/rules/no-iterator
    'no-labels': 2, // disallow use of labeled statements - http://eslint.org/docs/rules/no-labels
    'no-lone-blocks': 2, // disallow unnecessary nested blocks - http://eslint.org/docs/rules/no-lone-blocks
    'no-loop-func': 2, // disallow creation of functions within loops - http://eslint.org/docs/rules/no-loop-func
    'no-magic-numbers': 0, // disallow the use of magic numbers - http://eslint.org/docs/rules/no-magic-numbers
    'no-multi-spaces': 2, // disallow use of multiple spaces - http://eslint.org/docs/rules/no-multi-spaces
    'no-multi-str': 2, // disallow use of multiline strings - http://eslint.org/docs/rules/no-multi-str
    'no-native-reassign': 2, // disallow reassignments of native objects - http://eslint.org/docs/rules/no-native-reassign
    'no-new': 2, // disallow use of the new operator when not part of an assignment or comparison - http://eslint.org/docs/rules/no-new
    'no-new-func': 2, // disallow use of new operator for Function object - http://eslint.org/docs/rules/no-new-func
    'no-new-wrappers': 2, // disallows creating new instances of String,Number, and Boolean - http://eslint.org/docs/rules/no-new-wrappers
    'no-octal': 2, // disallow use of octal literals - http://eslint.org/docs/rules/no-octal
    'no-octal-escape': 2, // disallow use of octal escape sequences in string literals, such as var foo = 'Copyright \251'; - http://eslint.org/docs/rules/no-octal-escape
    'no-param-reassign': 0, // disallow reassignment of function parameters - http://eslint.org/docs/rules/no-param-reassign
    'no-proto': 2, // disallow usage of __proto__ property - http://eslint.org/docs/rules/no-proto
    'no-redeclare': 2, // disallow declaring the same variable more than once - http://eslint.org/docs/rules/no-redeclare
    'no-return-assign': [
      2,
      'except-parens'
    ], // disallow use of assignment in return statement - http://eslint.org/docs/rules/no-return-assign
    'no-script-url': 2, // disallow use of javascript: urls. - http://eslint.org/docs/rules/no-script-url
    'no-self-assign': 2, // disallow assignments where both sides are exactly the same - http://eslint.org/docs/rules/no-self-assign
    'no-self-compare': 2, // disallow comparisons where both sides are exactly the same - http://eslint.org/docs/rules/no-self-compare
    'no-sequences': 2, // disallow use of the comma operator - http://eslint.org/docs/rules/no-sequences
    'no-throw-literal': 2, // restrict what can be thrown as an exception - http://eslint.org/docs/rules/no-throw-literal
    'no-unmodified-loop-condition': 2, // disallow unmodified conditions of loops - http://eslint.org/docs/rules/no-unmodified-loop-condition
    'no-unused-expressions': 2, // disallow usage of expressions in statement position - http://eslint.org/docs/rules/no-unused-expressions
    'no-unused-labels': 2, // disallow unused labels - http://eslint.org/docs/rules/no-unused-labels
    'no-useless-call': 2, // disallow unnecessary .call() and .apply() - http://eslint.org/docs/rules/no-useless-call
    'no-useless-concat': 2, // disallow unnecessary concatenation of literals or template literals - http://eslint.org/docs/rules/no-useless-concat
    'no-void': 2, // disallow use of the void operator - http://eslint.org/docs/rules/no-void
    'no-warning-comments': 1, // disallow usage of configurable warning terms in comments - e.g. TODO or FIXME - http://eslint.org/docs/rules/no-warning-comments
    'no-with': 2, // disallow use of the with statement - http://eslint.org/docs/rules/no-with
    'radix': 2, // require use of the second argument for parseInt() - http://eslint.org/docs/rules/radix
    'vars-on-top': 2, // require declaration of all vars at the top of their containing scope - http://eslint.org/docs/rules/vars-on-top
    'wrap-iife': [
      2,
      'inside'
    ], // require immediate function invocation to be wrapped in parentheses - http://eslint.org/docs/rules/wrap-iife
    'yoda': 1, // require or disallow Yoda conditions - http://eslint.org/docs/rules/yoda

    /**
     * Strict Mode
     * These rules relate to using strict mode and strict mode directives.
     */

    'strict': [
      0,
      'safe'
    ], // require effective use of strict mode directives - http://eslint.org/docs/rules/strict

    /**
     * Variables
     * These rules have to do with variable declarations.
     */

    'init-declarations': 0, // enforce or disallow variable initializations at definition - http://eslint.org/docs/rules/init-declarations
    'no-catch-shadow': 2, // disallow the catch clause parameter name being the same as a variable in the outer scope - http://eslint.org/docs/rules/no-catch-shadow
    'no-delete-var': 2, // disallow deletion of variables - http://eslint.org/docs/rules/no-delete-var
    'no-label-var': 2, // disallow labels that share a name with a variable - http://eslint.org/docs/rules/no-label-var
    'no-restricted-globals': 2, // restrict usage of specified global variables - http://eslint.org/docs/rules/no-restricted-globals
    'no-shadow': 2, // disallow declaration of variables already declared in the outer scope - http://eslint.org/docs/rules/no-shadow
    'no-shadow-restricted-names': 2, // disallow shadowing of names such as arguments - http://eslint.org/docs/rules/no-shadow-restricted-names
    'no-undef': 2, // disallow use of undeclared variables unless mentioned in a /*global */ block - http://eslint.org/docs/rules/no-undef
    'no-undef-init': 0, // disallow use of undefined when initializing variables - http://eslint.org/docs/rules/no-undef-init
    'no-undefined': 2, // disallow use of undefined variable - http://eslint.org/docs/rules/no-undefined
    'no-unused-vars': 2, // disallow declaration of variables that are not used in the code - http://eslint.org/docs/rules/no-unused-vars
    'no-use-before-define': [
      2,
      {
        functions: false
      }
    ], // disallow use of variables before they are defined - http://eslint.org/docs/rules/no-use-before-define

    /**
     * Node.js and CommonJS
     * These rules are specific to JavaScript running on Node.js or using
     * CommonJS in the browser.
     */

    'callback-return': 2, // enforce return after a callback - http://eslint.org/docs/rules/callback-return
    'global-require': 2, // enforce require() on top-level module scope - http://eslint.org/docs/rules/global-require
    'handle-callback-err': 2, // enforce error handling in callbacks - http://eslint.org/docs/rules/handle-callback-err
    'no-mixed-requires': 2, // disallow mixing regular variable and require declarations - http://eslint.org/docs/rules/no-mixed-requires
    'no-new-require': 2, // disallow use of new operator with the require function - http://eslint.org/docs/rules/no-new-require
    'no-path-concat': 2, // disallow string concatenation with __dirname and __filename - http://eslint.org/docs/rules/no-path-concat
    'no-process-env': 0, // disallow use of process.env - http://eslint.org/docs/rules/no-process-env
    'no-process-exit': 2, // disallow process.exit() - http://eslint.org/docs/rules/no-process-exit
    'no-restricted-modules': 0, // restrict usage of specified modules when loaded by require function - http://eslint.org/docs/rules/no-restricted-modules
    'no-sync': 2, // disallow use of synchronous methods - http://eslint.org/docs/rules/no-sync

    /**
     * Stylistic Issues
     * These rules are purely matters of style and are quite subjective.
     */

    'array-bracket-spacing': [
      2,
      'always',
      {
        singleValue: false,
        arraysInArrays: false,
        objectsInArrays: false
      }
    ], // enforce spacing inside array brackets - http://eslint.org/docs/rules/array-bracket-spacing
    'block-spacing': 2, // disallow or enforce spaces inside of single line blocks - http://eslint.org/docs/rules/block-spacing
    'brace-style': [
      2,
      '1tbs',
      {
        allowSingleLine: true
      }
    ], // enforce one true brace style - http://eslint.org/docs/rules/brace-style
    'camelcase': 2, // require camel case names - http://eslint.org/docs/rules/camelcase
    'comma-spacing': 2, // enforce spacing before and after comma - http://eslint.org/docs/rules/comma-spacing
    'comma-style': 0, // enforce one true comma style - http://eslint.org/docs/rules/comma-style
    'computed-property-spacing': 2, // require or disallow padding inside computed properties - http://eslint.org/docs/rules/computed-property-spacing
    'consistent-this': [
      2,
      'that',
      'self'
    ], // enforce consistent naming when capturing the current execution context - http://eslint.org/docs/rules/consistent-this
    'eol-last': 2, // enforce newline at the end of file, with no multiple empty lines - http://eslint.org/docs/rules/eol-last
    'func-names': 0, // require function expressions to have a name - http://eslint.org/docs/rules/func-names
    'func-style': [
      2,
      'declaration',
      {
        allowArrowFunctions: true
      }
    ], // enforce use of function declarations or expressions - http://eslint.org/docs/rules/func-style
    'id-blacklist': 0, // blacklist certain identifiers to prevent them being used - http://eslint.org/docs/rules/id-blacklist
    'id-length': 0, // this option enforces minimum and maximum identifier lengths (variable names, property names etc.) - http://eslint.org/docs/rules/id-length
    'id-match': 0, // require identifiers to match the provided regular expression - http://eslint.org/docs/rules/id-match
    'indent': [
      2,
      2
    ], // specify tab or space width for your code - http://eslint.org/docs/rules/indent
    'jsx-quotes': [
      2,
      'prefer-double'
    ], // specify whether double or single quotes should be used in JSX attributes - http://eslint.org/docs/rules/jsx-quotes
    'key-spacing': 2, // enforce spacing between keys and values in object literal properties - http://eslint.org/docs/rules/key-spacing
    'keyword-spacing': 2, // enforce spacing before and after keywords - http://eslint.org/docs/rules/keyword-spacing
    'linebreak-style': 2, // disallow mixed ‘LF’ and ‘CRLF’ as linebreaks - http://eslint.org/docs/rules/linebreak-style
    'lines-around-comment': 0, // enforce empty lines around comments - http://eslint.org/docs/rules/lines-around-comment
    'max-depth': [
      2,
      4
    ], // specify the maximum depth that blocks can be nested - http://eslint.org/docs/rules/max-depth
    'max-len': [
      2,
      {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreTrailingComments: true
      }
    ], // specify the maximum length of a line in your program - http://eslint.org/docs/rules/max-len
    'max-nested-callbacks': [
      2,
      4
    ], // specify the maximum depth callbacks can be nested - http://eslint.org/docs/rules/max-nested-callbacks
    'max-params': [
      2,
      4
    ], // limits the number of parameters that can be used in the function declaration - http://eslint.org/docs/rules/max-params
    'max-statements': [
      2,
      11
    ], // specify the maximum number of statement allowed in a function - http://eslint.org/docs/rules/max-statements
    'new-cap': 2, // require a capital letter for constructors - http://eslint.org/docs/rules/new-cap
    'new-parens': 2, // disallow the omission of parentheses when invoking a constructor with no arguments - http://eslint.org/docs/rules/new-parens
    'newline-after-var': 0, // require or disallow an empty newline after variable declarations - http://eslint.org/docs/rules/newline-after-var
    'newline-before-return': 0, // require newline before return statement - http://eslint.org/docs/rules/newline-before-return
    'newline-per-chained-call': 2, // enforce newline after each call when chaining the calls - http://eslint.org/docs/rules/newline-per-chained-call
    'no-array-constructor': 2, // disallow use of the Array constructor - http://eslint.org/docs/rules/no-array-constructor
    'no-bitwise': 2, // disallow use of bitwise operators - http://eslint.org/docs/rules/no-bitwise
    'no-continue': 2, // disallow use of the continue statement - http://eslint.org/docs/rules/no-continue
    'no-inline-comments': 0, // disallow comments inline after code - http://eslint.org/docs/rules/no-inline-comments
    'no-lonely-if': 2, // disallow if as the only statement in an else block - http://eslint.org/docs/rules/no-lonely-if
    'no-mixed-spaces-and-tabs': 2, // disallow mixed spaces and tabs for indentation - http://eslint.org/docs/rules/no-mixed-spaces-and-tabs
    'no-multiple-empty-lines': [
      2,
      {
        max: 2
      }
    ], // disallow multiple empty lines - http://eslint.org/docs/rules/no-multiple-empty-lines
    'no-negated-condition': 1, // disallow negated conditions - http://eslint.org/docs/rules/no-negated-condition
    'no-nested-ternary': 2, // disallow nested ternary expressions - http://eslint.org/docs/rules/no-nested-ternary
    'no-new-object': 2, // disallow the use of the Object constructor - http://eslint.org/docs/rules/no-new-object
    'no-plusplus': 0, // disallow use of unary operators, ++ and -- - http://eslint.org/docs/rules/no-plusplus
    'no-restricted-syntax': [
      2,
      'WithStatement'
    ], // disallow use of certain syntax in code - http://eslint.org/docs/rules/no-restricted-syntax
    'no-spaced-func': 2, // disallow space between function identifier and application - http://eslint.org/docs/rules/no-spaced-func
    'no-ternary': 0, // disallow the use of ternary operators - http://eslint.org/docs/rules/no-ternary
    'no-trailing-spaces': 2, // disallow trailing whitespace at the end of lines - http://eslint.org/docs/rules/no-trailing-spaces
    'no-underscore-dangle': 2, // disallow dangling underscores in identifiers - http://eslint.org/docs/rules/no-underscore-dangle
    'no-unneeded-ternary': 2, // disallow the use of ternary operators when a simpler alternative exists - http://eslint.org/docs/rules/no-unneeded-ternary
    'no-whitespace-before-property': 2, // disallow whitespace before properties - http://eslint.org/docs/rules/no-whitespace-before-property
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: false,
        arraysInObjects: false
      }
    ], // require or disallow padding inside curly braces - http://eslint.org/docs/rules/object-curly-spacing
    'one-var': [
      2,
      {
        uninitialized: 'always',
        initialized: 'never'
      }
    ], // require or disallow one variable declaration per function - http://eslint.org/docs/rules/one-var
    'one-var-declaration-per-line': [
      2,
      'initializations'
    ], // require or disallow an newline around variable declarations - http://eslint.org/docs/rules/one-var-declaration-per-line
    'operator-assignment': [
      2,
      'always'
    ], // require assignment operator shorthand where possible or prohibit it entirely - http://eslint.org/docs/rules/operator-assignment
    'operator-linebreak': [
      2,
      'before'
    ], // enforce operators to be placed before or after line breaks - http://eslint.org/docs/rules/operator-linebreak
    'padded-blocks': 0, // enforce padding within blocks - http://eslint.org/docs/rules/padded-blocks
    'quote-props': [
      2,
      'consistent-as-needed'
    ], // require quotes around object literal property names - http://eslint.org/docs/rules/quote-props
    'quotes': [
      2,
      'single'
    ], // specify whether backticks, double or single quotes should be used - http://eslint.org/docs/rules/quotes
    'require-jsdoc': 0, // Require JSDoc comment - http://eslint.org/docs/rules/require-jsdoc
    'semi': [
      2,
      'never'
    ], // require or disallow use of semicolons instead of ASI - http://eslint.org/docs/rules/semi
    'semi-spacing': 2, // enforce spacing before and after semicolons - http://eslint.org/docs/rules/semi-spacing
    'sort-imports': 0, // sort import declarations within module - http://eslint.org/docs/rules/sort-imports
    'sort-vars': 0, // sort variables within the same declaration block - http://eslint.org/docs/rules/sort-vars
    'space-before-blocks': 0, // require or disallow a space before blocks - http://eslint.org/docs/rules/space-before-blocks
    'space-before-function-paren': [
      2,
      'never'
    ], // require or disallow a space before function opening parenthesis - http://eslint.org/docs/rules/space-before-function-paren
    'space-in-parens': [
      2,
      'never'
    ], // require or disallow spaces inside parentheses - http://eslint.org/docs/rules/space-in-parens
    'space-infix-ops': 2, // require spaces around operators - http://eslint.org/docs/rules/space-infix-ops
    'space-unary-ops': 2, // require or disallow spaces before/after unary operators - http://eslint.org/docs/rules/space-unary-ops
    'spaced-comment': [
      2,
      'always'
    ], // require or disallow a space immediately following the // or /* in a comment - http://eslint.org/docs/rules/spaced-comment
    'wrap-regex': 2, // require regex literals to be wrapped in parentheses - http://eslint.org/docs/rules/wrap-regex

    /**
     * ECMAScript 6
     * These rules are only relevant to ES6 environments.
     */

    'arrow-body-style': [
      0,
      'as-needed'
    ], // require braces in arrow function body - http://eslint.org/docs/rules/arrow-body-style
    'arrow-parens': [
      1,
      'always'
    ], // require parens in arrow function arguments - http://eslint.org/docs/rules/arrow-parens
    'arrow-spacing': 1, // require space before/after arrow function’s arrow - http://eslint.org/docs/rules/arrow-spacing
    'constructor-super': 2, // verify calls of super() in constructors - http://eslint.org/docs/rules/constructor-super
    'generator-star-spacing': 2, // enforce spacing around the * in generator functions - http://eslint.org/docs/rules/generator-star-spacing
    'no-class-assign': 2, // disallow modifying variables of class declarations - http://eslint.org/docs/rules/no-class-assign
    'no-confusing-arrow': 1, // disallow arrow functions where they could be confused with comparisons - http://eslint.org/docs/rules/no-confusing-arrow
    'no-const-assign': 2, // disallow modifying variables that are declared using const - http://eslint.org/docs/rules/no-const-assign
    'no-dupe-class-members': 2, // disallow duplicate name in class members - http://eslint.org/docs/rules/no-dupe-class-members
    'no-new-symbol': 2, // disallow use of the new operator with the Symbol object - http://eslint.org/docs/rules/no-new-symbol
    'no-this-before-super': 2, // disallow use of this/super before calling super() in constructors - http://eslint.org/docs/rules/no-this-before-super
    'no-useless-constructor': 1, // disallow unnecessary constructor - http://eslint.org/docs/rules/no-useless-constructor
    'no-var': 2, // require let or const instead of var - http://eslint.org/docs/rules/no-var
    'object-shorthand': 1, // require method and property shorthand syntax for object literals - http://eslint.org/docs/rules/object-shorthand
    'prefer-arrow-callback': 1, // suggest using arrow functions as callbacks - http://eslint.org/docs/rules/prefer-arrow-callback
    'prefer-const': 1, // suggest using const declaration for variables that are never reassigned after declared - http://eslint.org/docs/rules/prefer-const
    'prefer-template': 1, // suggest using template literals instead of strings concatenation - http://eslint.org/docs/rules/prefer-template
    'require-yield': 1, // disallow generator functions that do not have yield - http://eslint.org/docs/rules/require-yield
    'template-curly-spacing': 2, // enforce spacing around embedded expressions of template strings - http://eslint.org/docs/rules/template-curly-spacing
    'yield-star-spacing': 2 // enforce spacing around the * in yield* expressions - http://eslint.org/docs/rules/yield-star-spacing
  }
}
