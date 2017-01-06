import { STATUS_CODES } from 'http';
import _ from 'underscore';
import { networkInterfaces } from 'os';

const ifaces = networkInterfaces();

/**
 * @param {string} requiredIface
 * @return {string}
 */
export function getLocalIP(requiredIface) {
    if (typeof requiredIface !== 'string')
        throw TypeError('utils/ip.js: required interface must be a string');
    if (!_.has(ifaces, requiredIface))
        throw Error(`utils/ip.js: no such interface '${requiredIface}'. ` +
            `Available interfaces are: ${_(ifaces).keys().join(', ')}`);
    return _.chain(ifaces)
        .pairs()
        .filter(([iface, details]) => requiredIface === iface)
        .map(([iface, details]) => details)
        .map(details => _(details).filter(detail => detail.family === 'IPv4'))
        .map(details => _(details).map(detail => detail.address))
        .map(details => _(details).last())
        .last()
        .value();
}


/**
 * @type {Object.<string, string>}
 */
export const statusDescriptions = STATUS_CODES;

/**
 * @type {Object.<string, number>}
 */
export const statusCodes = _.chain(STATUS_CODES)
    .pairs()
    .map(([codeStr, description]) => [parseInt(codeStr), description])
    .map(([code, description]) => [
        description.replace(/'m/g, ' am')
                   .replace(/'s/g, ' is')
                   .replace(/'re/g, ' are')
                   .replace(/[- ]/g, '_')
                   .toUpperCase(), code])
    .object()
    .value();
