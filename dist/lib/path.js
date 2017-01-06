'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {string} dir
 * @return {string[]}
 */
var readdirRecursiveSync = exports.readdirRecursiveSync = function (dir) {
    return _underscore2.default.flatten(_underscore2.default.map(_fs2.default.readdirSync(dir), function (fileName) {
        var fullPath = _path2.default.join(dir, fileName);
        return _fs2.default.statSync(fullPath).isDirectory() ? readdirRecursiveSync(fullPath) : [fullPath];
    }));
};