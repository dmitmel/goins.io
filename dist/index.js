'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _path3 = require('./lib/path');

var _exceptions = require('./lib/exceptions');

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _templates = require('./lib/templates');

var _templates2 = _interopRequireDefault(_templates);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _users = require('./models/users');

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _methodOverride = require('method-override');

var _methodOverride2 = _interopRequireDefault(_methodOverride);

var _http = require('./lib/http');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { getLocalIP } from './lib/http';
var port = 8080;
// import bodyParser from 'body-parser';
// eslint-disable-line no-unused-vars

var host = 'localhost';
// const host = getLocalIP('en0');
var app = (0, _express2.default)();

app.use((0, _morgan2.default)(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" - :status - ' + ':res[content-length] bits, :response-time ms'));
app.use(_express2.default.static('public'));
// app.use(bodyParser());
app.use((0, _methodOverride2.default)());
app.use((0, _cookieParser2.default)({
    path: '/'
}));

_templates2.default.initTemplateEngine();
(0, _users.loadUsers)();

var controllersDir = _path2.default.join(__dirname, 'controllers');
(0, _underscore2.default)((0, _underscore2.default)((0, _path3.readdirRecursiveSync)(controllersDir)).filter(function (file) {
    return _path2.default.extname(file) === 'js';
})).each(function (file) {
    var controllerName = _path2.default.basename(file, _path2.default.extname(file));
    var controller = require(file); // eslint-disable-line global-require

    var method = controller.method.toLowerCase() || 'all';
    var path_ = controller.path || (0, _exceptions.throwWithMessage)('index.js: No path provided for controller \'' + controllerName + '\'. ' + 'Please, use field \'path\'.');
    var handler = controller.handler || (0, _exceptions.throwWithMessage)('index.js: No handler provided for controller \'' + controllerName + '\'. ' + 'Please, use field \'handler\'.');
    app[method](path_, handler);
});

app.use(function (req, res) {
    res.status(_http.statusCodes.NOT_FOUND);
    res.send(_templates2.default.renderNunjucks('errors/404.nunjucks', {
        url: req.path
    }));
});

app.listen(port, host, function () {
    console.log('\nServer started on http://' + host + ':' + port + '/');
});