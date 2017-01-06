'use strict';

var _templates = require('../lib/templates');

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    method: 'GET',
    path: '/login',
    handler: function handler(req, res) {
        res.send((0, _templates.renderNunjucks)('login.nunjucks', {
            switchAccount: _users2.default.hasUserCookie(req)
        }));
    }
};