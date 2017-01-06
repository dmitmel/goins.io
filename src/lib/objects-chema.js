import _ from 'underscore';
import { inspect } from 'util';

/**
 * @tutorial lib/object-schema
 * @module lib/object-schema
 */

export class ValidationError {
    constructor(path, value, message) {
        this.path = path;
        this.value = value;
        this.message = message;
    }

    toString() {
        return `${this.path.join('/')}: ${inspect(this.value)}: ${this.message}`;
    }
}

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
export function and(...predicates) {
    return (object, prop) =>
        _.foldl(predicates, (errors, predicate) => _.isEmpty(errors) ? predicate(object, prop) : errors, []);
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
export function required(predicate) {
    return (object, prop) =>
        _.has(object, prop) && object[prop] !== null ? // if
        predicate(object, prop) : // then
        object[prop] === null ? // else if
        [new ValidationError([prop], null, 'is null')] : // then
        [new ValidationError([prop], undefined, 'is undefined')]; // else
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
export function optional(predicate) {
    return (object, prop) => _.has(object, prop) && object[prop] !== null ? predicate(object, prop) : [];
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

export function conditional(condition, errorMessage, predicate) {
    return (object, prop) =>
        (_.isFunction(condition) && condition()) || condition ? // if
        predicate(object, prop) : // then
        _.has(object, prop) && object[prop] !== null ? // else if
        [_.isFunction(errorMessage) ? errorMessage() : errorMessage] : // then
        []; // else
}

/**
 * Transforms value predicate into type predicate.
 * @param  {ValuePredicate} predicate
 * @return {TypePredicate}
 * @see TypePredicate
 * @see ValuePredicate
 */
export function checkValue(predicate) {
    return (object, prop) => predicate(object[prop], prop);
}

function invalidTypeError(prop, value, expected) {
    return new ValidationError([prop], value,
        `has type '${typeof value}', but expected type is ${expected}`);
}

/**
 * Type predicate for any type.
 * @constant
 * @type {TypePredicate}
 * @see TypePredicate
 */
export const Any = (object, prop) => []; // eslint-disable-line no-unused-vars

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
export const String = checkValue((value, prop) => _.isString(value) ? [] : [invalidTypeError(prop, value, 'String')]);

/**
 * Type predicate for not empty strings.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see String
 */
export const NotEmptyString = and(String, checkValue((value, prop) =>
    _.isEmpty(value) ? [new ValidationError([prop], value, 'is empty')] : []));

const emailUserPartRegexp = /^([A-Z0-9_%+\-!#$&'*/=?^`{|}~]+\.?)*[A-Z0-9_%+\-!#$&'*/=?^`{|}~]+$/i;
const emailDomainPartRegexp = /^([A-Z0-9-]+\.?)*[A-Z0-9-]+(\.[A-Z]{2,9})+$/i;
/**
 * Type predicate for strings with email.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 */
export const Email = and(NotEmptyString, checkValue((value, prop) => {
    const tab = value.split('@');
    if (tab.length !== 2 || !emailUserPartRegexp.test(tab[0]) || !emailDomainPartRegexp.test(tab[1])) // eslint-disable-line no-magic-numbers
        return [new ValidationError([prop], value, 'isn\'t a valid email address')];
    else
        return [];
}));

const integerRegexp = /^-?(0|[1-9]\d*)\.?$/;
/**
 * Type predicate for strings with integer literal.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 * @see NumberString
 */
export const IntegerString = and(NotEmptyString, checkValue((value, prop) =>
    integerRegexp.test(value) ? [] : [new ValidationError([prop], value, 'isn\'t an integer literal')]));

const numberRegexp = /^-?(0|[1-9]\d*)\.?\d*([Ee][+-]?(0|[1-9]\d*))?$/;
/**
 * Type predicate for strings with integer or float literal.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 * @see IntegerString
 */
export const NumberString = and(NotEmptyString, checkValue((value, prop) =>
    !numberRegexp.test(value) ? [] : [new ValidationError([prop], value, 'isn\'t a float literal')]));

/**
 * Type predicate for enums.
 * @param  {...*}          values
 * @return {TypePredicate}
 * @see TypePredicate
 */
export function Enum(...values) {
    return checkValue((value, prop) =>
        _.contains(values, value) ? [] : [new ValidationError([prop], value, `isn't in enum [${values.join(', ')}]`)]
    );
}

/**
 * Returns type predicate, that checks if string matches regexp.
 * @param  {string|Regexp} _regexp
 * @return {TypePredicate}
 * @see TypePredicate
 * @see String
 */
export function regexp(_regexp) {
    return and(String, checkValue((value, prop) =>
        _regexp.test(value) ? [] : [new ValidationError([prop], value, `doesn't match regexp ${_regexp}`)]));
}

const alphanumRegexp = /^[a-zA-Z0-9]+$/;
/**
 * Type predicate for strings with only alpha-numeric characters.
 * @type {TypePredicate}
 * @see TypePredicate
 * @see NotEmptyString
 */
export const AlphanumString = and(NotEmptyString, checkValue((value, prop) =>
    alphanumRegexp.test(value) ? [] : [new ValidationError([prop], value, 'isn\'t alpha-numeric')]));

/**
 * Type predicate for numbers.
 * @type {TypePredicate}
 * @see TypePredicate
 */
export const Number = checkValue((value, prop) => _.isNumber(value) ? [] : invalidTypeError(prop, value, 'Number'));

/**
 * Type predicate for booleans.
 * @type {TypePredicate}
 * @see TypePredicate
 */
export const Boolean = checkValue((value, prop) => _.isBoolean(value) ? [] : [invalidTypeError(prop, value, 'Boolean')]);

/**
 * Type predicate for objects.
 * @param  {Object.<string, TypePredicate>} schema
 * @return {TypePredicate}
 * @see TypePredicate
 */
export function Object(schema) {
    return checkValue((value, prop) =>
        _.isObject(value) ? validate(value, schema).errors : [invalidTypeError(prop, value, 'Object')]);
}

/**
 * Type predicate for functions.
 * @type {TypePredicate}
 * @see TypePredicate
 */
export const Function = checkValue((value, prop) =>
    _.isFunction(value) ? [] : [invalidTypeError(prop, value, 'Function')]);

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
export function Array(predicate) {
    return checkValue((value, prop) =>
        _.isArray(value) ?
        _.map(_.flatten(_.map(value, (element, index) => predicate(value, index))),
            ({ path, value: errorValue, message }) => new ValidationError(prepend(prop, path), errorValue, message)
        ) :
        invalidTypeError(prop, value, 'Array'));
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
export function NotEmptyArray(predicate) {
    return and(
        checkValue((value, prop) =>
            !_.isArray(value) ? // if
            invalidTypeError(prop, value, 'Array') : // then
            _.isEmpty(value) ? // else if
            [new ValidationError([prop], value, 'is empty')] : // then
            []), // else
        Array(predicate));
}

/**
 * Type decorator that adds min value to type predicate.
 * @param  {*}             minValue
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
export function min(minValue, predicate) {
    return and(predicate, checkValue((value, prop) =>
        value < minValue ? [new ValidationError([prop], value, `is less than min value '${minValue}'`)] : []));
}

/**
 * Type decorator that adds max value to type predicate.
 * @param  {*}             maxValue
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
export function max(maxValue, predicate) {
    return and(predicate, checkValue((value, prop) =>
        value > maxValue ? [new ValidationError([prop], value, `is greater than max value '${maxValue}'`)] : []
    ));
}

/**
 * Type decorator that adds max length to type predicate.
 * @param  {*}             maxLen
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
export function minLength(minLen, predicate) {
    return and(predicate, checkValue((value, prop) =>
        value.length < minLen ? [new ValidationError([prop], value,
            `length is less than min value '${minLen}'`)] : []));
}

/**
 * Type decorator that adds min length to type predicate.
 * @param  {*}             minLen
 * @param  {TypePredicate} predicate
 * @return {TypePredicate}
 */
export function maxLength(maxLen, predicate) {
    return and(predicate, checkValue((value, prop) =>
        value.length > maxLen ? [new ValidationError([prop], value,
            `length is greater than max value '${maxLen}'`)] : []));
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
export function validate(object, schema) {
    var errors = _.flatten(_.map(_.pairs(schema), ([prop, predicate]) => predicate(object, prop)));
    return { valid: _.isEmpty(errors), errors };
}
