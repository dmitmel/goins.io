'use strict';

exports.Function = exports.Boolean = exports.Number = exports.AlphanumString = exports.NumberString = exports.IntegerString = exports.Email = exports.NotEmptyString = exports.String = exports.Any = exports.ValidationError = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.and = and;
exports.required = required;
exports.optional = optional;
exports.conditional = conditional;
exports.checkValue = checkValue;
exports.Enum = Enum;
exports.regexp = regexp;
exports.Object = Object;
exports.Array = Array;
exports.NotEmptyArray = NotEmptyArray;
exports.min = min;
exports.max = max;
exports.minLength = minLength;
exports.maxLength = maxLength;
exports.validate = validate;

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @tutorial lib/object-schema
 * @module lib/object-schema
 */

var ValidationError = exports.ValidationError = function () {
    function ValidationError(path, value, message) {
        (0, _classCallCheck3.default)(this, ValidationError);

        this.path = path;
        this.value = value;
        this.message = message;
    }

    (0, _createClass3.default)(ValidationError, [{
        key: 'toString',
        value: function toString() {
            return this.path.join('/') + ': ' + (0, _util.inspect)(this.value) + ': ' + this.message;
        }
    }]);
    return ValidationError;
}();

/**
 * @callback TypePredicate
 * Callback for type predicates. Type predicate is a function, that checks property and
 * returns array of errors.
 * @param  {Object} object     object
 * @param  {string} prop       property name
 * @return {ValidationError[]} array of errors (empty array indicates that property is valid)
 * @see checkValue
 * @see ValuePredicate
 */

/**
 * @callback ValuePredicate
 * Callback for value predicates. Value predicate works like {@link TypePredicate}, but
 * accepts value and property name.
 * @param  {Object} object     object
 * @param  {string} prop       property name
 * @return {ValidationError[]} array of errors (empty array indicates that property is valid)
 * @see checkValue
 * @see TypePredicate
 */

/**
 * Combine type predicates with logical **AND** operation.
 * @param  {...TypePredicate} predicates
 * @return {TypePredicate}
 * @see TypePredicate
 */


function and() {
    for (var _len = arguments.length, predicates = Array(_len), _key = 0; _key < _len; _key++) {
        predicates[_key] = arguments[_key];
    }

    return function (object, prop) {
        return _underscore2.default.foldl(predicates, function (errors, predicate) {
            return _underscore2.default.isEmpty(errors) ? predicate(object, prop) : errors;
        }, []);
    };
}

/**
 * Returns type predicate, that:
 * 1. If property is `undefined`/`null` - returns error.
 * 2. otherwise - calls predicate.
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 * @see TypePredicate
 * @see optional
 * @see conditional
 */
function required(predicate) {
    return function (object, prop) {
        return _underscore2.default.has(object, prop) && object[prop] !== null ? // if
        predicate(object, prop) : // then
        object[prop] === null ? // else if
        [new ValidationError([prop], null, 'is null')] : // then
        [new ValidationError([prop], undefined, 'is undefined')];
    }; // else
}

/**
 * Returns type predicate, that:
 * 1. If property is `undefined`/`null` - returns no errors.
 * 2. otherwise - calls predicate.
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 * @see TypePredicate
 * @see required
 * @see conditional
 */
function optional(predicate) {
    return function (object, prop) {
        return _underscore2.default.has(object, prop) && object[prop] !== null ? predicate(object, prop) : [];
    };
}

/**
 * Returns type predicate, that:
 * 1. If property is `undefined`/`null` - return no errors.
 * 2. if condition is `true` - calls predicate.
 * 3. if condition is `false` - returns error with error message.
 * @param  {bool}          condition
 * @param  {string}        errorMessage
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 * @see TypePredicate
 * @see required
 * @see optional
 */

function conditional(condition, errorMessage, predicate) {
    return function (object, prop) {
        return _underscore2.default.isFunction(condition) && condition() || condition ? // if
        predicate(object, prop) : // then
        _underscore2.default.has(object, prop) && object[prop] !== null ? // else if
        [_underscore2.default.isFunction(errorMessage) ? errorMessage() : errorMessage] : // then
        [];
    }; // else
}

/**
 * Transforms value predicate into type predicate.
 * @param  {ValuePredicate} predicate
 * @return {TypePredicate}
 * @see TypePredicate
 * @see ValuePredicate
 */
function checkValue(predicate) {
    return function (object, prop) {
        return predicate(object[prop], prop);
    };
}

function invalidTypeError(prop, value, expected) {
    return new ValidationError([prop], value, 'has type \'' + (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) + '\', but expected type is ' + expected);
}

/**
 * Type predicate for any type.
 * @constant
 * @type {TypePredicate}
 * @see TypePredicate
 */
var Any = exports.Any = function Any(object, prop) {
    return [];
}; // eslint-disable-line no-unused-vars

/**
 * Type predicate for strings.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 * @see regexp
 * @see IntegerString
 * @see NumberString
 * @see Email
 */
var String = exports.String = checkValue(function (value, prop) {
    return _underscore2.default.isString(value) ? [] : [invalidTypeError(prop, value, 'String')];
});

/**
 * Type predicate for not empty strings.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see String
 */
var NotEmptyString = exports.NotEmptyString = and(String, checkValue(function (value, prop) {
    return _underscore2.default.isEmpty(value) ? [new ValidationError([prop], value, 'is empty')] : [];
}));

var emailUserPartRegexp = /^([A-Z0-9_%+\-!#$&'*/=?^`{|}~]+\.?)*[A-Z0-9_%+\-!#$&'*/=?^`{|}~]+$/i;
var emailDomainPartRegexp = /^([A-Z0-9-]+\.?)*[A-Z0-9-]+(\.[A-Z]{2,9})+$/i;
/**
 * Type predicate for strings with email.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 */
var Email = exports.Email = and(NotEmptyString, checkValue(function (value, prop) {
    var tab = value.split('@');
    if (tab.length !== 2 || !emailUserPartRegexp.test(tab[0]) || !emailDomainPartRegexp.test(tab[1])) // eslint-disable-line no-magic-numbers
        return [new ValidationError([prop], value, 'isn\'t a valid email address')];else return [];
}));

var integerRegexp = /^-?(0|[1-9]\d*)\.?$/;
/**
 * Type predicate for strings with integer literal.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 * @see NumberString
 */
var IntegerString = exports.IntegerString = and(NotEmptyString, checkValue(function (value, prop) {
    return integerRegexp.test(value) ? [] : [new ValidationError([prop], value, 'isn\'t an integer literal')];
}));

var numberRegexp = /^-?(0|[1-9]\d*)\.?\d*([Ee][+-]?(0|[1-9]\d*))?$/;
/**
 * Type predicate for strings with integer or float literal.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 * @see IntegerString
 */
var NumberString = exports.NumberString = and(NotEmptyString, checkValue(function (value, prop) {
    return !numberRegexp.test(value) ? [] : [new ValidationError([prop], value, 'isn\'t a float literal')];
}));

/**
 * Type predicate for enums.
 * @param  {...*}          values
 * @return {TypePredicate}
 * @see TypePredicate
 */
function Enum() {
    for (var _len2 = arguments.length, values = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        values[_key2] = arguments[_key2];
    }

    return checkValue(function (value, prop) {
        return _underscore2.default.contains(values, value) ? [] : [new ValidationError([prop], value, 'isn\'t in enum [' + values.join(', ') + ']')];
    });
}

/**
 * Returns type predicate, that checks if string matches regexp.
 * @param  {string|Regexp} _regexp
 * @return {TypePredicate}
 * @see TypePredicate
 * @see String
 */
function regexp(_regexp) {
    return and(String, checkValue(function (value, prop) {
        return _regexp.test(value) ? [] : [new ValidationError([prop], value, 'doesn\'t match regexp ' + _regexp)];
    }));
}

var alphanumRegexp = /^[a-zA-Z0-9]+$/;
/**
 * Type predicate for strings with only alpha-numeric characters.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 */
var AlphanumString = exports.AlphanumString = and(NotEmptyString, checkValue(function (value, prop) {
    return alphanumRegexp.test(value) ? [] : [new ValidationError([prop], value, 'isn\'t alpha-numeric')];
}));

/**
 * Type predicate for numbers.
 * @type {TypePredicate}
 * @see TypePredicate
 */
var Number = exports.Number = checkValue(function (value, prop) {
    return _underscore2.default.isNumber(value) ? [] : invalidTypeError(prop, value, 'Number');
});

/**
 * Type predicate for booleans.
 * @type {TypePredicate}
 * @see TypePredicate
 */
var Boolean = exports.Boolean = checkValue(function (value, prop) {
    return _underscore2.default.isBoolean(value) ? [] : [invalidTypeError(prop, value, 'Boolean')];
});

/**
 * Type predicate for objects.
 * @param  {Object.<string, TypePredicate>} schema
 * @return {TypePredicate}
 * @see TypePredicate
 */
function Object(schema) {
    return checkValue(function (value, prop) {
        return _underscore2.default.isObject(value) ? validate(value, schema).errors : [invalidTypeError(prop, value, 'Object')];
    });
}

/**
 * Type predicate for functions.
 * @type {TypePredicate}
 * @see TypePredicate
 */
var Function = exports.Function = checkValue(function (value, prop) {
    return _underscore2.default.isFunction(value) ? [] : [invalidTypeError(prop, value, 'Function')];
});

function prepend(value, array) {
    // Use "slice" to avoid mutating "a".
    var newArray = array.slice(0); // eslint-disable-line no-magic-numbers
    newArray.unshift(value);
    return newArray;
}

/**
 * Type predicate for arrays.
 * @param  {TypePredicate} predicate type predicate for all elements in array.
 * @return {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyArray
 * @see minLength
 * @see maxLength
 */
function Array(predicate) {
    return checkValue(function (value, prop) {
        return _underscore2.default.isArray(value) ? _underscore2.default.map(_underscore2.default.flatten(_underscore2.default.map(value, function (element, index) {
            return predicate(value, index);
        })), function (_ref) {
            var path = _ref.path,
                errorValue = _ref.value,
                message = _ref.message;
            return new ValidationError(prepend(prop, path), errorValue, message);
        }) : invalidTypeError(prop, value, 'Array');
    });
}

/**
 * Type predicate for not empty arrays.
 * @param  {TypePredicate} predicate type predicate for all elements in array.
 * @return {TypePredicate}
 * @see TypePredicate
 * @see Array
 * @see minLength
 * @see maxLength
 */
function NotEmptyArray(predicate) {
    return and(checkValue(function (value, prop) {
        return !_underscore2.default.isArray(value) ? // if
        invalidTypeError(prop, value, 'Array') : // then
        _underscore2.default.isEmpty(value) ? // else if
        [new ValidationError([prop], value, 'is empty')] : // then
        [];
    }), // else
    Array(predicate));
}

/**
 * Type decorator that adds min value to type predicate.
 * @param  {*}             minValue
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
function min(minValue, predicate) {
    return and(predicate, checkValue(function (value, prop) {
        return value < minValue ? [new ValidationError([prop], value, 'is less than min value \'' + minValue + '\'')] : [];
    }));
}

/**
 * Type decorator that adds max value to type predicate.
 * @param  {*}             maxValue
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
function max(maxValue, predicate) {
    return and(predicate, checkValue(function (value, prop) {
        return value > maxValue ? [new ValidationError([prop], value, 'is greater than max value \'' + maxValue + '\'')] : [];
    }));
}

/**
 * Type decorator that adds max length to type predicate.
 * @param  {*}             maxLen
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
function minLength(minLen, predicate) {
    return and(predicate, checkValue(function (value, prop) {
        return value.length < minLen ? [new ValidationError([prop], value, 'length is less than min value \'' + minLen + '\'')] : [];
    }));
}

/**
 * Type decorator that adds min length to type predicate.
 * @param  {*}             minLen
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
function maxLength(maxLen, predicate) {
    return and(predicate, checkValue(function (value, prop) {
        return value.length > maxLen ? [new ValidationError([prop], value, 'length is greater than max value \'' + maxLen + '\'')] : [];
    }));
}

/**
 * Validates object with schema.
 * @param  {Object} object
 * @param  {Object} schema
 * @return {Object}        validation result with 2 properties: `valid` (`bool`) and
 *                         `errors` (`TypePredicate[]`)
 * @see TypePredicate
 * @tutorial object-schema
 */
function validate(object, schema) {
    var errors = _underscore2.default.flatten(_underscore2.default.map(_underscore2.default.pairs(schema), function (_ref2) {
        var _ref3 = (0, _slicedToArray3.default)(_ref2, 2),
            prop = _ref3[0],
            predicate = _ref3[1];

        return predicate(object, prop);
    }));
    return { valid: _underscore2.default.isEmpty(errors), errors: errors };
}