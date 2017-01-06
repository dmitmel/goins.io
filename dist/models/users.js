'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _exceptions = require('../lib/exceptions');

var _objectsChema = require('../lib/objects-chema');

var _objectsChema2 = _interopRequireDefault(_objectsChema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var users = {}; // import cson from 'cson';

var maxID = 0;

var dataFilePath = _path2.default.join('data', 'users.cson');
exports.loadUsers = function () {
    // users = cson.load(dataFilePath);
    // maxID = parseInt(_.max(_.keys(users)));
};
// const saveUsers = exports.saveUsers = () =>
//     fs.writeFileSync(dataFilePath, cson.createCSONString(users, { indent: 4 }));

exports.getUserData = function () {
    return users;
};

/**
 * @param {ServerRequest} req
 * @return {bool}
 */
exports.hasUserCookie = function (req) {
    return req.cookies.user !== undefined && req.cookies.user !== '';
};

exports.addUser = function (user) {
    _objectsChema2.default.validate(user, {
        'name': _objectsChema2.default.required(_objectsChema2.default.NotEmptyString),
        'surname': _objectsChema2.default.required(_objectsChema2.default.NotEmptyString),
        'email': _objectsChema2.default.required(_objectsChema2.default.Email),
        'password': _objectsChema2.default.required(_objectsChema2.default.NotEmptyString),
        'group': _objectsChema2.default.required(_objectsChema2.default.IntegerString),
        'type': _objectsChema2.default.required(_objectsChema2.default.Enum('student', 'teacher')),
        'lesson': _objectsChema2.default.conditional(user.type === 'teacher', 'User isn\'t a teacher', _objectsChema2.default.Enum('softskills', 'hardskills'))
    });

    if (userExists(_underscore2.default.pick(user, 'name', 'surname'))) {
        (0, _exceptions.throwWithMessage)('There\'s already ' + user.type + ' in GoITeens with name \'' + user.name + '\' and surname \'' + user.surname + '\'');
    } else {
        users[computeUserID(user)] = user.type === 'student' ? _underscore2.default.defaults(user, {
            goins: 0,
            purchases: [],
            purchasesLog: [],
            rewardsLog: [],
            punishmentsLog: []
        }) : _underscore2.default.defaults(user, { rewardsLog: [], punishmentsLog: [] });
        // saveUsers();
    }
};

var userExists = exports.userExists = function (requiredProperties) {
    return _underscore2.default.any(users, function (user) {
        return _underscore2.default.isMatch(user, requiredProperties);
    });
};

exports.selectUsers = function (requiredProperties) {
    return _underscore2.default.filter(users, function (user) {
        return _underscore2.default.isMatch(user, requiredProperties);
    });
};

var computeUserID = exports.computeUserID = function (user) {
    maxID++;
    return maxID;
};