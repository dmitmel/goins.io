import fs from 'fs';
import path from 'path';
import _ from 'underscore';

/**
 * @param {string} dir
 * @return {string[]}
 */
export function readdirRecursiveSync(dir) {
    return _.flatten(_.map(fs.readdirSync(dir), fileName => {
        const fullPath = path.join(dir, fileName);
        return fs.statSync(fullPath).isDirectory() ? readdirRecursiveSync(fullPath) : [fullPath];
    }));
}

/**
 * @param {string} dir
 * @return {string[]}
 */
export function readdirSync(dir) {
    return _.map(fs.readdirSync(dir), fileName => `${dir}/${fileName}`);
}

/**
 * @param {string} _path
 * @return {bool}
 */
export function isDirectory(_path) {
    return fs.statSync(_path).isDirectory();
}

/**
 * @param {string} _path
 * @return {bool}
 */
export function isFile(_path) {
    return fs.statSync(_path).isFile();
}
