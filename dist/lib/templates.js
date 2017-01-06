'use strict';

exports.initTemplateEngine = initTemplateEngine;
exports.minifyCSS = minifyCSS;
exports.minifyHTML = minifyHTML;
exports.renderNunjucks = renderNunjucks;

var _htmlMinifier = require('html-minifier');

var _htmlMinifier2 = _interopRequireDefault(_htmlMinifier);

var _uglifyJs = require('uglify-js');

var _uglifyJs2 = _interopRequireDefault(_uglifyJs);

var _cleanCss = require('clean-css');

var _cleanCss2 = _interopRequireDefault(_cleanCss);

var _nunjucks = require('nunjucks');

var _nunjucks2 = _interopRequireDefault(_nunjucks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initTemplateEngine() {
    _nunjucks2.default.configure('views');
}

var CLEAN_CSS_CONFIGURATION = new _cleanCss2.default();

function minifyCSS(css) {
    return CLEAN_CSS_CONFIGURATION.mminify(css).styles;
}

/**
 * @param {string} html
 * @return {string}
 */
function minifyHTML(html) {
    return _htmlMinifier2.default.minify(html, {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        maxLineLength: 120,
        minifyCSS: minifyCSS,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true
    });
}

/**
 * @param {string} file
 * @param {Object.<string, ?>} data
 */
function renderNunjucks(file, data) {
    return minifyHTML(_nunjucks2.default.render(file, data));
}