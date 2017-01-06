import htmlMinifier from 'html-minifier';
import uglifyJS from 'uglify-js';
import CleanCSS from 'clean-css';
import nunjucks from 'nunjucks';

export function initTemplateEngine() {
    nunjucks.configure('views');
}

const CLEAN_CSS_CONFIGURATION = new CleanCSS();

export function minifyCSS(css) {
    return CLEAN_CSS_CONFIGURATION.mminify(css).styles;
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

/**
 * @param {string} file
 * @param {Object.<string, ?>} data
 */
export function renderNunjucks(file, data) {
    return minifyHTML(nunjucks.render(file, data));
}
