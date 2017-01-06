'use strict';

var _templates = require('../lib/templates');

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    method: 'GET',
    path: '/',
    handler: function handler(req, res) {
        if (_users2.default.hasUserCookie(req)) {
            res.send((0, _templates.renderNunjucks)('index.nunjucks'));
        } else {
            res.redirect('/login');
        }
    }
};