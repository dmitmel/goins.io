'use strict';

exports.default = errorHandler;

var _http = require('./http');

var _util = require('util');

function errorHandler(err, req, res, next) {
    // respect err.statusCode
    if (err.statusCode) {
        res.statusCode = err.statusCode;
    }

    // respect err.status
    if (err.status) res.statusCode = err.status;

    // default status code to 500
    if (res.statusCode < _http.statusCodes.BAD_REQUEST) res.statusCode = 500;

    // log the error
    var str = (0, _util.inspect)(err);
    console.log(str);
    // defer(log, err, str, req, res);

    // cannot actually respond
    // if (res._header) {
    //     req.socket.destroy();
    //     return;
    // }

    // negotiate
    // var accept = accepts(req);
    // var type = accept.type('html', 'json', 'text');

    // Security header for content sniffing
    // res.setHeader('X-Content-Type-Options', 'nosniff');

    // html
    // if (type === 'html') {
    //     var isInspect = !err.stack && String(err) === toString.call(err);
    //     var errorHtml = !isInspect ?
    //         escapeHtmlBlock(str.split('\n', 1)[0] || 'Error') :
    //         'Error';
    //     var stack = !isInspect ?
    //         String(str).split('\n').slice(1) : [str];
    //     var stackHtml = stack
    //         .map((v) => `<li>${ escapeHtmlBlock(v) }</li>`)
    //         .join('');
    //     var body = TEMPLATE
    //         .replace('{style}', STYLESHEET)
    //         .replace('{stack}', stackHtml)
    //         .replace('{title}', escapeHtml(exports.title))
    //         .replace('{statusCode}', res.statusCode)
    //         .replace(/\{error\}/g, errorHtml);
    //     res.setHeader('Content-Type', 'text/html; charset=utf-8');
    //     res.end(body);
    //     // json
    // } else if (type === 'json') {
    //     var error = { message: err.message, stack: err.stack };
    //     for (var prop in err) error[prop] = err[prop];
    //     var json = JSON.stringify({ error }, null, 2);
    //     res.setHeader('Content-Type', 'application/json; charset=utf-8');
    //     res.end(json);
    //     // plain text
    // } else {
    //     res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    //     res.end(str);
    // }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(str);
}