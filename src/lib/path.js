import fs from 'fs';
import path from 'path';
import _ from 'underscore';

/**
 * @param {string} dir
 * @return {string[]}
 */
const readdirRecursiveSync = exports.readdirRecursiveSync = (dir) =>
    _.flatten(_.map(fs.readdirSync(dir), fileName => {
        const fullPath = path.join(dir, fileName);
        return fs.statSync(fullPath).isDirectory() ? readdirRecursiveSync(fullPath) : [fullPath];
    }));
