import htmlMinifier from 'html-minifier';
import uglifyJS from 'uglify-js';
import CleanCSS from 'clean-css';
import nunjucks from 'nunjucks';
import _ from 'underscore';
import pathUtils from './path';
import { basename, extname as extension } from 'path';
import { readFileSync as readFile } from 'fs';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('views'));

const CLEAN_CSS_CONFIGURATION = new CleanCSS();

export function minifyCSS(css) {
    return CLEAN_CSS_CONFIGURATION.minify(css).styles;
}

/**
 * @param {string} html
 * @return {string}
 */
export function minifyHTML(html) {
    return htmlMinifier.minify(html, {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        maxLineLength: 120,
        minifyCSS,
        minifyJS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true
    });
}

const version = JSON.parse(readFile('package.json')).version;

/**
 * @param {string} file
 * @param {Object.<string, ?>} data
 */
export function renderNunjucks(file, data) {
    return minifyHTML(env.render(file, _.defaults(data, {
        useCDN: true,
        version
    })));
}

export function getLanguage(req) {
    return req.query.lang || req.cookies.lang || req.language || 'uk-UA';
}

export const i18ns = _.object(_.map(
    _.filter(pathUtils.readdirSync('i18n'),
        _path => pathUtils.isFile(_path) && extension(_path) == '.json'),
    langFile => [basename(langFile, '.json'), JSON.parse(readFile(langFile))]
));
