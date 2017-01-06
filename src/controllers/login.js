import { renderNunjucks } from '../lib/templates';
import users from '../models/users';

module.exports = {
    method: 'GET',
    path: '/login',
    handler: (req, res) => {
        res.send(renderNunjucks('login.nunjucks', {
            switchAccount: users.hasUserCookie(req)
        }));
    }
};
