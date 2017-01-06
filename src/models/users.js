// import cson from 'cson';
import path from 'path';
import fs from 'fs';
import _ from 'underscore';
import { throwWithMessage } from '../lib/exceptions';
import schema from '../lib/objects-chema';

var users = {};
var maxID = 0;

const dataFilePath = path.join('data', 'users.cson');
exports.loadUsers = () => {
    // users = cson.load(dataFilePath);
    // maxID = parseInt(_.max(_.keys(users)));
};
// const saveUsers = exports.saveUsers = () =>
//     fs.writeFileSync(dataFilePath, cson.createCSONString(users, { indent: 4 }));

exports.getUserData = () => users;

/**
 * @param {ServerRequest} req
 * @return {bool}
 */
exports.hasUserCookie = (req) =>
    req.cookies.user !== undefined && req.cookies.user !== '';

exports.addUser = (user) => {
    schema.validate(user, {
        'name': schema.required(schema.NotEmptyString),
        'surname': schema.required(schema.NotEmptyString),
        'email': schema.required(schema.Email),
        'password': schema.required(schema.NotEmptyString),
        'group': schema.required(schema.IntegerString),
        'type': schema.required(schema.Enum('student', 'teacher')),
        'lesson': schema.conditional(user.type === 'teacher', 'User isn\'t a teacher', schema.Enum(
            'softskills', 'hardskills'))
    });

    if (userExists(_.pick(user, 'name', 'surname'))) {
        throwWithMessage(
            `There's already ${user.type} in GoITeens with name '${user.name}' and surname '${user.surname}'`);
    } else {
        users[computeUserID(user)] = user.type === 'student' ?
            _.defaults(user, {
                goins: 0,
                purchases: [],
                purchasesLog: [],
                rewardsLog: [],
                punishmentsLog: []
            }) :
            _.defaults(user, { rewardsLog: [], punishmentsLog: [] });
        // saveUsers();
    }
};

const userExists = exports.userExists = (requiredProperties) =>
    _.any(users, user => _.isMatch(user, requiredProperties));

exports.selectUsers = (requiredProperties) =>
    _.filter(users, user => _.isMatch(user, requiredProperties));

const computeUserID = exports.computeUserID = (user) => {
    maxID++;
    return maxID;
};
