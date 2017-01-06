'use strict';

exports.statusCodes = exports.statusDescriptions = undefined;

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

exports.getLocalIP = getLocalIP;

var _http = require('http');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _os = require('os');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ifaces = (0, _os.networkInterfaces)();

/**
 * @param {string} requiredIface
 * @return {string}
 */
function getLocalIP(requiredIface) {
    if (typeof requiredIface !== 'string') throw TypeError('utils/ip.js: required interface must be a string');
    if (!_underscore2.default.has(ifaces, requiredIface)) throw Error('utils/ip.js: no such interface \'' + requiredIface + '\'. ' + ('Available interfaces are: ' + (0, _underscore2.default)(ifaces).keys().join(', ')));
    return _underscore2.default.chain(ifaces).pairs().filter(function (_ref) {
        var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
            iface = _ref2[0],
            details = _ref2[1];

        return requiredIface === iface;
    }).map(function (_ref3) {
        var _ref4 = (0, _slicedToArray3.default)(_ref3, 2),
            iface = _ref4[0],
            details = _ref4[1];

        return details;
    }).map(function (details) {
        return (0, _underscore2.default)(details).filter(function (detail) {
            return detail.family === 'IPv4';
        });
    }).map(function (details) {
        return (0, _underscore2.default)(details).map(function (detail) {
            return detail.address;
        });
    }).map(function (details) {
        return (0, _underscore2.default)(details).last();
    }).last().value();
}

/**
 * @type {Object.<string, string>}
 */
var statusDescriptions = exports.statusDescriptions = _http.STATUS_CODES;

/**
 * @type {Object.<string, number>}
 */
var statusCodes = exports.statusCodes = _underscore2.default.chain(_http.STATUS_CODES).pairs().map(function (_ref5) {
    var _ref6 = (0, _slicedToArray3.default)(_ref5, 2),
        codeStr = _ref6[0],
        description = _ref6[1];

    return [parseInt(codeStr), description];
}).map(function (_ref7) {
    var _ref8 = (0, _slicedToArray3.default)(_ref7, 2),
        code = _ref8[0],
        description = _ref8[1];

    return [description.replace(/'m/g, ' am').replace(/'s/g, ' is').replace(/'re/g, ' are').replace(/[- ]/g, '_').toUpperCase(), code];
}).object().value();